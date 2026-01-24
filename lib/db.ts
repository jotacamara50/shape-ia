import { Pool } from "pg";
import * as mockDB from "./mock-db";

// Criar conexão com PostgreSQL local
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  quiz_data: any;
  status: "pending" | "paid" | "failed";
  payment_id?: string;
  payment_method?: string;
  amount: number;
  download_token: string;
  created_at: Date;
  paid_at?: Date;
}

export interface Payment {
  id: string;
  order_id: string;
  mp_payment_id: string;
  status: string;
  amount: number;
  payment_method: string;
  created_at: Date;
}

// Inicializar tabelas (rodar apenas uma vez)
export async function initDatabase() {
  // Se estiver usando mock DB, usar versão em memória
  if (mockDB.useMockDB) {
    return mockDB.mockInitDatabase();
  }

  try {
    // Criar tabela de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        quiz_data JSONB NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_id TEXT,
        payment_method TEXT,
        amount DECIMAL(10, 2) NOT NULL,
        download_token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        paid_at TIMESTAMP
      )
    `);

    // Criar tabela de pagamentos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        order_id TEXT REFERENCES orders(id),
        mp_payment_id TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_method TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Criar índices
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_orders_token ON orders(download_token)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_payments_mp_id ON payments(mp_payment_id)`);

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

// Criar novo pedido
export async function createOrder(data: {
  customerEmail: string;
  customerName: string;
  quizData: any;
  amount: number;
  downloadToken: string;
}) {
  if (mockDB.useMockDB) {
    return mockDB.mockCreateOrder(data);
  }

  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const result = await pool.query(
    `INSERT INTO orders (
      id, customer_email, customer_name, quiz_data, amount, download_token, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [orderId, data.customerEmail, data.customerName, JSON.stringify(data.quizData), data.amount, data.downloadToken, 'pending']
  );

  return result.rows[0] as Order;
}

// Atualizar status do pedido
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  paymentId?: string,
  paymentMethod?: string
) {
  if (mockDB.useMockDB) {
    return mockDB.mockUpdateOrderStatus(orderId, status, paymentId, paymentMethod);
  }

  const paidAt = status === "paid" ? new Date() : null;

  await pool.query(
    `UPDATE orders
    SET status = $1, 
        payment_id = $2,
        payment_method = $3,
        paid_at = $4
    WHERE id = $5`,
    [status, paymentId || null, paymentMethod || null, paidAt, orderId]
  );
}

// Atualizar email do cliente
export async function updateOrderEmail(orderId: string, email: string) {
  if (mockDB.useMockDB) {
    return mockDB.mockUpdateOrderEmail(orderId, email);
  }

  await pool.query(
    `UPDATE orders
     SET customer_email = $1
     WHERE id = $2`,
    [email, orderId]
  );
}

// Buscar pedido por token
export async function getOrderByToken(token: string) {
  if (mockDB.useMockDB) {
    return mockDB.mockGetOrderByToken(token);
  }

  const result = await pool.query(
    'SELECT * FROM orders WHERE download_token = $1 LIMIT 1',
    [token]
  );

  return result.rows[0] as Order | undefined;
}

// Buscar pedido por ID
export async function getOrderById(orderId: string) {
  if (mockDB.useMockDB) {
    return mockDB.mockGetOrderById(orderId);
  }

  const result = await pool.query(
    'SELECT * FROM orders WHERE id = $1 LIMIT 1',
    [orderId]
  );
  
  return result.rows[0] as Order | undefined;
}

// Salvar pagamento
export async function savePayment(data: {
  orderId: string;
  mpPaymentId: string;
  status: string;
  amount: number;
  paymentMethod: string;
}) {
  if (mockDB.useMockDB) {
    return mockDB.mockSavePayment(data);
  }

  const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  const result = await pool.query(
    `INSERT INTO payments (
      id, order_id, mp_payment_id, status, amount, payment_method
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [paymentId, data.orderId, data.mpPaymentId, data.status, data.amount, data.paymentMethod]
  );

  return result.rows[0] as Payment;
}

// Buscar pagamento por ID do Mercado Pago
export async function getPaymentByMpId(mpPaymentId: string) {
  if (mockDB.useMockDB) {
    return mockDB.mockGetPaymentByMpId(mpPaymentId);
  }

  const result = await pool.query(
    'SELECT * FROM payments WHERE mp_payment_id = $1 LIMIT 1',
    [mpPaymentId]
  );

  return result.rows[0] as Payment | undefined;
}

// Verificar se o pedido foi pago
export async function isOrderPaid(orderId: string): Promise<boolean> {
  if (mockDB.useMockDB) {
    return mockDB.mockIsOrderPaid(orderId);
  }

  const result = await pool.query(
    "SELECT status FROM orders WHERE id = $1 AND status = 'paid' LIMIT 1",
    [orderId]
  );

  return result.rows.length > 0;
}

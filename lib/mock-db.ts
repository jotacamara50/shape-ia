// Mock Database para desenvolvimento SEM Postgres
// ⚠️ NÃO USAR EM PRODUÇÃO!

import { Order, Payment } from "./db";

// Armazenamento em memória (resetado ao reiniciar o servidor)
const mockOrders: Map<string, Order> = new Map();
const mockPayments: Map<string, Payment> = new Map();

export const useMockDB = process.env.USE_MOCK_DB === "true";

export async function mockInitDatabase() {
  console.log("✅ Mock Database initialized (in-memory only)");
}

export async function mockCreateOrder(data: {
  customerEmail: string;
  customerName: string;
  quizData: any;
  amount: number;
  downloadToken: string;
}) {
  const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const order: Order = {
    id: orderId,
    customer_email: data.customerEmail,
    customer_name: data.customerName,
    quiz_data: data.quizData,
    status: "pending",
    amount: data.amount,
    download_token: data.downloadToken,
    created_at: new Date(),
  };

  mockOrders.set(orderId, order);
  console.log(`📝 Mock Order created: ${orderId}`);
  return order;
}

export async function mockUpdateOrderStatus(
  orderId: string,
  status: Order["status"],
  paymentId?: string,
  paymentMethod?: string
) {
  const order = mockOrders.get(orderId);
  if (order) {
    order.status = status;
    order.payment_id = paymentId;
    order.payment_method = paymentMethod;
    if (status === "paid") {
      order.paid_at = new Date();
    }
    mockOrders.set(orderId, order);
    console.log(`✅ Mock Order ${orderId} updated to: ${status}`);
  }
}

export async function mockGetOrderByToken(token: string) {
  for (const order of mockOrders.values()) {
    if (order.download_token === token) {
      return order;
    }
  }
  return undefined;
}

export async function mockGetOrderById(orderId: string) {
  return mockOrders.get(orderId);
}

export async function mockSavePayment(data: {
  orderId: string;
  mpPaymentId: string;
  status: string;
  amount: number;
  paymentMethod: string;
}) {
  const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const payment: Payment = {
    id: paymentId,
    order_id: data.orderId,
    mp_payment_id: data.mpPaymentId,
    status: data.status,
    amount: data.amount,
    payment_method: data.paymentMethod,
    created_at: new Date(),
  };

  mockPayments.set(paymentId, payment);
  console.log(`💳 Mock Payment saved: ${paymentId}`);
  return payment;
}

export async function mockGetPaymentByMpId(mpPaymentId: string) {
  for (const payment of mockPayments.values()) {
    if (payment.mp_payment_id === mpPaymentId) {
      return payment;
    }
  }
  return undefined;
}

export async function mockIsOrderPaid(orderId: string): Promise<boolean> {
  const order = mockOrders.get(orderId);
  return order?.status === "paid" || false;
}

# 🗄️ Configuração do Banco de Dados - Shape IA

## Por que precisamos de um Banco de Dados?

**Problema sem BD:**
- ❌ Não sabe se o cliente pagou
- ❌ Cliente pode baixar sem pagar
- ❌ Sem histórico de vendas
- ❌ Impossível enviar email após pagamento

**Solução com BD:**
- ✅ Valida pagamento antes de liberar PDF
- ✅ Controle de acesso via token único
- ✅ Histórico completo de vendas
- ✅ Integração com webhook do Mercado Pago
- ✅ Permite envio de email automático

---

## 📊 Estrutura do Banco

### Tabela: `orders` (Pedidos)
```sql
- id              # ID único do pedido (ORD-xxx)
- customer_email  # Email do cliente
- customer_name   # Nome do cliente
- quiz_data       # Dados do quiz (JSON)
- status          # pending | paid | failed
- payment_id      # ID do pagamento MP
- payment_method  # pix | credit_card
- amount          # Valor pago
- download_token  # Token único para download
- created_at      # Data de criação
- paid_at         # Data do pagamento
```

### Tabela: `payments` (Pagamentos)
```sql
- id             # ID único do pagamento
- order_id       # Referência ao pedido
- mp_payment_id  # ID do Mercado Pago
- status         # Status do MP
- amount         # Valor
- payment_method # Método usado
- created_at     # Data
```

---

## 🚀 Configuração (Vercel Postgres)

### 1️⃣ Criar Banco de Dados na Vercel

1. **Acesse:** https://vercel.com/dashboard
2. **Vá em:** Storage → Create Database
3. **Selecione:** Postgres
4. **Nome:** Shape IA-db
5. **Região:** Washington, D.C. (mais próximo do Brasil)
6. **Crie o banco**

### 2️⃣ Copiar Variáveis de Ambiente

A Vercel vai gerar automaticamente:

```env
POSTGRES_URL="************"
POSTGRES_PRISMA_URL="************"
POSTGRES_URL_NON_POOLING="************"
POSTGRES_USER="************"
POSTGRES_HOST="************"
POSTGRES_PASSWORD="************"
POSTGRES_DATABASE="************"
```

**Copie TODAS** para o arquivo `.env` local e nas configurações da Vercel.

### 3️⃣ Inicializar o Banco

**Primeira vez (criar tabelas):**

```bash
# No navegador, acesse:
http://localhost:3000/api/init-db
```

Ou após deploy:
```bash
https://seu-dominio.vercel.app/api/init-db
```

Vai retornar:
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

✅ **Pronto! Tabelas criadas.**

---

## 🔄 Fluxo Completo com Banco de Dados

### 1. Cliente Preenche Quiz
```
Quiz → Loading → /seu-plano
```

### 2. Cliente Digita Email
```
Input de email obrigatório
```

### 3. Cria Pedido
```javascript
POST /api/create-order
{
  quizData: {...},
  email: "cliente@email.com"
}

// Retorna:
{
  orderId: "ORD-123",
  downloadToken: "uuid-xxx",
  preferenceId: "MP-xxx"
}

// Salva no banco:
orders.status = 'pending'
```

### 4. Cliente Paga (Mercado Pago)
```
Cliente escolhe PIX ou Cartão
Mercado Pago processa
```

### 5. Webhook Recebe Notificação
```javascript
POST /api/webhooks/mercadopago
{
  type: "payment",
  data: { id: "123456" }
}

// Atualiza banco:
orders.status = 'paid'
orders.paid_at = NOW()
payments (nova linha)
```

### 6. Frontend Detecta Pagamento (Polling)
```javascript
// Verifica a cada 3 segundos
GET /api/check-payment?orderId=ORD-123

// Quando isPaid = true:
- Exibe confetes
- Gera o plano com IA
- Libera download
```

### 7. Cliente Baixa PDF
```javascript
POST /api/generate-pdf
{
  downloadToken: "uuid-xxx" // VALIDADO!
}

// Backend valida:
1. Token existe?
2. Status = 'paid'?
3. Só então gera PDF
```

---

## 🔒 Segurança

### Token Único
- Cada pedido tem um **UUID único**
- Impossível adivinhar
- Válido apenas se `status = 'paid'`

### Validação em Camadas
1. ✅ Token existe no banco?
2. ✅ Pedido foi pago?
3. ✅ Só então libera PDF

### Webhook Protegido
- Mercado Pago envia notificações apenas do IP deles
- Sempre validamos o payment_id na API do MP

---

## 📊 Consultar Vendas

### Via SQL (Vercel Dashboard)

```sql
-- Total de vendas
SELECT COUNT(*) FROM orders WHERE status = 'paid';

-- Faturamento total
SELECT SUM(amount) FROM orders WHERE status = 'paid';

-- Vendas hoje
SELECT * FROM orders 
WHERE DATE(created_at) = CURRENT_DATE 
AND status = 'paid';

-- Últimas vendas
SELECT customer_name, customer_email, amount, paid_at 
FROM orders 
WHERE status = 'paid' 
ORDER BY paid_at DESC 
LIMIT 10;
```

### Via API (Criar depois)

```typescript
// app/api/admin/sales/route.ts
export async function GET() {
  const sales = await sql`
    SELECT * FROM orders WHERE status = 'paid'
  `;
  return NextResponse.json(sales.rows);
}
```

---

## 🐛 Troubleshooting

### Erro: "Database not initialized"
```bash
# Rode novamente:
curl http://localhost:3000/api/init-db
```

### Erro: "Connection refused"
```bash
# Verifique se as variáveis POSTGRES_* estão no .env
```

### Webhook não está funcionando
```bash
# Em desenvolvimento, use ngrok:
ngrok http 3000

# Configure a URL do webhook no Mercado Pago:
https://seu-ngrok.ngrok.io/api/webhooks/mercadopago
```

### Pagamento não atualiza
```bash
# Verifique logs no webhook:
- Vercel Dashboard → Logs
- Filtre por /api/webhooks
```

---

## 🎯 Checklist de Configuração

- [ ] Banco criado na Vercel
- [ ] Variáveis POSTGRES_* no .env
- [ ] Tabelas criadas (`/api/init-db`)
- [ ] Webhook configurado no Mercado Pago
- [ ] Testado fluxo completo
- [ ] Email está sendo solicitado
- [ ] Token está sendo validado

---

## 💡 Próximas Melhorias

### Email Automático
```bash
npm install resend
```

Enviar PDF por email após pagamento.

### Dashboard Admin
Criar página `/admin` para ver vendas.

### Relatórios
Gráficos de vendas por dia/mês.

### Cupons de Desconto
Tabela `coupons` para códigos promocionais.

---

**Agora seu sistema está seguro e profissional! 🔒**

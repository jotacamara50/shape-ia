import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { 
  getPaymentByMpId, 
  savePayment, 
  updateOrderStatus,
  getOrderById 
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Validar assinatura do Mercado Pago (segurança)
    const xSignature = req.headers.get("x-signature");
    const xRequestId = req.headers.get("x-request-id");
    const mpSecret = process.env.MP_WEBHOOK_SECRET;

    // Se a assinatura secreta estiver configurada, validar
    if (mpSecret && xSignature && xRequestId) {
      const bodyText = await req.text();
      const parts = xSignature.split(",");
      
      let ts: string | undefined;
      let hash: string | undefined;
      
      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key && value) {
          const trimmedKey = key.trim();
          const trimmedValue = value.trim();
          if (trimmedKey === "ts") ts = trimmedValue;
          if (trimmedKey === "v1") hash = trimmedValue;
        }
      });

      if (ts && hash) {
        const manifest = `id:${xRequestId};request-id:${xRequestId};ts:${ts};`;
        const hmac = crypto.createHmac("sha256", mpSecret);
        hmac.update(manifest);
        const sha = hmac.digest("hex");

        if (sha !== hash) {
          console.error("❌ Assinatura inválida do webhook");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
        console.log("✅ Assinatura do webhook validada");
      }

      // Parse body again after validation
      const body = JSON.parse(bodyText);
      return await processWebhook(body);
    }

    // Se não tiver secret configurado, processa normalmente (desenvolvimento)
    const body = await req.json();
    return await processWebhook(body);
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

async function processWebhook(body: any) {
  try {
    console.log("🔔 Webhook recebido:", body);

    // Mercado Pago envia diferentes tipos de notificação
    if (body.type === "payment") {
      const paymentId = body.data.id;

      // Buscar detalhes do pagamento
      const accessToken = process.env.MP_ACCESS_TOKEN;
      
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const paymentData = await paymentResponse.json();

      console.log("💳 Dados do pagamento:", paymentData);

      // Verificar se já processamos este pagamento
      const existingPayment = await getPaymentByMpId(paymentData.id.toString());
      
      if (existingPayment) {
        console.log("⚠️ Pagamento já processado");
        return NextResponse.json({ received: true });
      }

      // Pegar o ID do nosso pedido (external_reference)
      const orderId = paymentData.external_reference;

      if (!orderId) {
        console.error("❌ Order ID não encontrado no pagamento");
        return NextResponse.json({ received: true });
      }

      // Salvar pagamento no banco
      await savePayment({
        orderId: orderId,
        mpPaymentId: paymentData.id.toString(),
        status: paymentData.status,
        amount: paymentData.transaction_amount,
        paymentMethod: paymentData.payment_type_id,
      });

      // Atualizar status do pedido baseado no status do pagamento
      let orderStatus: "pending" | "paid" | "failed" = "pending";

      if (paymentData.status === "approved") {
        orderStatus = "paid";
      } else if (paymentData.status === "rejected" || paymentData.status === "cancelled") {
        orderStatus = "failed";
      }

      await updateOrderStatus(
        orderId,
        orderStatus,
        paymentData.id.toString(),
        paymentData.payment_type_id
      );

      console.log(`✅ Pedido ${orderId} atualizado para: ${orderStatus}`);

      // Aqui você pode enviar email de confirmação se o pagamento foi aprovado
      if (orderStatus === "paid") {
        const order = await getOrderById(orderId);
        if (order) {
          console.log(`📧 Enviando email para ${order.customer_email}`);
          // TODO: Implementar envio de email com Resend
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    return NextResponse.json({ received: true }); // Sempre retornar 200 para o MP
  }
}

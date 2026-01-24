import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getOrderById, savePayment, updateOrderStatus, updateOrderEmail } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { orderId, formData, email } = await req.json();
    console.log("💳 Processando pagamento para pedido:", orderId);

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (email && email !== order.customer_email) {
      await updateOrderEmail(order.id, email);
      order.customer_email = email;
    }

    const paymentMethodId =
      formData?.payment_method_id || formData?.paymentMethodId;
    const issuerId = formData?.issuer_id || formData?.issuerId;
    const installments = formData?.installments;
    const token = formData?.token;

    const payerEmail = email || order.customer_email;
    const paymentBody: Record<string, any> = {
      transaction_amount: Number(order.amount),
      description: "Plano Alimentar Personalizado Shape IA",
      payer: {
        ...(formData?.payer ?? {}),
        email: payerEmail,
      },
      external_reference: order.id,
      metadata: {
        orderId: order.id,
      },
    };

    if (paymentMethodId) paymentBody.payment_method_id = paymentMethodId;
    if (issuerId) paymentBody.issuer_id = issuerId;
    if (installments) paymentBody.installments = Number(installments);
    if (token) paymentBody.token = token;
    if (formData?.payment_type_id) {
      paymentBody.payment_type_id = formData.payment_type_id;
    }

    // Processar pagamento via Mercado Pago API
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(paymentBody),
    });

    const result = await response.json();
    console.log("💳 Resultado Mercado Pago:", result?.status, result?.status_detail);

    if (!response.ok) {
      console.error("💳 Erro Mercado Pago:", result);
      return NextResponse.json(
        { error: result?.message || "Erro ao processar pagamento", details: result },
        { status: 500 }
      );
    }

    const resolvedEmail = result?.payer?.email || payerEmail;
    if (resolvedEmail && resolvedEmail !== order.customer_email) {
      await updateOrderEmail(order.id, resolvedEmail);
      order.customer_email = resolvedEmail;
    }

    const mpPaymentId = result.id?.toString();

    if (mpPaymentId) {
      await savePayment({
        orderId: order.id,
        mpPaymentId: mpPaymentId,
        status: result.status,
        amount: result.transaction_amount,
        paymentMethod: result.payment_type_id || result.payment_method_id,
      });

      let orderStatus: "pending" | "paid" | "failed" = "pending";

      if (result.status === "approved") {
        orderStatus = "paid";
      } else if (result.status === "rejected" || result.status === "cancelled") {
        orderStatus = "failed";
      }

      await updateOrderStatus(
        order.id,
        orderStatus,
        mpPaymentId,
        result.payment_type_id || result.payment_method_id
      );
    }

    const transactionData = result?.point_of_interaction?.transaction_data;

    return NextResponse.json({
      status: result.status,
      id: result.id,
      statusDetail: result.status_detail,
      paymentType: result.payment_type_id,
      qrCodeBase64: transactionData?.qr_code_base64,
      qrCode: transactionData?.qr_code,
      ticketUrl: transactionData?.ticket_url,
      downloadToken: result.status === "approved" ? order.download_token : null,
      payerEmail: order.customer_email,
    });
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}

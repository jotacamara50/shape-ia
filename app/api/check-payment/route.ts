import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderStatus, updateOrderEmail } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");

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

    if (order.status !== "paid" && order.payment_id) {
      const accessToken = process.env.MP_ACCESS_TOKEN;

      if (accessToken) {
        const paymentResponse = await fetch(
          `https://api.mercadopago.com/v1/payments/${order.payment_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          console.log("💳 MP check status:", paymentData?.status, paymentData?.status_detail);
          console.log("💳 MP payer email (check):", paymentData?.payer?.email || null);
          let orderStatus: "pending" | "paid" | "failed" = "pending";

          if (paymentData.status === "approved") {
            orderStatus = "paid";
          } else if (
            paymentData.status === "rejected" ||
            paymentData.status === "cancelled"
          ) {
            orderStatus = "failed";
          }

          const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
          if (paymentData?.payer?.email && isValidEmail(paymentData.payer.email) && paymentData.payer.email !== order.customer_email) {
            const normalizedEmail = paymentData.payer.email.trim();
            await updateOrderEmail(order.id, normalizedEmail);
            order.customer_email = normalizedEmail;
          }

          if (orderStatus !== order.status) {
            await updateOrderStatus(
              order.id,
              orderStatus,
              paymentData.id?.toString(),
              paymentData.payment_type_id
            );
            order.status = orderStatus;
            order.payment_id = paymentData.id?.toString() || order.payment_id;
            order.payment_method = paymentData.payment_type_id || order.payment_method;
          }
        }
      }
    }

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    return NextResponse.json({
      status: order.status,
      isPaid: order.status === "paid",
      downloadToken: order.status === "paid" ? order.download_token : null,
      payerEmail: isValidEmail(order.customer_email || "") ? order.customer_email : null,
    });
  } catch (error) {
    console.error("Erro ao verificar status:", error);
    return NextResponse.json(
      { error: "Erro ao verificar status" },
      { status: 500 }
    );
  }
}

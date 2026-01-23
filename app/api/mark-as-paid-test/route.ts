import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/db";

// Rota APENAS para testes - marca pedido como pago
export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    console.log("💳 [TESTE] Marcando pedido como pago:", orderId);

    // Atualizar status para paid
    await updateOrderStatus(orderId, "paid");

    console.log("✅ [TESTE] Pedido marcado como pago");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ [TESTE] Erro ao marcar como pago:", error);
    return NextResponse.json(
      { error: "Erro ao marcar como pago" },
      { status: 500 }
    );
  }
}

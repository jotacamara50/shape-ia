import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// Rota APENAS para testes - não chama Mercado Pago
export async function POST(req: NextRequest) {
  try {
    console.log("🧪 [TESTE] Criando pedido sem Mercado Pago...");
    const { quizData, email } = await req.json();

    if (!quizData || !email) {
      return NextResponse.json(
        { error: "Quiz data and email are required" },
        { status: 400 }
      );
    }

    const price = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90");
    
    // Gerar token único para download
    const downloadToken = uuidv4();

    // Criar pedido no banco
    const order = await createOrder({
      customerEmail: email,
      customerName: quizData.name,
      quizData: quizData,
      amount: price,
      downloadToken: downloadToken,
    });

    console.log("✅ [TESTE] Pedido criado:", order.id);

    return NextResponse.json({ 
      orderId: order.id,
      downloadToken: downloadToken,
      success: true
    });
  } catch (error) {
    console.error("❌ [TESTE] Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido de teste" },
      { status: 500 }
    );
  }
}

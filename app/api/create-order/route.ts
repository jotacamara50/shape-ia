import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    console.log("📦 Iniciando criação de pedido...");
    const { quizData, email } = await req.json();
    console.log("📧 Email:", email);
    console.log("📝 QuizData:", quizData);

    if (!quizData || !email) {
      console.error("❌ Dados faltando - quizData ou email");
      return NextResponse.json(
        { error: "Quiz data and email are required" },
        { status: 400 }
      );
    }

    const price = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90");
    
    // Gerar token único para download
    const downloadToken = uuidv4();
    console.log("🎫 Token gerado:", downloadToken);

    // Criar pedido no banco
    console.log("💾 Criando pedido no banco...");
    const order = await createOrder({
      customerEmail: email,
      customerName: quizData.name,
      quizData: quizData,
      amount: price,
      downloadToken: downloadToken,
    });
    console.log("✅ Pedido criado:", order);

    // Criar preferência de pagamento no Mercado Pago
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: "Plano Alimentar Personalizado Shape IA",
            description: `Plano personalizado para ${quizData.name}`,
            quantity: 1,
            currency_id: "BRL",
            unit_price: price,
          },
        ],
        payer: {
          email: email,
          name: quizData.name,
        },
        back_urls: {
          success: `${baseUrl}/seu-plano?order_id=${order.id}&status=approved`,
          failure: `${baseUrl}/seu-plano?order_id=${order.id}&status=rejected`,
          pending: `${baseUrl}/seu-plano?order_id=${order.id}&status=pending`,
        },
        auto_return: "approved",
        external_reference: order.id, // Vincular com nosso pedido
        notification_url: `${baseUrl}/api/webhooks/mercadopago`, // Webhook
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
      }),
    });

    const data = await response.json();
    
    console.log("Mercado Pago Response Status:", response.status);
    console.log("Mercado Pago Response:", data);

    if (!response.ok || !data.id) {
      console.error("Erro ao criar preferência no Mercado Pago:", data);
      return NextResponse.json(
        { error: data.message || "Erro ao criar preferência de pagamento", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      preferenceId: data.id,
      orderId: order.id,
      downloadToken: downloadToken
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao criar pedido" },
      { status: 500 }
    );
  }
}

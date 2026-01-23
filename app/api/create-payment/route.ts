import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { price } = await req.json();

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    // Criar preferência de pagamento
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
            description: "Plano alimentar personalizado gerado por IA",
            quantity: 1,
            currency_id: "BRL",
            unit_price: price,
          },
        ],
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/seu-plano?status=approved`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/seu-plano?status=rejected`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/seu-plano?status=pending`,
        },
        auto_return: "approved",
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
      }),
    });

    const data = await response.json();

    return NextResponse.json({ preferenceId: data.id });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar preferência de pagamento" },
      { status: 500 }
    );
  }
}

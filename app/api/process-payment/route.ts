import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const paymentData = await req.json();

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    // Processar pagamento via Mercado Pago API
    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    // Aqui você pode salvar o pagamento no banco de dados
    // E enviar o email com o PDF

    return NextResponse.json({
      status: result.status,
      id: result.id,
      statusDetail: result.status_detail,
    });
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 }
    );
  }
}

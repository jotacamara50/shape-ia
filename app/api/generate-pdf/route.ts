import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { NutritionPlanPDF } from "@/components/NutritionPlanPDF";
import { NutritionPlan, QuizData } from "@/types";
import { getOrderByToken } from "@/lib/db";
import * as React from "react";

export async function POST(req: NextRequest) {
  try {
    const { plan, userData, downloadToken }: { 
      plan: NutritionPlan; 
      userData: QuizData;
      downloadToken?: string;
    } = await req.json();

    // Validar token de download se fornecido
    if (downloadToken) {
      const order = await getOrderByToken(downloadToken);

      if (!order) {
        return NextResponse.json(
          { error: "Token inválido" },
          { status: 403 }
        );
      }

      if (order.status !== "paid") {
        return NextResponse.json(
          { error: "Pagamento não confirmado" },
          { status: 403 }
        );
      }
    }

    // Gerar PDF usando createElement
    const pdfElement = React.createElement(
      NutritionPlanPDF,
      { plan, userData }
    ) as React.ReactElement;
    const pdfBuffer = await renderToBuffer(pdfElement);

    // Retornar PDF como response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="plano-alimentar-${userData.name.replace(/\s+/g, "-").toLowerCase()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    return NextResponse.json(
      { error: "Erro ao gerar PDF" },
      { status: 500 }
    );
  }
}

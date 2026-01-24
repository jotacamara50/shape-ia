import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import * as React from "react";
import { Resend } from "resend";
import { NutritionPlanPDF } from "@/components/NutritionPlanPDF";
import { NutritionPlan, QuizData } from "@/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, plan, userData }: {
      email: string;
      plan: NutritionPlan;
      userData: QuizData;
    } = await req.json();

    if (!email || !plan || !userData) {
      return NextResponse.json(
        { error: "Email, plan and userData are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;

    if (!apiKey || !from) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const pdfElement = React.createElement(
      NutritionPlanPDF,
      { plan, userData }
    ) as React.ReactElement;
    const pdfBuffer = await renderToBuffer(pdfElement);

    const resend = new Resend(apiKey);
    const filename = `plano-alimentar-${userData.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;

    await resend.emails.send({
      from,
      to: email,
      subject: "Seu plano alimentar está pronto!",
      html: `
        <p>Olá ${userData.name},</p>
        <p>Segue em anexo o seu plano alimentar personalizado em PDF.</p>
        <p>Obrigado por comprar com a Shape IA.</p>
      `,
      attachments: [
        {
          filename,
          content: Buffer.from(pdfBuffer).toString("base64"),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}

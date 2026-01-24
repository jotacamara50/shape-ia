import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import * as React from "react";
import { Resend } from "resend";
import { NutritionPlanPDF } from "@/components/NutritionPlanPDF";
import { NutritionPlan, QuizData } from "@/types";

export const runtime = "nodejs";

const isValidEmail = (value: string) => {
  const email = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

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

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
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

    console.log("Enviando email para:", email.trim());
    const { data, error } = await resend.emails.send({
      from,
      to: email.trim(),
      subject: "Seu plano alimentar esta pronto!",
      html: `
        <p>Ol? ${userData.name},</p>
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

    if (error) {
      console.error("Erro Resend:", error);
      return NextResponse.json(
        { error: error.message || "Erro ao enviar email" },
        { status: 500 }
      );
    }

    console.log("Email enviado:", data?.id);
    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}

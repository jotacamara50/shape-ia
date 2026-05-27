"use client";

import { useEffect, useState, memo } from "react";
import Image from "next/image";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import confetti from "canvas-confetti";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CheckoutSectionProps {
  onPaymentSuccess: (downloadToken: string, payerEmail?: string) => void;
  quizData?: unknown;
}

export const CheckoutSection = memo(function CheckoutSection({
  onPaymentSuccess,
  quizData,
}: CheckoutSectionProps) {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "approved" | "rejected">("pending");
  const [preferenceId, setPreferenceId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCodeBase64?: string;
    qrCode?: string;
    ticketUrl?: string;
  } | null>(null);
  const [payerEmail, setPayerEmail] = useState("");
  const [pixCopied, setPixCopied] = useState(false);

  const price = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90");
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  useEffect(() => {
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isEmailValid = email.trim().length > 0 && validateEmail(email);

  const startPaymentPolling = (nextOrderId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?orderId=${nextOrderId}`);
        const data = await response.json();

        if (data.isPaid) {
          clearInterval(interval);
          setPaymentStatus("approved");

          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#4a7041", "#82aa77", "#d3e3cd"],
          });

          setTimeout(() => {
            const emailToUse = payerEmail || data.payerEmail;
            onPaymentSuccess(data.downloadToken, emailToUse || undefined);
          }, 900);
        }
      } catch (pollingError) {
        console.error("Erro ao verificar pagamento:", pollingError);
      }
    }, 3000);

    setTimeout(() => clearInterval(interval), 600000);
  };

  const createOrder = async () => {
    if (!quizData) {
      setError("Dados da análise não encontrados.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Digite um email válido");
      return;
    }

    if (!publicKey) {
      setError("Pagamento indisponível no momento. Tente novamente em instantes.");
      return;
    }

    setEmailError("");
    setError("");
    setIsCreatingOrder(true);

    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizData, email: email.trim() }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.preferenceId) {
        setError(data?.error || "Erro ao preparar seu checkout. Recarregue a página.");
        return;
      }

      setPreferenceId(data.preferenceId);
      setOrderId(data.orderId);
      setPayerEmail(email.trim());
      startPaymentPolling(data.orderId);
    } catch (requestError) {
      console.error("Erro ao criar pedido:", requestError);
      setError("Erro ao preparar seu checkout. Recarregue a página.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const onSubmit = async (submission: unknown) => {
    setPaymentStatus("processing");
    setError("");

    if (!orderId) {
      setPaymentStatus("pending");
      setError("Pedido não encontrado. Recarregue a página.");
      return Promise.reject(new Error("Order ID missing"));
    }

    try {
      const formData =
        typeof submission === "object" && submission !== null && "formData" in submission
          ? (submission as { formData: unknown }).formData
          : submission;

      const payer =
        typeof formData === "object" && formData !== null && "payer" in formData
          ? (formData as { payer?: { email?: string } }).payer
          : undefined;

      const mpPayerEmail = payer?.email || email || "";
      setPayerEmail(mpPayerEmail);

      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, formData, email: mpPayerEmail || email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPaymentStatus("pending");
        setError(data?.error || "Erro ao processar pagamento. Tente novamente.");
        return Promise.reject(new Error(data?.error || "Payment failed"));
      }

      if (data?.payerEmail) setPayerEmail(data.payerEmail);

      if (data?.qrCodeBase64 || data?.qrCode || data?.ticketUrl) {
        setPixData({
          qrCodeBase64: data.qrCodeBase64,
          qrCode: data.qrCode,
          ticketUrl: data.ticketUrl,
        });
      }

      if (data?.status === "approved" && data?.downloadToken) {
        setPaymentStatus("approved");
        onPaymentSuccess(data.downloadToken, data?.payerEmail || mpPayerEmail);
      } else if (data?.status === "rejected" || data?.status === "cancelled") {
        setPaymentStatus("rejected");
        setError("Pagamento recusado. Tente outro cartão ou método.");
      } else {
        setPaymentStatus("pending");
      }

      return data;
    } catch (paymentError) {
      console.error("Erro ao processar pagamento:", paymentError);
      setPaymentStatus("pending");
      setError("Erro ao processar pagamento. Tente novamente.");
      return Promise.reject(paymentError);
    }
  };

  const onError = (brickError: unknown) => {
    console.error("Erro no Payment Brick:", brickError);
    setError("Erro ao carregar o checkout. Recarregue a página.");
  };

  /* ── Aprovado ── */
  if (paymentStatus === "approved") {
    return (
      <div className="rounded-2xl border border-sage-100 bg-sage-50 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-600">
          <CheckCircle2 className="h-6 w-6 text-white" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-stone-900">Pagamento confirmado</h3>
        <p className="mt-2 text-sm leading-6 text-stone-400">
          Redirecionando para o seu plano personalizado.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info acesso */}
      <div className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage-600" />
        <div>
          <p className="text-sm font-medium text-stone-800">Você receberá o PDF no email informado</p>
          <p className="mt-1 text-xs leading-5 text-stone-400">
            O acesso é liberado imediatamente após a confirmação do pagamento.
          </p>
        </div>
      </div>

      {/* Erro */}
      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {/* Email + CTA */}
      {!preferenceId ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-email" className="text-sm font-medium text-stone-700">
              Email para receber o relatório
            </Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError("");
              }}
              className={`h-12 rounded-2xl border-stone-200 bg-stone-50 text-stone-900 focus:border-stone-400 focus:bg-white ${
                emailError ? "border-red-300" : ""
              }`}
            />
            {emailError ? <p className="text-xs text-red-500">{emailError}</p> : null}
            <p className="text-xs text-stone-400">Sem spam. Usado apenas para entrega do relatório.</p>
          </div>

          <Button
            onClick={createOrder}
            disabled={isCreatingOrder || !isEmailValid}
            className="h-12 w-full rounded-2xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {isCreatingOrder ? "Preparando checkout…" : "Continuar para pagamento"}
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3 text-sm text-stone-500">
          Email confirmado: <span className="font-medium text-stone-800">{email}</span>
        </div>
      )}

      {/* Mercado Pago Brick */}
      {preferenceId ? (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white p-4">
            <div className="mp-brick-wrapper w-full max-w-full">
              <Payment
                initialization={{
                  amount: price,
                  preferenceId,
                  payer: email ? { email } : undefined,
                }}
                onSubmit={onSubmit}
                onError={onError}
                customization={{
                  visual: {
                    style: {
                      theme: "default",
                    },
                  },
                  paymentMethods: {
                    creditCard: "all",
                    debitCard: "all",
                    bankTransfer: "all",
                  },
                }}
              />
            </div>
            <p className="mt-3 text-center text-xs text-stone-400">Pagamento processado pelo Mercado Pago</p>
          </div>

          {/* Pix gerado */}
          {pixData ? (
            <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-900">Pix gerado</p>
              <p className="mt-1 text-xs text-stone-400">
                Ao confirmar o Pix, seu acesso é liberado automaticamente.
              </p>

              {pixData.qrCodeBase64 ? (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code Pix"
                    width={180}
                    height={180}
                    unoptimized
                    className="h-44 w-44 rounded-2xl border border-stone-100 bg-white p-2"
                  />
                </div>
              ) : null}

              {pixData.qrCode ? (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-stone-400">Copie o código Pix</p>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={pixData.qrCode}
                      className={`h-11 rounded-2xl text-xs ${
                        pixCopied ? "border-sage-300 bg-sage-50" : "border-stone-200 bg-stone-50"
                      }`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        await navigator.clipboard.writeText(pixData.qrCode || "");
                        setPixCopied(true);
                        setTimeout(() => setPixCopied(false), 1500);
                      }}
                      className="h-11 rounded-2xl border-stone-200 bg-white text-stone-700"
                    >
                      {pixCopied ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                </div>
              ) : null}

              {pixData.ticketUrl ? (
                <div className="mt-3">
                  <a
                    href={pixData.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-stone-600 underline underline-offset-2"
                  >
                    Abrir instruções do Pix
                  </a>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : (
        !preferenceId && email && (
          <p className="text-center text-xs text-stone-400">
            As opções de pagamento aparecem após confirmar o email.
          </p>
        )
      )}
    </div>
  );
});

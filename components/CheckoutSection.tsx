"use client";

import { useState, useEffect, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

interface CheckoutSectionProps {
  onPaymentSuccess: (downloadToken: string, payerEmail?: string) => void;
  quizData?: any;
}

export const CheckoutSection = memo(function CheckoutSection(
  { onPaymentSuccess, quizData }: CheckoutSectionProps
) {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "approved" | "rejected">("pending");
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCodeBase64?: string;
    qrCode?: string;
    ticketUrl?: string;
  } | null>(null);
  const [payerEmail, setPayerEmail] = useState<string>("");
  const [pixCopied, setPixCopied] = useState(false);

  const price = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90");
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  useEffect(() => {
    // Inicializar Mercado Pago
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, [publicKey]);

  const validateEmail = (value: string) => {
    const emailValue = value.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
  };

  const emailTrimmed = email.trim();
  const isEmailValid = emailTrimmed.length > 0 && validateEmail(emailTrimmed);

  

  // Polling para verificar status do pagamento
  const startPaymentPolling = (orderId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/check-payment?orderId=${orderId}`);
        const data = await response.json();

        if (data.isPaid) {
          clearInterval(interval);
          setPaymentStatus("approved");

          // Efeito de confetes
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });

          setTimeout(() => {
            const emailToUse = payerEmail || data.payerEmail;
            onPaymentSuccess(data.downloadToken, emailToUse || undefined);
          }, 1000);
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 3000); // Verificar a cada 3 segundos

    // Limpar após 10 minutos
    setTimeout(() => clearInterval(interval), 600000);
  };

  const createOrder = async () => {
    if (!quizData) {
      setError("Dados do cliente não encontrados.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Digite um email válido");
      return;
    }

    if (!publicKey) {
      setError("Pagamento indisponível no momento. Tente novamente mais tarde.");
      return;
    }

    setEmailError("");
    setError("");
    setIsCreatingOrder(true);

    try {
      console.log("Criando pedido...");
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizData: quizData,
          email: email.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      console.log("Pedido criado:", data);

      if (!response.ok) {
        console.error("Erro ao criar pedido:", data);
        setError(data?.error || "Erro ao carregar pagamento. Recarregue a página.");
        return;
      }

      if (!data.preferenceId) {
        console.error("Preference ID não retornado:", data);
        setError(data?.error || "Erro ao carregar pagamento. Recarregue a página.");
        return;
      }

      setPreferenceId(data.preferenceId);
      setOrderId(data.orderId);
      setPayerEmail(email.trim());

      // Iniciar polling para verificar status do pagamento
      startPaymentPolling(data.orderId);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      setError("Erro ao carregar pagamento. Recarregue a página.");
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const onSubmit = async (submission: any) => {
    setPaymentStatus("processing");
    setError("");

    if (!orderId) {
      setPaymentStatus("pending");
      setError("Pedido não encontrado. Recarregue a página.");
      return Promise.reject(new Error("Order ID missing"));
    }

    try {
      const formData = submission?.formData ?? submission;
      
      // Extrair email do payer data do Mercado Pago (fallback para email digitado)
      const mpPayerEmail = formData?.payer?.email || email || quizData?.email || "";
      setPayerEmail(mpPayerEmail);
      console.log("Email do pagador (MP):", mpPayerEmail || "nao-informado");
      
      const response = await fetch("/api/process-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          formData,
          email: mpPayerEmail || email,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setPaymentStatus("pending");
        setError(data?.error || "Erro ao processar pagamento. Tente novamente.");
        return Promise.reject(new Error(data?.error || "Payment failed"));
      }

      if (data?.payerEmail) {
        setPayerEmail(data.payerEmail);
      }

      if (data?.qrCodeBase64 || data?.qrCode || data?.ticketUrl) {
        setPixData({
          qrCodeBase64: data.qrCodeBase64,
          qrCode: data.qrCode,
          ticketUrl: data.ticketUrl,
        });
      }

      if (data?.status === "approved" && data?.downloadToken) {
        setPaymentStatus("approved");
        const resolvedEmail = data?.payerEmail || mpPayerEmail;
        onPaymentSuccess(data.downloadToken, resolvedEmail);
      } else if (data?.status === "rejected" || data?.status === "cancelled") {
        setPaymentStatus("rejected");
        setError("Pagamento recusado. Tente outro cartão ou método.");
      } else {
        setPaymentStatus("pending");
      }

      return data;
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setPaymentStatus("pending");
      setError("Erro ao processar pagamento. Tente novamente.");
      return Promise.reject(error);
    }
  };

  const onError = (error: any) => {
    console.error("Erro no Payment Brick:", error);
    setError("Erro ao carregar o checkout. Recarregue a página.");
  };

  if (paymentStatus === "approved") {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="bg-green-100 text-green-600 rounded-full p-4 inline-block mb-4">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Pagamento Aprovado! 🎉
        </h3>
        <p className="text-gray-600 mb-6">
          Redirecionando para download...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Escolha como pagar:
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!preferenceId ? (
          <div className="space-y-3 mb-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-semibold text-green-800">
                Plano Alimentar Personalizado — R$ {price.toFixed(2)}
              </p>
              <p className="text-xs text-green-700">
                Acesso vitalício + PDF enviado por email
              </p>
            </div>

            <Label htmlFor="email">Email para receber o plano</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              className={emailError ? "border-red-500" : undefined}
            />
            <p className="text-xs text-gray-500">
              Usaremos esse email para enviar seu PDF. Sem spam.
            </p>
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}

            <Button
              onClick={createOrder}
              className="w-full"
              disabled={isCreatingOrder || !isEmailValid}
            >
              {isCreatingOrder ? "Carregando..." : "Continuar para pagamento"}
            </Button>
          </div>
        ) : (
          <div className="mb-4 text-sm text-gray-600">
            Email para envio do PDF: <span className="font-semibold">{email}</span>
          </div>
        )}

        {/* Payment Brick - Mostra direto se tiver preferenceId */}
        {preferenceId ? (
          <div className="space-y-4">
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
            
            <p className="text-xs text-center text-gray-500">
              Pagamento processado pelo Mercado Pago
            </p>

            {pixData && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Pix gerado — pague para liberar o acesso
                </p>

                {pixData.qrCodeBase64 && (
                  <div className="flex justify-center mb-3">
                    <img
                      src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                      alt="QR Code Pix"
                      className="h-48 w-48"
                    />
                  </div>
                )}

                {pixData.qrCode && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Copie o código Pix:</p>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={pixData.qrCode}
                        className={`text-xs ${pixCopied ? "bg-blue-50 border-blue-400" : ""}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          await navigator.clipboard.writeText(pixData.qrCode || "");
                          setPixCopied(true);
                          setTimeout(() => setPixCopied(false), 1500);
                        }}
                      >
                        {pixCopied ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                  </div>
                )}

                {pixData.ticketUrl && (
                  <div className="mt-3">
                    <a
                      href={pixData.ticketUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-green-700 underline"
                    >
                      Abrir instruções do Pix
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-center text-gray-500">
            Informe seu email para liberar as opções de pagamento.
          </p>
        )}

        {/* Métodos de Pagamento */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-center text-gray-600 mb-3">
            Aceitamos PIX e Cartão de Crédito
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-2">
                💳
              </div>
              <span>Cartão</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-2">
                🔑
              </div>
              <span>PIX</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selos de Segurança */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-sm font-semibold text-green-800 mb-1">
          🔒 Garantia de Satisfação
        </p>
        <p className="text-xs text-green-700">
          Se não ficar satisfeito, devolvemos seu dinheiro em até 7 dias
        </p>
      </div>
    </div>
  );
});

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Lock, CheckCircle2, Mail } from "lucide-react";
import confetti from "canvas-confetti";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";

interface CheckoutSectionProps {
  onPaymentSuccess: (downloadToken: string) => void;
  quizData?: any;
  customButton?: {
    text: string;
    className?: string;
  };
}

export function CheckoutSection({ onPaymentSuccess, quizData, customButton }: CheckoutSectionProps) {
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "approved" | "rejected">("pending");
  const [showMercadoPago, setShowMercadoPago] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");

  const price = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90");
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    // Inicializar Mercado Pago
    if (publicKey) {
      initMercadoPago(publicKey, { locale: "pt-BR" });
    }
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePayment = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError("Digite um email válido");
      return;
    }

    if (!publicKey) {
      setEmailError("Pagamento indisponível no momento. Tente novamente mais tarde.");
      return;
    }

    setEmailError("");
    
    // Criar pedido no banco de dados
    try {
      console.log("Criando pedido...");
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          quizData: quizData,
          email: email
        }),
      });
      
      const data = await response.json().catch(() => ({}));
      console.log("Pedido criado:", data);

      if (!response.ok) {
        console.error("Erro ao criar pedido:", data);
        setEmailError(data?.error || "Erro ao processar. Tente novamente.");
        return;
      }

      if (!data.preferenceId) {
        console.error("Preference ID não retornado:", data);
        setEmailError(data?.error || "Erro ao processar. Tente novamente.");
        return;
      }
      
      setPreferenceId(data.preferenceId);
      setOrderId(data.orderId);
      setShowMercadoPago(true);
      
      // Iniciar polling para verificar status do pagamento
      startPaymentPolling(data.orderId);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      setEmailError("Erro ao processar. Tente novamente.");
    }
  };

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
            onPaymentSuccess(data.downloadToken);
          }, 1000);
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 3000); // Verificar a cada 3 segundos

    // Limpar após 10 minutos
    setTimeout(() => clearInterval(interval), 600000);
  };

  const onSubmit = async (formData: any) => {
    setPaymentStatus("processing");
    // O webhook do Mercado Pago vai atualizar o status
    // O polling vai detectar a mudança
  };

  const onError = (error: any) => {
    console.error("Erro no Payment Brick:", error);
    setEmailError("Erro ao carregar o checkout. Tente novamente.");
  };

  // Simulação de pagamento aprovado (para teste)
  const simulatePayment = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError("Digite um email válido para testar");
      return;
    }

    setEmailError("");
    setPaymentStatus("processing");
    
    // Criar pedido de teste (sem chamar Mercado Pago)
    try {
      console.log("🧪 Iniciando simulação de pagamento...");
      const response = await fetch("/api/create-order-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          quizData: quizData,
          email: email
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Erro ao criar pedido de teste:", errorData);
        setEmailError("Erro ao criar pedido. Verifique o console.");
        setPaymentStatus("pending");
        return;
      }
      
      const data = await response.json();
      console.log("✅ Pedido de teste criado:", data);
      
      // Marcar como pago (só no teste)
      await fetch("/api/mark-as-paid-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      
      // Simular aprovação após 2 segundos
      setTimeout(async () => {
        console.log("🎉 Simulando aprovação do pagamento...");
        
        setPaymentStatus("approved");
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => {
          console.log("📥 Redirecionando para download com token:", data.downloadToken);
          onPaymentSuccess(data.downloadToken);
        }, 1000);
      }, 2000);
    } catch (error) {
      console.error("❌ Erro ao simular pagamento:", error);
      setEmailError("Erro ao processar. Verifique o console.");
      setPaymentStatus("pending");
    }
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
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {/* Payment Brick - Mercado Pago */}
        {!showMercadoPago ? (
          <div className="space-y-4">
            {/* Campo de Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email para receber o plano</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 text-lg py-6 ${emailError ? 'border-red-500' : ''}`}
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>

            <Button
              onClick={handlePayment}
              className={customButton?.className || "w-full py-6 text-lg font-bold"}
              size="lg"
              disabled={!email}
            >
              {customButton?.text || "DESBLOQUEAR MEU PLANO"}
            </Button>

            {/* Botão de teste - remover em produção */}
            {!isProduction && (
              <Button
                onClick={simulatePayment}
                variant="outline"
                className="w-full text-sm"
                disabled={!email}
              >
                [TESTE] Simular Pagamento Aprovado
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Payment Brick do Mercado Pago */}
            {preferenceId && (
              <Payment
                initialization={{ amount: price, preferenceId }}
                onSubmit={onSubmit}
                onError={onError}
                customization={{
                  visual: {
                    style: {
                      theme: "default",
                    },
                  },
                  paymentMethods: {
                    mercadoPago: "all"
                  }
                }}
              />
            )}
            
            <p className="text-xs text-center text-gray-500">
              Você será redirecionado após o pagamento
            </p>
          </div>
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
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Shield className="w-5 h-5 text-green-600" />
          <span>Pagamento 100% seguro via Mercado Pago</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Lock className="w-5 h-5 text-green-600" />
          <span>Seus dados estão protegidos</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>Acesso instantâneo após confirmação</span>
        </div>
      </div>

      {/* Garantia */}
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
}

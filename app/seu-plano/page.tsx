"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckoutSection } from "@/components/CheckoutSection";
import { QuizData, NutritionPlan } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Download, ArrowLeft, Lock, Clock, CheckCircle2 } from "lucide-react";

export default function SeuPlanoPage() {
  const [userData, setUserData] = useState<QuizData | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadToken, setDownloadToken] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos em segundos
  const router = useRouter();

  // Countdown timer
  useEffect(() => {
    if (isPaid) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const data = localStorage.getItem("shapeIA-quiz-data");
    if (!data) {
      router.push("/");
      return;
    }
    setUserData(JSON.parse(data));
  }, [router]);

  const handlePaymentSuccess = async (token: string) => {
    setDownloadToken(token);
    setIsPaid(true);
    setIsGenerating(true);

    // Gerar o plano via API
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const plan = await response.json();
      setNutritionPlan(plan);
    } catch (error) {
      console.error("Erro ao gerar plano:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!nutritionPlan || !downloadToken) return;

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          plan: nutritionPlan, 
          userData,
          downloadToken 
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `plano-alimentar-${userData?.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar PDF. Entre em contato com o suporte.");
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (isPaid && isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gerando seu PDF...
          </h2>
          <p className="text-gray-600">Isso levará apenas alguns segundos</p>
        </div>
      </div>
    );
  }

  if (isPaid && nutritionPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center"
        >
          <div className="bg-green-100 text-green-600 rounded-full p-6 inline-block mb-6">
            <Download className="w-16 h-16" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Seu Plano Está Pronto! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8 text-lg">
            Clique no botão abaixo para baixar seu plano alimentar personalizado em PDF
          </p>

          <Button
            onClick={handleDownloadPDF}
            size="lg"
            className="px-12 py-6 text-xl font-bold mb-6"
          >
            <Download className="w-6 h-6 mr-3" />
            BAIXAR MEU PDF
          </Button>

          <p className="text-sm text-gray-500">
            O arquivo também foi enviado para seu e-mail
          </p>

          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-600 mb-4">
              Dúvidas? Entre em contato com nosso suporte
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Barra de Urgência */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <Clock className="w-5 h-5 animate-pulse" />
          <p className="font-bold text-sm sm:text-base">
            ⚠️ Sua personalização expira em: <span className="text-xl font-black">{formatTime(timeLeft)}</span>
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-green-600">🥗 Shape IA</h1>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Coluna 1: Documento "Bloqueado" (3 colunas) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {/* Folha A4 com conteúdo fake */}
            <div className="relative bg-white shadow-2xl border-2 border-gray-200 rounded-lg overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px]">
              {/* Conteúdo Fake do Documento */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs sm:text-sm">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between border-b-2 border-green-500 pb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Plano Alimentar Personalizado</h2>
                    <p className="text-xs text-gray-600">Criado para: {userData?.name || "Você"}</p>
                  </div>
                  <div className="bg-green-100 px-3 py-1 rounded-lg">
                    <p className="text-xs text-green-700 font-semibold">ID: #{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                  </div>
                </div>

                {/* Tabela de Refeições */}
                <div>
                  <h3 className="font-bold text-base mb-2 text-gray-700">📋 Seu Cardápio</h3>
                  <table className="w-full border-collapse border border-gray-300 text-xs">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border border-gray-300 p-1.5 text-left font-bold">Horário</th>
                        <th className="border border-gray-300 p-1.5 text-left font-bold">Refeição</th>
                        <th className="border border-gray-300 p-1.5 text-left font-bold">Alimentos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <tr key={i}>
                          <td className="border border-gray-300 p-1.5">
                            <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                          </td>
                          <td className="border border-gray-300 p-1.5">
                            <div className="h-3 bg-gray-400 rounded animate-pulse"></div>
                          </td>
                          <td className="border border-gray-300 p-1.5">
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-300 rounded animate-pulse"></div>
                              <div className="h-2 bg-gray-300 rounded w-4/5 animate-pulse"></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Lista de Compras */}
                <div>
                  <h3 className="font-bold text-base mb-2 text-gray-700">🛒 Lista de Compras</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 border-2 border-gray-400 rounded"></div>
                        <div className="h-2.5 bg-gray-300 rounded flex-1 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Receita */}
                <div>
                  <h3 className="font-bold text-base mb-2 text-gray-700">👨‍🍳 Receitas</h3>
                  <div className="border border-gray-300 rounded p-3 space-y-2">
                    <div className="h-4 bg-gray-400 rounded w-2/3 animate-pulse"></div>
                    <div className="space-y-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex gap-2">
                          <div className="w-4 h-2.5 bg-gray-400 rounded animate-pulse"></div>
                          <div className="h-2.5 bg-gray-300 rounded flex-1 animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dicas */}
                <div>
                  <h3 className="font-bold text-base mb-2 text-gray-700">💡 Dicas</h3>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-5/6 animate-pulse"></div>
                    <div className="h-3 bg-gray-300 rounded w-4/6 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Overlay de Blur + Cadeado */}
              <div className="absolute inset-0 backdrop-blur-md bg-white/20 flex items-center justify-center">
                <div className="text-center space-y-3 p-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block"
                  >
                    <Lock className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-800 drop-shadow-lg" />
                  </motion.div>
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-2xl border-2 border-gray-400">
                    <h3 className="text-base sm:text-lg lg:text-xl font-black text-gray-900 mb-1">
                      🔒 Conteúdo Bloqueado
                    </h3>
                    <p className="text-gray-700 text-xs sm:text-sm font-medium">
                      Complete o pagamento para<br className="hidden sm:block" />desbloquear seu plano completo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* O que está incluído */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">O que está incluído:</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Cardápio Semanal Completo (Café, Almoço, Jantar)</p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Lista de Compras Pronta (Economize tempo)</p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Análise Corporal (IMC + Taxa Metabólica)</p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700 font-medium">BÔNUS: Sugestão de Treino para seu objetivo</p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-gray-700 font-medium">Acesso Vitalício (Sem mensalidade)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Coluna 2: Oferta de Checkout (2 colunas) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-2xl border-2 border-green-500 p-4 sm:p-5 lg:sticky lg:top-24">
              {/* Badge de Desconto */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full shadow-lg rotate-12 animate-pulse">
                <p className="font-black text-sm sm:text-base lg:text-lg">70% OFF</p>
              </div>

              <div className="text-center mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Promoção Exclusiva</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
                  <span className="text-lg sm:text-xl lg:text-2xl text-gray-400 line-through">R$ 97,90</span>
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-green-600">R$ 27,90</span>
                </div>
                <p className="text-xs sm:text-sm text-red-600 font-bold">⚠️ Oferta válida APENAS HOJE!</p>
              </div>

              <CheckoutSection 
                onPaymentSuccess={handlePaymentSuccess}
                quizData={userData}
                customButton={{
                  text: "DESBLOQUEAR AGORA 🔓",
                  className: "w-full py-4 sm:py-5 lg:py-6 text-base sm:text-lg lg:text-xl font-black bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 animate-pulse"
                }}
              />

              {/* Trust Badges */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Acesso imediato após pagamento</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-600">✓</span>
                  <span>Garantia de 7 dias</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Seção de Prova Social */}
        <div className="bg-gray-50 py-8 sm:py-12 -mx-4 sm:-mx-8 px-4 sm:px-8 mt-8 sm:mt-12">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6 sm:mb-8">
              Quem já desbloqueou o plano essa semana 👇
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1 - Fernanda Oliveira */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                      FO
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Fernanda Oliveira</p>
                      <p className="text-xs text-gray-500">BH/MG</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">
                    "Eu sempre desistia na segunda semana pq a comida era ruim. O que eu mais gostei aqui foi poder escolher que NÃO gosto de peixe. O cardápio ficou perfeito."
                  </p>
                  <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                </CardContent>
              </Card>

              {/* Card 2 - Ricardo Mendes */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                      RM
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Ricardo Mendes</p>
                      <p className="text-xs text-gray-500">SP/SP</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">
                    "Simples e direto. O treino que veio junto é básico mas funciona, tô conseguindo fazer em casa mesmo. Valeu cada centavo dos 27 reais."
                  </p>
                  <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                </CardContent>
              </Card>

              {/* Card 3 - Patrícia Lima */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                      PL
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Patrícia Lima</p>
                      <p className="text-xs text-gray-500">Curitiba/PR</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 mb-3">
                    "Gente, a lista de compras é tudo! Imprimi e levei no mercado, não comprei nada fora da dieta. Já desinchei 2kg em 5 dias."
                  </p>
                  <div className="text-yellow-500 text-lg">⭐⭐⭐⭐⭐</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Rodapé de Segurança */}
        <div className="border-t border-gray-200 mt-8 sm:mt-12 pt-6 sm:pt-8 pb-4 sm:pb-6">
          <div className="max-w-5xl mx-auto text-center space-y-2 sm:space-y-3">
            <p className="text-sm text-gray-600">
              Shape IA © 2026 - Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-500">
              CNPJ: 62.772.973/0001-04
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-green-600 transition-colors">
                Termos de Uso
              </a>
              <span>|</span>
              <a href="#" className="hover:text-green-600 transition-colors">
                Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

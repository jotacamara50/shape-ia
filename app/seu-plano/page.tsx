"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Leaf,
  MailCheck,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";
import { CheckoutSection } from "@/components/CheckoutSection";
import { Button } from "@/components/ui/button";
import { QuizData, NutritionPlan } from "@/types";
import {
  buildAnalysis,
  buildTimeline,
  getBodyConcernLabel,
  getGoalLabel,
  getHungerWindowLabel,
} from "@/lib/analysis";

const faqItems = [
  {
    question: "O que eu recebo após o pagamento?",
    answer: "Seu relatório personalizado em PDF com análise do seu perfil, cardápio semanal, lista de compras, cronograma, substituições e receitas.",
  },
  {
    question: "O plano é realmente personalizado?",
    answer: "Sim. As recomendações são geradas com base nas suas respostas — rotina, objetivos, desafios, restrições e hábitos alimentares.",
  },
  {
    question: "Quando recebo o acesso?",
    answer: "Logo após a confirmação do pagamento. O PDF também é enviado para o email informado no checkout.",
  },
];

const testimonials = [
  {
    name: "Fernanda, 34",
    quote: "A primeira vez que um plano pareceu encaixar na minha rotina em vez de me culpar por ela.",
    initial: "F",
  },
  {
    name: "Ricardo, 29",
    quote: "A parte mais útil foi entender o que me fazia exagerar à noite. Simples e direto.",
    initial: "R",
  },
  {
    name: "Patrícia, 41",
    quote: "A análise acertou meus desafios. O PDF veio organizado e fácil de seguir no celular.",
    initial: "P",
  },
];

export default function SeuPlanoPage() {
  const [userData, setUserData] = useState<QuizData | null>(null);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadToken, setDownloadToken] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const purchaseTrackedRef = useRef(false);
  const paymentHandledRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("shapeIA-quiz-data");
    if (!data) {
      router.push("/");
      return;
    }
    setUserData(JSON.parse(data));
  }, [router]);

  const analysis = useMemo(() => (userData ? buildAnalysis(userData) : null), [userData]);
  const previewTimeline = useMemo(() => (userData ? buildTimeline(userData) : []), [userData]);

  const handlePaymentSuccess = useCallback(
    async (token: string, payerEmail?: string) => {
      if (!userData || paymentHandledRef.current) return;

      paymentHandledRef.current = true;
      setDownloadToken(token);
      setIsPaid(true);
      setIsGenerating(true);

      if (typeof window !== "undefined" && !purchaseTrackedRef.current) {
        const fbq = (window as { fbq?: (...args: unknown[]) => void }).fbq;
        if (typeof fbq === "function") {
          const price = parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90");
          fbq("track", "Purchase", { value: price, currency: "BRL" });
          purchaseTrackedRef.current = true;
        }
      }

      try {
        const response = await fetch("/api/generate-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const plan = await response.json();
        setNutritionPlan(plan);

        const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

        if (payerEmail && isValidEmail(payerEmail)) {
          setEmailStatus("sending");
          setEmailMessage(`Enviando o relatório para ${payerEmail}...`);

          try {
            const emailResponse = await fetch("/api/send-plan-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: payerEmail, plan, userData }),
            });

            if (emailResponse.ok) {
              setEmailStatus("sent");
              setEmailMessage(`Relatório enviado para ${payerEmail}. Verifique também o spam.`);
            } else {
              const emailData = await emailResponse.json().catch(() => ({}));
              setEmailStatus("failed");
              setEmailMessage(emailData?.error || "Não foi possível enviar o email. O download continua disponível aqui.");
            }
          } catch (error) {
            console.error("Erro ao enviar email:", error);
            setEmailStatus("failed");
            setEmailMessage("Não foi possível enviar o email. O download continua disponível aqui.");
          }
        }
      } catch (error) {
        console.error("Erro ao gerar plano:", error);
      } finally {
        setIsGenerating(false);
      }
    },
    [userData]
  );

  const handleDownloadPDF = async () => {
    if (!nutritionPlan || !downloadToken) return;

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: nutritionPlan, userData, downloadToken }),
      });

      if (!response.ok) throw new Error("Erro ao gerar PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `shape-ai-plano-${userData?.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar PDF. Tente novamente em instantes.");
    }
  };

  /* ── Loading inicial ── */
  if (!userData || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafaf8]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-stone-600" />
          <p className="text-sm text-stone-400">Carregando sua análise…</p>
        </div>
      </div>
    );
  }

  /* ── Gerando plano pós-pagamento ── */
  if (isPaid && isGenerating) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf8] px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[1.75rem] border border-stone-100 bg-white p-10 text-center shadow-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-50"
          >
            <Leaf className="h-6 w-6 text-sage-600" />
          </motion.div>
          <h1 className="mt-7 text-2xl font-semibold tracking-[-0.025em] text-stone-900">
            Preparando seu plano
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-400">
            Estamos finalizando o cardápio, lista de compras, substituições e receitas para entregar o PDF completo.
          </p>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-stone-100">
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-sage-400"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── Plano pronto pós-pagamento ── */
  if (isPaid && nutritionPlan) {
    return (
      <div className="min-h-screen bg-[#fafaf8] px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm sm:p-10"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-sage-100 bg-sage-50 px-3 py-2 text-sm text-sage-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Pagamento confirmado
                </div>
                <h1 className="mt-5 text-[1.8rem] font-semibold leading-[1.2] tracking-[-0.025em] text-stone-900 sm:text-3xl">
                  Seu plano está pronto para download
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-400">
                  O relatório reúne o cardápio semanal, lista de compras, substituições e receitas alinhadas ao seu perfil.
                </p>
              </div>

              <Button
                onClick={handleDownloadPDF}
                className="h-12 shrink-0 rounded-2xl bg-stone-900 px-6 text-white hover:bg-stone-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </Button>
            </div>

            {emailStatus !== "idle" ? (
              <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-sm text-stone-500">
                <div className="flex items-center gap-2 font-medium text-stone-700">
                  <MailCheck className="h-4 w-4 text-sage-600" />
                  Entrega por email
                </div>
                <p className="mt-2">{emailMessage}</p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Calorias alvo", value: `${nutritionPlan.analise.caloriasRecomendadas} kcal` },
                { label: "Receitas incluídas", value: `${nutritionPlan.receitas.length} sugestões` },
                { label: "Checklist", value: `${nutritionPlan.checklist.length} itens` },
                { label: "Formato", value: "PDF completo" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                  <p className="text-xs text-stone-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold tracking-[-0.025em] text-stone-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="h-11 rounded-2xl border-stone-200 bg-white text-stone-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao início
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Página principal de resultado ── */
  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900">

      {/* Navbar */}
      <div className="sticky top-0 z-40 border-b border-stone-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sage-600">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900">Shape AI</p>
              <p className="text-xs text-stone-400">Sua análise está pronta</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-100 bg-stone-50 px-3 py-2 text-xs text-stone-500">
            <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
            Pagamento seguro
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Coluna esquerda */}
          <div className="space-y-5">

            {/* Resultado principal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-100 bg-stone-50 px-3 py-2 text-xs font-medium text-stone-500">
                <Target className="h-3.5 w-3.5 text-sage-600" />
                Análise concluída
              </div>

              <h1 className="mt-5 text-[1.8rem] font-semibold leading-[1.2] tracking-[-0.025em] text-stone-900 sm:text-3xl">
                {userData.name}, com base nas suas respostas, identificamos alguns padrões.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-stone-400">
                A análise considera impacto em {getBodyConcernLabel(userData.bodyConcern).toLowerCase()}, janela crítica no período da {getHungerWindowLabel(userData.hungerTime).toLowerCase()} e foco em {getGoalLabel(userData.goal).toLowerCase()}.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[
                  { label: "Perfil metabólico", value: analysis.perfilMetabolico, icon: Leaf },
                  { label: "Dificuldade estimada", value: analysis.nivelDificuldade, icon: Target },
                  { label: "Calorias alvo", value: `${analysis.caloriasRecomendadas} kcal`, icon: TrendingUp },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                    <item.icon className="h-4 w-4 text-sage-600" />
                    <p className="mt-3 text-xs text-stone-400">{item.label}</p>
                    <p className="mt-1 text-base font-semibold tracking-[-0.02em] text-stone-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Padrões identificados + estratégia */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="grid gap-5 sm:grid-cols-2"
            >
              <div className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
                  O que identificamos
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-stone-400">
                  Padrões que impactam sua rotina alimentar.
                </p>

                <div className="mt-5 space-y-2.5">
                  {analysis.bloqueiosIdentificados.map((blocker) => (
                    <div
                      key={blocker}
                      className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3.5 text-sm leading-6 text-stone-600"
                    >
                      <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage-500" />
                      {blocker}
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-stone-100 bg-stone-900 p-4 text-white">
                  <p className="text-sm leading-6 text-stone-300">{analysis.resumoInteligente}</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
                  Orientações iniciais
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-stone-400">
                  Direção sugerida para criar consistência antes de buscar intensidade.
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    { label: "Tendência alimentar", value: analysis.tendenciaAlimentar },
                    { label: "Estratégia base", value: analysis.estrategiaRecomendada },
                    { label: "Estimativa de evolução", value: analysis.estimativaEvolucao },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                      <p className="text-xs text-stone-400">{item.label}</p>
                      <p className="mt-1.5 text-sm font-medium text-stone-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
                Sua jornada estimada
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {previewTimeline.map((item, index) => (
                  <div key={item.fase} className="rounded-2xl border border-stone-100 bg-stone-50 p-5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-sage-700">
                      {index + 1}
                    </div>
                    <p className="mt-3 text-sm font-semibold text-stone-900">{item.fase}</p>
                    <p className="mt-1 text-sm font-medium text-stone-600">{item.foco}</p>
                    <p className="mt-2 text-xs leading-5 text-stone-400">{item.expectativa}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Preview bloqueado */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm"
            >
              <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
                Seu plano completo
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-2xl border border-stone-100 bg-stone-50 p-5">
                  <div className="space-y-3 blur-[3px] select-none">
                    <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                      <div>
                        <p className="text-xs text-stone-400">Relatório de {userData.name}</p>
                        <p className="mt-1 text-base font-semibold text-stone-900">
                          Plano alimentar personalizado
                        </p>
                      </div>
                      <div className="rounded-xl bg-stone-900 px-3 py-1.5 text-xs text-white">
                        {analysis.caloriasRecomendadas} kcal
                      </div>
                    </div>

                    {[
                      ["Perfil metabólico", analysis.perfilMetabolico],
                      ["Meta proteica", analysis.proteinaMeta],
                      ["Hidratação", analysis.hidratacaoMeta],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white p-4">
                        <p className="text-xs text-stone-400">{label}</p>
                        <p className="mt-1.5 text-sm font-medium text-stone-900">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
                    <div className="rounded-[1.4rem] border border-stone-100 bg-white p-5 text-center shadow-sm">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-100">
                        <ShieldCheck className="h-5 w-5 text-stone-400" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-stone-900">Conteúdo completo bloqueado</p>
                      <p className="mt-1.5 max-w-xs text-xs leading-5 text-stone-400">
                        Desbloqueie para acessar o PDF com cardápio, receitas e checklist.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    "Plano alimentar semanal completo",
                    "Cronograma de execução por fases",
                    "Lista de compras organizada",
                    "Receitas e substituições",
                    "Orientações comportamentais",
                    userData.wantsWorkout ? "Rotina básica de treino incluída" : "Foco total em alimentação",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3.5 text-sm leading-5 text-stone-600"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-sage-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Coluna direita — Checkout */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="h-fit lg:sticky lg:top-24"
          >
            <div className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sage-100 bg-sage-50 px-3 py-1.5 text-xs font-medium text-sage-700">
                <Leaf className="h-3 w-3" />
                Seu plano alimentar completo
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-[-0.025em] text-stone-900">
                Plano alimentar personalizado
              </h2>
              <p className="mt-2.5 text-sm leading-6 text-stone-400">
                Desbloqueie o protocolo completo com ajustes alimentares, cronograma, receitas e versão em PDF para seguir no dia a dia.
              </p>

              <div className="mt-5 rounded-2xl border border-stone-100 bg-stone-50 p-4 text-center">
                <p className="text-xs text-stone-400">Valor de hoje</p>
                <div className="mt-2.5 flex items-end justify-center gap-2.5">
                  <span className="text-sm text-stone-400 line-through">R$ 97,90</span>
                  <span className="text-3xl font-semibold tracking-[-0.04em] text-stone-900">
                    R$ {parseFloat(process.env.NEXT_PUBLIC_PRODUCT_PRICE || "27.90").toFixed(2)}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-stone-400">Pagamento único · Acesso imediato</p>
              </div>

              <div className="mt-5">
                <CheckoutSection onPaymentSuccess={handlePaymentSuccess} quizData={userData} />
              </div>

              <div className="mt-5 space-y-2.5">
                {[
                  "Garantia de 7 dias",
                  "Checkout processado pelo Mercado Pago",
                  "PDF enviado para o email informado",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs text-stone-400">
                    <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0 text-sage-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>

        {/* FAQ + Depoimentos */}
        <section className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
              Perguntas frequentes
            </h2>
            <div className="mt-5 space-y-3">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                  <p className="text-sm font-medium text-stone-900">{item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-[-0.02em] text-stone-900">
              O que dizem por aí
            </h2>
            <div className="mt-5 space-y-3">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-2xl border border-stone-100 bg-stone-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-100 text-sm font-semibold text-sage-700">
                      {item.initial}
                    </div>
                    <p className="text-sm font-semibold text-stone-900">{item.name}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-stone-400">&ldquo;{item.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

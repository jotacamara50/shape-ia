"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Download,
  Flame,
  Lock,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Target,
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
    answer: "Seu relatório premium em PDF com análise corporal, cardápio semanal, lista de compras, cronograma, substituições e receitas.",
  },
  {
    question: "O plano é realmente personalizado?",
    answer: "Sim. A geração usa seus dados físicos, rotina, sinais emocionais, restrições e objetivo principal para calibrar a estratégia.",
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
  },
  {
    name: "Ricardo, 29",
    quote: "A parte mais útil foi o diagnóstico do que me fazia exagerar à noite. O relatório parece software, não dieta genérica.",
  },
  {
    name: "Patrícia, 41",
    quote: "A leitura inicial já acertou meus bloqueios. O PDF veio organizado e fácil de seguir no celular.",
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
  const [timeLeft, setTimeLeft] = useState(600);
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

  useEffect(() => {
    if (isPaid) return;

    const timer = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid]);

  const analysis = useMemo(() => (userData ? buildAnalysis(userData) : null), [userData]);
  const previewTimeline = useMemo(() => (userData ? buildTimeline(userData) : []), [userData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
              body: JSON.stringify({
                email: payerEmail,
                plan,
                userData,
              }),
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
        body: JSON.stringify({
          plan: nutritionPlan,
          userData,
          downloadToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `shape-ai-relatorio-${userData?.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar PDF. Tente novamente em instantes.");
    }
  };

  if (!userData || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p>Carregando análise...</p>
      </div>
    );
  }

  if (isPaid && isGenerating) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),_transparent_24%),linear-gradient(180deg,_#f7f8fc_0%,_#ffffff_45%,_#f8fbff_100%)] px-4 py-10">
        <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/80 bg-white/84 p-8 text-center shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur sm:p-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-white"
            >
              <BrainCircuit className="h-7 w-7" />
            </motion.div>
            <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              Gerando seu relatório premium
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Estamos finalizando cardápio, lista de compras, substituições e estratégias de execução para entregar o PDF completo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPaid && nutritionPlan) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),_transparent_24%),linear-gradient(180deg,_#f7f8fc_0%,_#ffffff_45%,_#f8fbff_100%)] px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur sm:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Pagamento aprovado
                </div>
                <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  Seu protocolo está pronto para download
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  O relatório reúne sua análise metabólica, cardápio semanal, lista de compras, substituições inteligentes e receitas alinhadas ao seu perfil.
                </p>
              </div>

              <Button
                onClick={handleDownloadPDF}
                className="h-12 rounded-2xl bg-slate-950 px-6 text-white hover:bg-slate-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar PDF
              </Button>
            </div>

            {emailStatus !== "idle" ? (
              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-4 text-sm text-slate-600">
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <MailCheck className="h-4 w-4 text-indigo-600" />
                  Entrega por email
                </div>
                <p className="mt-2">{emailMessage}</p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Score corporal", value: nutritionPlan.analise.scoreCorporal.toString() },
                { label: "Calorias alvo", value: `${nutritionPlan.analise.caloriasRecomendadas} kcal` },
                { label: "Receitas", value: `${nutritionPlan.receitas.length} sugestões` },
                { label: "Checklist", value: `${nutritionPlan.checklist.length} itens` },
              ].map((item) => (
                <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="h-12 rounded-2xl border-slate-200 bg-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao início
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.10),_transparent_22%),linear-gradient(180deg,_#f6f8fc_0%,_#ffffff_40%,_#f8fbff_100%)] text-slate-950">
      <div className="sticky top-0 z-40 border-b border-white/70 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Shape AI
              </p>
              <p className="text-sm text-slate-500">Resultado inicial da sua análise</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
            <Clock3 className="h-4 w-4" />
            Condição especial por {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm text-indigo-700">
                <BrainCircuit className="h-4 w-4" />
                Análise metabólica concluída
              </div>

              <h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                {userData.name}, seu perfil inicial indica {analysis.perfilMetabolico.toLowerCase()}.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                A leitura aponta impacto relevante de {getBodyConcernLabel(userData.bodyConcern)} com janela crítica em {getHungerWindowLabel(userData.hungerTime)} e foco principal em {getGoalLabel(userData.goal).toLowerCase()}.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Score corporal", value: analysis.scoreCorporal.toString(), icon: Sparkles },
                  { label: "Dificuldade", value: analysis.nivelDificuldade, icon: Target },
                  { label: "Calorias alvo", value: `${analysis.caloriasRecomendadas} kcal`, icon: Flame },
                  { label: "Confiança da análise", value: `${analysis.confiancaAnalise}%`, icon: ShieldCheck },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 p-5">
                    <item.icon className="h-5 w-5 text-indigo-600" />
                    <p className="mt-4 text-sm text-slate-500">{item.label}</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur">
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  O que a IA identificou
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Seu resultado cruza metabolismo, padrão de fome e capacidade real de execução.
                </p>

                <div className="mt-6 space-y-3">
                  {analysis.bloqueiosIdentificados.map((blocker) => (
                    <div
                      key={blocker}
                      className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
                    >
                      {blocker}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
                  <p className="text-sm text-slate-300">Resumo inteligente</p>
                  <p className="mt-3 text-lg leading-8">{analysis.resumoInteligente}</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur">
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                  Estratégia recomendada
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Direção sugerida para gerar aderência antes de buscar intensidade.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Tendência alimentar</p>
                    <p className="mt-2 font-medium text-slate-950">{analysis.tendenciaAlimentar}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Estratégia base</p>
                    <p className="mt-2 font-medium text-slate-950">{analysis.estrategiaRecomendada}</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Estimativa de evolução</p>
                    <p className="mt-2 font-medium text-slate-950">{analysis.estimativaEvolucao}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                Timeline da sua evolução personalizada
              </h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {previewTimeline.map((item) => (
                  <div key={item.fase} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-medium text-indigo-700">{item.fase}</p>
                    <p className="mt-3 font-semibold text-slate-950">{item.foco}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.expectativa}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur"
            >
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
                Preview do relatório premium
              </h2>
              <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="space-y-4 blur-[2px]">
                    <div className="flex items-center justify-between rounded-[1.3rem] bg-white p-4">
                      <div>
                        <p className="text-sm text-slate-500">Relatório de {userData.name}</p>
                        <p className="mt-1 text-lg font-semibold text-slate-950">
                          Plano alimentar por IA
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-950 px-3 py-2 text-sm text-white">
                        Score {analysis.scoreCorporal}
                      </div>
                    </div>

                    {[
                      ["Perfil metabólico", analysis.perfilMetabolico],
                      ["Meta proteica", analysis.proteinaMeta],
                      ["Hidratação", analysis.hidratacaoMeta],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1.2rem] bg-white p-4">
                        <p className="text-sm text-slate-500">{label}</p>
                        <p className="mt-2 font-medium text-slate-950">{value}</p>
                      </div>
                    ))}

                    <div className="rounded-[1.2rem] bg-white p-4">
                      <p className="text-sm text-slate-500">Macronutrientes sugeridos</p>
                      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
                          Prot. {analysis.macros.proteinas}g
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
                          Carb. {analysis.macros.carboidratos}g
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3 text-slate-700">
                          Gord. {analysis.macros.gorduras}g
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-white/35 backdrop-blur-sm">
                    <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-5 text-center shadow-xl">
                      <Lock className="mx-auto h-8 w-8 text-slate-950" />
                      <p className="mt-3 font-semibold text-slate-950">Desbloqueie o protocolo completo</p>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                        Acesso ao PDF com cardápio, cronograma, substituições, receitas e checklist.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Plano alimentar semanal completo",
                    "Score corporal e perfil metabólico",
                    "Cronograma de execução por fases",
                    "Lista de compras organizada",
                    "Receitas e substituições inteligentes",
                    userData.wantsWorkout ? "Rotina básica de treino incluída" : "Foco total em alimentação personalizada",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="h-fit lg:sticky lg:top-24"
          >
            <div className="rounded-[2rem] border border-slate-900/5 bg-slate-950 p-5 text-white shadow-[0_40px_120px_rgba(15,23,42,0.20)]">
              <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Oferta do seu relatório
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
                Plano alimentar personalizado por IA
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Desbloqueie agora o protocolo completo com ajustes alimentares, cronograma, receitas e versão em PDF para seguir no dia a dia.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm text-slate-400">Condição especial de hoje</p>
                <div className="mt-3 flex items-end justify-center gap-3">
                  <span className="text-lg text-slate-500 line-through">R$ 97,90</span>
                  <span className="text-4xl font-semibold tracking-[-0.05em] text-white">R$ 27,90</span>
                </div>
                <p className="mt-2 text-sm text-cyan-200">Pagamento seguro com acesso imediato</p>
              </div>

              <div className="mt-6">
                <CheckoutSection onPaymentSuccess={handlePaymentSuccess} quizData={userData} />
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                {[
                  "Garantia de 7 dias",
                  "Checkout processado pelo Mercado Pago",
                  "Envio do PDF para o email informado",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">FAQ</h2>
            <div className="mt-6 space-y-4">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-950">{item.question}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/84 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
              Quem já desbloqueou
            </h2>
            <div className="mt-6 space-y-4">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

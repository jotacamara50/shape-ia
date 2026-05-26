"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumLandingProps {
  onStart: () => void;
}

const metrics = [
  { value: "+48 mil", label: "análises iniciadas" },
  { value: "4.9/5", label: "avaliação média" },
  { value: "8 min", label: "tempo médio da análise" },
];

const highlights = [
  {
    icon: BrainCircuit,
    title: "Leitura comportamental",
    description: "Cruza fome, rotina, autoestima e histórico de dietas para entender o que trava seu progresso.",
  },
  {
    icon: BarChart3,
    title: "Estratégia alimentar inteligente",
    description: "Transforma seus sinais metabólicos em um protocolo alimentar mais realista para o seu contexto.",
  },
  {
    icon: Smartphone,
    title: "Experiência pensada para mobile",
    description: "Fluxo rápido, visual limpo e progresso visível para manter retenção alta até o final.",
  },
];

const proofPoints = [
  "Plano alimentar personalizado por IA",
  "Relatório premium com score corporal e bloqueios identificados",
  "Checkout seguro com entrega imediata do PDF",
];

export function PremiumLanding({ onStart }: PremiumLandingProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_24%),linear-gradient(180deg,_#f7f8fc_0%,_#ffffff_38%,_#f9fbff_100%)] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-4rem] top-24 h-40 w-40 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute right-[-3rem] top-12 h-52 w-52 rounded-full bg-indigo-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-100/50 blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Shape AI
              </p>
              <p className="text-sm text-slate-500">
                Análise Metabólica Inteligente
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur sm:flex">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Checkout seguro e entrega imediata
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/75 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur"
            >
              <BrainCircuit className="h-4 w-4 text-indigo-600" />
              IA nutricional com leitura metabólica e comportamental
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="max-w-xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl"
            >
              Seu corpo pode estar bloqueando seu emagrecimento.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
            >
              Nossa IA analisa metabolismo, hábitos e rotina para criar um plano alimentar personalizado com mais aderência, clareza e percepção de valor.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                onClick={onStart}
                className="h-14 rounded-2xl bg-slate-950 px-7 text-base font-semibold text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)] hover:bg-slate-800"
              >
                Fazer análise gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur">
                <TimerReset className="h-4 w-4 text-sky-600" />
                Relatório inicial em menos de 2 minutos
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/90 bg-white/75 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <p className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{metric.label}</p>
                </div>
              ))}
            </motion.div>

            <div className="mt-10 grid gap-3">
              {proofPoints.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-4 text-sm text-slate-600 shadow-sm backdrop-blur"
                >
                  <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-[2rem] border border-white/90 bg-white/80 p-5 shadow-[0_40px_120px_rgba(15,23,42,0.12)] backdrop-blur"
          >
            <div className="rounded-[1.7rem] bg-slate-950 px-5 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                    Painel da análise
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                    Perfil metabólico em construção
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
                  <p className="text-xs text-slate-400">Confiabilidade</p>
                  <p className="text-lg font-semibold">91%</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-300">Leituras em andamento</p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      ["Rotina", "Alta variabilidade"],
                      ["Fome", "Pico noturno"],
                      ["Aderência", "Moderada"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-white/5 p-3"
                      >
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="mt-2 text-sm font-medium text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <p>Mapa de evolução estimada</p>
                    <p>4 semanas</p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { width: "34%", label: "Adaptação" },
                      { width: "62%", label: "Constância" },
                      { width: "79%", label: "Ajuste fino" },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="mb-1 flex justify-between text-xs text-slate-400">
                          <span>{bar.label}</span>
                          <span>{bar.width}</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
                            style={{ width: bar.width }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {highlights.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-slate-900"
                    >
                      <item.icon className="h-5 w-5 text-indigo-600" />
                      <p className="mt-4 text-sm font-semibold">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

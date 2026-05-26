"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit, LineChart, Sparkles } from "lucide-react";

const loadingStages = [
  { progress: 12, message: "Analisando perfil corporal" },
  { progress: 31, message: "Calculando metabolismo" },
  { progress: 56, message: "Identificando padrões alimentares" },
  { progress: 78, message: "IA detectando bloqueios" },
  { progress: 92, message: "Gerando estratégia personalizada" },
  { progress: 100, message: "Finalizando seu relatório inicial" },
];

const liveMessages = [
  "Identificando metabolismo dominante...",
  "Analisando padrão de fome...",
  "Calculando déficit ideal...",
  "Comparando rotina e consistência...",
  "Gerando plano personalizado...",
];

interface LoadingScreenProps {
  onComplete: () => void;
  userName?: string;
}

export function LoadingScreen({ onComplete, userName }: LoadingScreenProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((current) => {
        if (current < loadingStages.length - 1) {
          return current + 1;
        }

        return current;
      });
    }, 1700);

    const messageInterval = setInterval(() => {
      setMessageIndex((current) => (current + 1) % liveMessages.length);
    }, 1600);

    const timer = setTimeout(() => {
      onComplete();
    }, 9800);

    return () => {
      clearInterval(stageInterval);
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  const currentStage = loadingStages[stageIndex];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.14),_transparent_24%),linear-gradient(180deg,_#f6f8fc_0%,_#ffffff_46%,_#f8fbff_100%)] px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-3rem] top-20 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute right-[-4rem] bottom-20 h-52 w-52 rounded-full bg-cyan-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Shape AI
                </p>
                <p className="text-sm text-slate-500">Leitura metabólica em tempo real</p>
              </div>
            </div>

            <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              {userName ? `${userName}, sua análise está sendo construída.` : "Sua análise está sendo construída."}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              A IA está cruzando sinais físicos, comportamentais e de rotina para gerar um relatório inicial com score corporal, bloqueios e estratégia recomendada.
            </p>

            <div className="mt-8 rounded-[1.6rem] border border-slate-200 bg-slate-50/90 p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Progresso da análise</span>
                <span>{currentStage.progress}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                <motion.div
                  key={currentStage.progress}
                  initial={{ width: 0 }}
                  animate={{ width: `${currentStage.progress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-500"
                />
              </div>
              <p className="mt-4 text-lg font-medium text-slate-900">{currentStage.message}</p>
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-slate-500"
              >
                {liveMessages[messageIndex]}
              </motion.p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Score corporal", value: "Processando" },
                { label: "Bloqueios", value: "Mapeando" },
                { label: "Plano", value: "Modelando" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.4rem] border border-slate-200 bg-white p-4"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="rounded-[2rem] border border-slate-900/5 bg-slate-950 p-5 text-white shadow-[0_40px_120px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Núcleo de IA
                </p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  Simulação da análise ativa
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <LineChart className="h-5 w-5 text-cyan-300" />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  Score corporal em calibração
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <motion.div
                      key={index}
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ repeat: Infinity, duration: 1.8, delay: index * 0.08 }}
                      className="h-10 rounded-2xl bg-gradient-to-br from-cyan-400/50 via-sky-400/20 to-indigo-400/50"
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Leituras em tempo real</p>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "Perfil de fome", width: "74%" },
                    { label: "Aderência prevista", width: "61%" },
                    { label: "Impacto da rotina", width: "83%" },
                    { label: "Resposta metabólica", width: "68%" },
                  ].map((item, index) => (
                    <div key={item.label}>
                      <div className="mb-2 flex justify-between text-xs text-slate-400">
                        <span>{item.label}</span>
                        <span>{item.width}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: item.width }}
                          transition={{ duration: 1.2, delay: index * 0.18 }}
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
                A análise compara padrões de fome, rotina, histórico alimentar e sinais corporais para sugerir uma estratégia mais inteligente do que uma dieta fixa.
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

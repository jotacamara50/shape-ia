"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

const loadingStages = [
  { progress: 12, message: "Organizando suas respostas…" },
  { progress: 28, message: "Identificando seus padrões…" },
  { progress: 48, message: "Mapeando seus hábitos alimentares…" },
  { progress: 68, message: "Preparando sua análise…" },
  { progress: 84, message: "Personalizando recomendações…" },
  { progress: 100, message: "Finalizando seu resultado…" },
];

const liveMessages = [
  "Analisando seus horários de fome…",
  "Cruzando rotina e hábitos…",
  "Identificando seus desafios…",
  "Preparando sugestões para você…",
  "Quase pronto…",
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
        if (current < loadingStages.length - 1) return current + 1;
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf8] px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-10 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sage-600">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold text-stone-900">Shape AI</span>
        </div>

        {/* Ícone pulsante central */}
        <div className="flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-sage-100"
            />
            <motion.div
              animate={{ scale: [1, 1.14, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-[-8px] rounded-full bg-sage-100"
            />
            <Leaf className="relative h-8 w-8 text-sage-600" />
          </div>
        </div>

        {/* Título */}
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-semibold tracking-[-0.025em] text-stone-900">
            {userName ? `${userName}, sua análise está sendo preparada.` : "Sua análise está sendo preparada."}
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-400">
            Com base nas suas respostas, estamos organizando suas recomendações personalizadas.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8 rounded-[1.5rem] border border-stone-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStage.message}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35 }}
              >
                {currentStage.message}
              </motion.span>
            </AnimatePresence>
            <span className="tabular-nums">{currentStage.progress}%</span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
            <motion.div
              key={currentStage.progress}
              initial={{ width: 0 }}
              animate={{ width: `${currentStage.progress}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full rounded-full bg-sage-500"
            />
          </div>

          <div className="mt-4 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs text-stone-400"
              >
                {liveMessages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Steps visuais */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          {[
            { label: "Rotina", done: stageIndex >= 1 },
            { label: "Hábitos", done: stageIndex >= 3 },
            { label: "Plano", done: stageIndex >= 5 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-stone-100 bg-white px-3 py-3 text-center shadow-sm"
            >
              <motion.div
                animate={{ backgroundColor: item.done ? "#4a7041" : "#e5e3dc" }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-2 h-1.5 w-8 rounded-full"
              />
              <p className={`text-xs font-medium ${item.done ? "text-sage-700" : "text-stone-400"}`}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

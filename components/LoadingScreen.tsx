"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Leaf, ShieldAlert, Cpu, BarChart3, Activity } from "lucide-react";

const loadingStages = [
  { progress: 15, message: "Validando integridade das respostas...", icon: Leaf },
  { progress: 38, message: "Ajustando coeficientes metabólicos (Harris-Benedict)...", icon: Activity },
  { progress: 59, message: "Identificando janelas críticas de cortisol e compulsão...", icon: ShieldAlert },
  { progress: 76, message: "Isolando restrições e calculando quebra de macronutrientes...", icon: BarChart3 },
  { progress: 91, message: "Compilando checklist comportamental e receitas em PDF...", icon: Cpu },
  { progress: 100, message: "Criptografando relatório final do usuário...", icon: Leaf },
];

interface LoadingScreenProps {
  onComplete: () => void;
  userName?: string;
}

export function LoadingScreen({ onComplete, userName }: LoadingScreenProps) {
  const [stageIndex, setStageIndex] = useState(0);
  // Estados simulados para gráficos dinâmicos de app premium
  const [metricBasal, setMetricBasal] = useState(1120);
  const [metricDeficit, setMetricDeficit] = useState(0);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((current) => {
        if (current < loadingStages.length - 1) return current + 1;
        return current;
      });
    }, 1600);

    // Animando pequenos contadores numéricos para dar dinamismo de software ativo
    const counterInterval = setInterval(() => {
      setMetricBasal((prev) => (prev < 1650 ? prev + 11 : prev));
      setMetricDeficit((prev) => (prev < 450 ? prev + 4 : prev));
    }, 40);

    const timeoutTimer = setTimeout(() => {
      onComplete();
    }, 9800);

    return () => {
      clearInterval(stageInterval);
      clearInterval(counterInterval);
      clearTimeout(timeoutTimer);
    };
  }, [onComplete]);

  const currentStage = loadingStages[stageIndex];
  const CurrentIcon = currentStage.icon;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafaf8] px-4 py-8 selection:bg-stone-200">
      <div className="w-full max-w-md bg-white border border-stone-200/60 shadow-wellness-md rounded-[2rem] p-6 sm:p-8 text-center">
        
        {/* Marca Superior Minimalista */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-950">
            <Leaf className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-stone-900 tracking-tight">Shape AI</span>
        </div>

        {/* Animação do Scanner Central */}
        <div className="flex justify-center my-6">
          <div className="relative flex h-24 w-24 items-center justify-center bg-stone-50 rounded-2xl border border-stone-100 shadow-inner">
            <motion.div
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ["30%", "50%", "30%"]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute h-16 w-16 bg-stone-950/5 border border-stone-950/10"
            />
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute"
            >
              <CurrentIcon className="h-8 w-8 text-stone-950 stroke-[1.8]" />
            </motion.div>
          </div>
        </div>

        {/* Textos de Alinhamento */}
        <div className="space-y-2 mt-4">
          <h1 className="text-xl font-bold tracking-tight text-stone-900 leading-tight">
            {userName ? `${userName}, nossa IA está processando seu perfil.` : "Processando perfil metabólico."}
          </h1>
          <p className="text-xs font-medium text-stone-400 max-w-xs mx-auto leading-relaxed">
            Seus desequilíbrios calóricos e gatilhos de rotina estão sendo cruzados com nossa base médica de dados.
          </p>
        </div>

        {/* Seção de Gráficos Simulados "Cara de App" */}
        <div className="mt-8 border border-stone-100 rounded-2xl bg-stone-50/50 p-4 text-left space-y-3.5 shadow-inner">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-1.5">
            Métricas de Calibração Ativa
          </p>
          
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-600 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-stone-400" /> TMB Estimada:
            </span>
            <span className="font-bold font-mono text-stone-900">{metricBasal} kcal</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-600 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-stone-400" /> Déficit Alvo Seguro:
            </span>
            <span className="font-bold font-mono text-stone-900">-{metricDeficit} kcal</span>
          </div>

          <div className="pt-2 border-t border-stone-100/70">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold text-stone-700">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStage.message}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 5 }}
                  transition={{ duration: 0.3 }}
                  className="truncate max-w-[85%]"
                >
                  {currentStage.message}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono">{currentStage.progress}%</span>
            </div>

            <div className="h-2 w-full bg-stone-200/50 rounded-full overflow-hidden">
              <motion.div
                key={currentStage.progress}
                initial={{ width: 0 }}
                animate={{ width: `${currentStage.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-stone-950 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Footer Informativo Focado em Conversão */}
        <p className="mt-6 text-[10px] font-medium text-stone-400 flex items-center justify-center gap-1.5">
          🔒 Conexão SSL Segura · Algoritmo IA v4.12
        </p>
      </div>
    </div>
  );
}

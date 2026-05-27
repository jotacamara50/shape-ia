"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Leaf, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ActivityLevel,
  BiggestChallenge,
  BodyConcern,
  ConsistencyDifficulty,
  DietHistory,
  EmotionalHunger,
  Gender,
  Goal,
  HungerWindow,
  QuizData,
  RoutineImpact,
  MirrorFeeling,
} from "@/types";

const TOTAL_STEPS = 9;

const progressMessages = [
  { threshold: 12, label: "Configurando onboarding do app..." },
  { threshold: 31, label: "Analisando perfil metabólico..." },
  { threshold: 56, label: "Mapeando comportamento diário..." },
  { threshold: 78, label: "Sincronizando IA Nutricional..." },
  { threshold: 92, label: "Estruturando protocolo personalizado..." },
];

// Opções enriquecidas com links para fotos reais (.webp ou .jpg recomendados na sua pasta public/)
const goalOptions: { value: Goal; label: string; subtitle: string; imageUrl: string }[] = [
  { value: "emagrecer", label: "Emagrecer", subtitle: "Queimar gordura com déficit estratégico", imageUrl: "/images/quiz/emagrecer.webp" },
  { value: "reeducacao", label: "Reorganizar alimentação", subtitle: "Criar rotina e constância sustentável", imageUrl: "/images/quiz/reeducacao.webp" },
  { value: "manter", label: "Manter e controlar", subtitle: "Estabilidade sem o efeito sanfona", imageUrl: "/images/quiz/manter.webp" },
  { value: "massa", label: "Ganhar massa magra", subtitle: "Mais energia, tônus e estrutura", imageUrl: "/images/quiz/massa.webp" },
];

const bodyConcernOptions: { value: BodyConcern; label: string; subtitle: string; imageUrl: string }[] = [
  { value: "abdomen", label: "Região Abdominal", subtitle: "Inchaço constante ou gordura localizada", imageUrl: "/images/quiz/abdomen.webp" },
  { value: "pernas", label: "Coxas e Pernas", subtitle: "Retenção de líquidos e flacidez", imageUrl: "/images/quiz/pernas.webp" },
  { value: "bracos", label: "Membros Superiores", subtitle: "Falta de definição em braços e costas", imageUrl: "/images/quiz/bracos.webp" },
  { value: "corpo_todo", label: "Mudança Geral", subtitle: "Sensação generalizada de desequilíbrio", imageUrl: "/images/quiz/corpotodo.webp" },
];

const activityOptions: { value: ActivityLevel; label: string; subtitle: string }[] = [
  { value: "sedentario", label: "Sedentário / Baixo", subtitle: "Trabalho sentado, sem treinos regulares" },
  { value: "leve", label: "Atividade Leve", subtitle: "Caminhadas ou exercícios 1-2x por semana" },
  { value: "moderado", label: "Atividade Moderada", subtitle: "Treinos estruturados 3-4x por semana" },
  { value: "intenso", label: "Alta Performance", subtitle: "Rotina ativa com treinos diários pesados" },
];

const challengeOptions: { value: BiggestChallenge; label: string; subtitle: string; imageUrl: string }[] = [
  { value: "ansiedade", label: "Ansiedade Constante", subtitle: "Comer por impulso em momentos de estresse", imageUrl: "/images/quiz/ansiedade.webp" },
  { value: "beliscos", label: "Beliscos ao longo do dia", subtitle: "Perder o controle com pequenos lanches aleatórios", imageUrl: "/images/quiz/beliscos.webp" },
  { value: "falta_tempo", label: "Falta de tempo", subtitle: "Improvisar refeições com fast-food ou ultraprocessados", imageUrl: "/images/quiz/tempo.webp" },
  { value: "compulsao_noturna", label: "Fome Noturna Descontrolada", subtitle: "Exagerar consideravelmente após o fim do expediente", imageUrl: "/images/quiz/noite.webp" },
];

interface NutritionQuizProps {
  onComplete: (data: QuizData) => void;
}

function StepShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -12 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-4">
        {eyebrow}
      </span>
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 leading-tight">
        {title}
      </h2>
      <p className="mt-2.5 text-stone-400 text-sm leading-relaxed max-w-lg">
        {description}
      </p>
      <div className="mt-6 w-full">{children}</div>
    </motion.div>
  );
}

function PremiumOptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = "single",
}: {
  options: { value: T; label: string; subtitle?: string; imageUrl?: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: "single" | "double";
}) {
  return (
    <div className={`grid gap-3.5 w-full ${columns === "double" ? "sm:grid-cols-2" : "grid-cols-1"}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 flex items-center justify-between p-4 min-h-[85px] w-full ${
              isSelected
                ? "border-stone-950 bg-stone-950 text-white shadow-xl shadow-stone-950/10"
                : "border-stone-200/70 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50/50"
            }`}
          >
            <div className="flex-1 pr-4">
              <p className="text-base font-bold tracking-tight">{option.label}</p>
              {option.subtitle && (
                <p className={`mt-1 text-xs leading-normal font-medium ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                  {option.subtitle}
                </p>
              )}
            </div>

            {option.imageUrl ? (
              <div className="h-16 w-16 relative rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={option.imageUrl}
                  alt={option.label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback caso a imagem ainda não exista na pasta
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                isSelected ? "border-white bg-white" : "border-stone-300"
              }`}>
                {isSelected && <Check className="h-3 w-3 text-stone-950 stroke-[3]" />}
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export function NutritionQuiz({ onComplete }: NutritionQuizProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<QuizData>({
    goal: "emagrecer",
    gender: "feminino",
    age: 0,
    weight: 0,
    height: 0,
    activityLevel: "sedentario",
    restrictions: "",
    wantsWorkout: true,
    name: "",
    bodyConcern: "abdomen",
    biggestChallenge: "ansiedade",
    emotionalHunger: "as_vezes",
    dietsTried: "1_2",
    mirrorFeeling: "incomodada",
    consistencyDifficulty: "media",
    hungerTime: "noite",
    routineImpact: "medio",
  });

  const progress = Math.round((step / TOTAL_STEPS) * 100);
  const progressLabel =
    [...progressMessages].reverse().find((item) => progress >= item.threshold)?.label ||
    progressMessages[0].label;

  const canProceed = () => {
    if (step === 1) return data.name.trim().length >= 2;
    if (step === 2) return Boolean(data.goal);
    if (step === 3) return Boolean(data.bodyConcern);
    if (step === 4) return data.age > 12 && data.weight > 30 && data.height > 100 && Boolean(data.gender);
    if (step === 5) return Boolean(data.activityLevel);
    if (step === 6) return Boolean(data.biggestChallenge);
    if (step === 7) return Boolean(data.emotionalHunger) && Boolean(data.dietsTried);
    if (step === 8) return Boolean(data.mirrorFeeling) && Boolean(data.consistencyDifficulty);
    if (step === 9) return Boolean(data.hungerTime) && Boolean(data.routineImpact);
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onComplete(data);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((current) => current - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const approxImc =
    data.weight > 0 && data.height > 0
      ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center selection:bg-stone-200">
      <div className="w-full max-w-xl flex flex-col flex-1 px-4 py-6 sm:py-10">
        
        {/* Header Estilo App Nativo */}
        <div className="mb-6 rounded-2xl border border-stone-200/60 bg-white p-4 shadow-wellness-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 shadow-sm shadow-stone-900/10">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Onboarding App</p>
                <p className="text-sm font-bold text-stone-900">Passo {step} de {TOTAL_STEPS}</p>
              </div>
            </div>
            <div className="text-xs font-semibold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
              {progressLabel}
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full rounded-full bg-stone-900"
              />
            </div>
          </div>
        </div>

        {/* Content Wizard (Ocupando a tela como App) */}
        <div className="flex-1 bg-white border border-stone-200/60 shadow-wellness-sm rounded-3xl p-5 sm:p-8 flex flex-col justify-between min-h-[460px]">
          <div className="w-full flex-1 flex items-start">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepShell
                  key="step-1"
                  eyebrow="Identificação Perfil"
                  title="Para começarmos a sua análise, qual é o seu nome?"
                  description="Usamos seu nome apenas para customizar os relatórios e estruturar o painel do seu plano alimentar com IA."
                >
                  <div className="space-y-4 w-full">
                    <Input
                      value={data.name}
                      onChange={(e) => setData((c) => ({ ...c, name: e.target.value }))}
                      placeholder="Digite seu nome (ex: Ana)"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50/50 px-5 text-lg focus:border-stone-950 focus:bg-white transition-all font-medium"
                    />
                    <div className="rounded-2xl border border-stone-100 bg-stone-50/60 p-4 text-xs leading-relaxed text-stone-400 font-medium">
                      🔒 Seus dados estão protegidos por criptografia de ponta a ponta e serão usados exclusivamente pela inteligência do algoritmo.
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  key="step-2"
                  eyebrow="Objetivo Primário"
                  title={`${data.name}, qual o seu foco principal hoje?`}
                  description="A IA recalcula o balanço de macronutrientes e as metas de calorias de acordo com este direcionamento."
                >
                  <PremiumOptionGrid options={goalOptions} value={data.goal} onChange={(v) => setData((c) => ({ ...c, goal: v }))} />
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  key="step-3"
                  eyebrow="Mapeamento Estético"
                  title="Qual área corporal mais te incomoda atualmente?"
                  description="Com essa resposta, nosso algoritmo calibra o índice de retenção hídrica do relatório."
                >
                  <PremiumOptionGrid options={bodyConcernOptions} value={data.bodyConcern} onChange={(v) => setData((c) => ({ ...c, bodyConcern: v }))} columns="double" />
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  key="step-4"
                  eyebrow="Dados Biométricos"
                  title="Quais são as suas métricas atuais?"
                  description="Esses dados alimentam as fórmulas clínicas de Harris-Benedict para estimar seu gasto energético exato."
                >
                  <div className="grid gap-3.5 sm:grid-cols-3 w-full">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wide">Idade</label>
                      <Input type="number" min={13} value={data.age || ""} onChange={(e) => setData((c) => ({ ...c, age: Number(e.target.value || 0) }))} placeholder="Anos" className="h-14 rounded-xl border-stone-200 bg-stone-50/50 text-center text-lg font-semibold focus:bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wide">Peso</label>
                      <Input type="number" min={30} value={data.weight || ""} onChange={(e) => setData((c) => ({ ...c, weight: Number(e.target.value || 0) }))} placeholder="kg" className="h-14 rounded-xl border-stone-200 bg-stone-50/50 text-center text-lg font-semibold focus:bg-white" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wide">Altura</label>
                      <Input type="number" min={100} value={data.height || ""} onChange={(e) => setData((c) => ({ ...c, height: Number(e.target.value || 0) }))} placeholder="cm" className="h-14 rounded-xl border-stone-200 bg-stone-50/50 text-center text-lg font-semibold focus:bg-white" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3.5 w-full">
                    {[
                      { value: "feminino", label: "🚺 Feminino" },
                      { value: "masculino", label: "🚹 Masculino" },
                    ].map((opt) => {
                      const sel = data.gender === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setData((c) => ({ ...c, gender: opt.value as Gender }))}
                          className={`h-14 rounded-xl border font-bold text-sm tracking-tight transition-all flex items-center justify-center ${
                            sel ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {approxImc && (
                    <div className="mt-6 rounded-2xl border border-stone-100 bg-stone-50/60 p-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">Prévia de Diagnóstico</span>
                      <span className="text-sm font-bold text-stone-900 bg-white px-3 py-1.5 rounded-xl border border-stone-100 shadow-sm">
                        IMC: {approxImc}
                      </span>
                    </div>
                  )}
                </StepShell>
              )}

              {step === 5 && (
                <StepShell
                  key="step-5"
                  eyebrow="Fator de Atividade"
                  title="Como descreveria sua rotina física atual?"
                  description="O nível de movimentação diária dita o multiplicador de gasto total do metabolismo ativo."
                >
                  <PremiumOptionGrid options={activityOptions} value={data.activityLevel} onChange={(v) => setData((c) => ({ ...c, activityLevel: v }))} />
                </StepShell>
              )}

              {step === 6 && (
                <StepShell
                  key="step-6"
                  eyebrow="Análise de Bloqueios"
                  title="Qual o maior obstáculo na sua constância alimentar?"
                  description="Mapear o gatilho comportamental é vital para que a IA crie estratégias antifrahas em horários difíceis."
                >
                  <PremiumOptionGrid options={challengeOptions} value={data.biggestChallenge} onChange={(v) => setData((c) => ({ ...c, biggestChallenge: v }))} />
                </StepShell>
              )}

              {step === 7 && (
                <StepShell
                  key="step-7"
                  eyebrow="Relação Alimentar"
                  title="Investigando seu histórico e gatilhos emocionais."
                  description="Responda com sinceridade para mapearmos padrões metabólicos repetitivos."
                >
                  <div className="space-y-5 w-full">
                    <div>
                      <p className="mb-2 text-xs font-bold text-stone-400 uppercase tracking-wide">Você sente episódios de fome emocional?</p>
                      <PremiumOptionGrid
                        options={[
                          { value: "nunca", label: "Quase nunca", subtitle: "Minha fome é estritamente física" },
                          { value: "as_vezes", label: "Ocasionalmente", subtitle: "Ocorre sob estresse ou cansaço intenso" },
                          { value: "frequente", label: "Com frequência", subtitle: "Uso a comida para modular sentimentos" },
                        ]}
                        value={data.emotionalHunger}
                        onChange={(v) => setData((c) => ({ ...c, emotionalHunger: v as EmotionalHunger }))}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-bold text-stone-400 uppercase tracking-wide">Quantas dietas restritivas já tentou?</p>
                      <PremiumOptionGrid
                        options={[
                          { value: "nenhuma", label: "Nenhuma" },
                          { value: "1_2", label: "1 a 2 tentativas" },
                          { value: "3_5", label: "3 a 5 tentativas" },
                          { value: "mais_5", label: "Mais de 5 (Efeito Sanfona constante)" },
                        ]}
                        value={data.dietsTried}
                        onChange={(v) => setData((c) => ({ ...c, dietsTried: v as DietHistory }))}
                        columns="double"
                      />
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 8 && (
                <StepShell
                  key="step-8"
                  eyebrow="Autoimagem e Sustentação"
                  title="Como está seu nível atual de motivação?"
                  description="Compreender o fator psicológico dita o nível de flexibilidade que colocaremos nas refeições livres."
                >
                  <div className="space-y-5 w-full">
                    <div>
                      <p className="mb-2 text-xs font-bold text-stone-400 uppercase tracking-wide">Como se sente ao olhar no espelho hoje?</p>
                      <PremiumOptionGrid
                        options={[
                          { value: "confiante", label: "Relativamente bem", subtitle: "Busco ajustes finos de performance" },
                          { value: "incomodada", label: "Desconfortável", subtitle: "Sei que meu corpo atual não reflete quem eu sou" },
                          { value: "frustrada", label: "Frustrada / Desmotivada", subtitle: "Sinto cansaço por tentar sem obter respostas estáveis" },
                        ]}
                        value={data.mirrorFeeling}
                        onChange={(v) => setData((c) => ({ ...c, mirrorFeeling: v as MirrorFeeling }))}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-bold text-stone-400 uppercase tracking-wide">Qual sua dificuldade em manter constância?</p>
                      <PremiumOptionGrid
                        options={[
                          { value: "baixa", label: "Baixa", subtitle: "Sigo bem se tiver um roteiro claro" },
                          { value: "media", label: "Média", subtitle: "Oscilo bastante entre o foco e a procrastinação" },
                          { value: "alta", label: "Elevada", subtitle: "Desisto com extrema facilidade nas primeiras semanas" },
                        ]}
                        value={data.consistencyDifficulty}
                        onChange={(v) => setData((c) => ({ ...c, consistencyDifficulty: v as ConsistencyDifficulty }))}
                      />
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 9 && (
                <StepShell
                  key="step-9"
                  eyebrow="Refinamento Algorítmico"
                  title="Últimas variáveis para fechar sua análise."
                  description="Defina os gatilhos finais para criarmos o menu de receitas personalizadas do PDF."
                >
                  <div className="space-y-4 w-full">
                    <div>
                      <p className="mb-2 text-xs font-bold text-stone-400 uppercase tracking-wide">Qual seu horário de pico de fome?</p>
                      <PremiumOptionGrid
                        options={[
                          { value: "manha", label: "Período da Manhã" },
                          { value: "tarde", label: "Período da Tarde" },
                          { value: "noite", label: "Período da Noite" },
                          { value: "madrugada", label: "Madrugada" },
                        ]}
                        value={data.hungerTime}
                        onChange={(v) => setData((c) => ({ ...c, hungerTime: v as HungerWindow }))}
                        columns="double"
                      />
                    </div>

                    <Input
                      value={data.restrictions}
                      onChange={(e) => setData((c) => ({ ...c, restrictions: e.target.value }))}
                      placeholder="Alergias ou alimentos que você detesta (ex: lactose, coentro)"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50/50 px-4 text-sm focus:border-stone-950 focus:bg-white transition-all font-medium"
                    />

                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {[true, false].map((opt) => {
                        const sel = data.wantsWorkout === opt;
                        return (
                          <button
                            key={String(opt)}
                            type="button"
                            onClick={() => setData((c) => ({ ...c, wantsWorkout: opt }))}
                            className={`rounded-2xl border p-4 text-left transition-all ${
                              sel ? "border-stone-950 bg-stone-950 text-white" : "border-stone-200 bg-stone-50 text-stone-900"
                            }`}
                          >
                            <p className="text-sm font-bold">{opt ? "🔥 Incluir Protocolo de Treinos" : "🥗 Apenas Plano Alimentar"}</p>
                            <p className={`mt-0.5 text-xs ${sel ? "text-stone-300" : "text-stone-400"}`}>
                              {opt ? "Acelerar perda com rotinas caseiras curtas" : "Foco 100% focado na reestruturação do menu"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </StepShell>
              )}
            </AnimatePresence>
          </div>

          {/* Navegação Flutuante/Tátil */}
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-stone-100 pt-5">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="h-12 flex-1 rounded-2xl border-stone-200 bg-white font-bold text-stone-600 hover:bg-stone-50 transition-all disabled:opacity-30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="h-12 flex-1 rounded-2xl bg-stone-950 font-bold text-white hover:bg-stone-900 transition-all active:scale-[0.99] disabled:opacity-30"
            >
              {step === TOTAL_STEPS ? "Analisar Meu Perfil" : "Avançar"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

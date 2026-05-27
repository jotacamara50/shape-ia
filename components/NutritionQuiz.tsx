"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";
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
  MirrorFeeling,
  QuizData,
  RoutineImpact,
} from "@/types";

const TOTAL_STEPS = 9;

const progressMessages = [
  { threshold: 12, label: "Organizando suas respostas" },
  { threshold: 31, label: "Identificando seus padrões" },
  { threshold: 56, label: "Mapeando seus hábitos" },
  { threshold: 78, label: "Preparando sua análise" },
  { threshold: 92, label: "Personalizando recomendações" },
];

const goalOptions: { value: Goal; label: string; subtitle: string }[] = [
  { value: "emagrecer", label: "Emagrecer", subtitle: "Reduzir peso com estratégia e constância" },
  { value: "reeducacao", label: "Reorganizar minha alimentação", subtitle: "Criar rotina e previsibilidade" },
  { value: "manter", label: "Manter e controlar", subtitle: "Estabilidade com menos oscilação" },
  { value: "massa", label: "Ganhar massa", subtitle: "Mais energia, força e estrutura" },
];

const bodyConcernOptions: { value: BodyConcern; label: string; subtitle: string }[] = [
  { value: "abdomen", label: "Abdômen", subtitle: "Inchaço, volume e definição" },
  { value: "pernas", label: "Pernas", subtitle: "Retenção e sensação de peso" },
  { value: "bracos", label: "Braços", subtitle: "Flacidez e contorno" },
  { value: "rosto", label: "Rosto", subtitle: "Inchaço e retenção aparente" },
  { value: "corpo_todo", label: "Corpo todo", subtitle: "Sensação geral de desequilíbrio" },
];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
];

const activityOptions: { value: ActivityLevel; label: string; desc: string }[] = [
  { value: "sedentario", label: "Baixo", desc: "Quase sem treino ou movimento estruturado" },
  { value: "leve", label: "Leve", desc: "1 a 2 sessões por semana" },
  { value: "moderado", label: "Moderado", desc: "3 a 4 sessões por semana" },
  { value: "intenso", label: "Alto", desc: "Treino frequente e rotina ativa" },
  { value: "atleta", label: "Muito alto", desc: "Treinos diários e alta demanda física" },
];

const challengeOptions: { value: BiggestChallenge; label: string; subtitle: string }[] = [
  { value: "ansiedade", label: "Ansiedade", subtitle: "Como por impulso em dias intensos" },
  { value: "beliscos", label: "Beliscos", subtitle: "Saio do plano várias vezes ao dia" },
  { value: "falta_rotina", label: "Falta de rotina", subtitle: "Minha semana muda demais" },
  { value: "falta_tempo", label: "Falta de tempo", subtitle: "Improviso quase todas as refeições" },
  { value: "compulsao_noturna", label: "Exagero à noite", subtitle: "Perco o controle no fim do dia" },
];

const emotionalHungerOptions: { value: EmotionalHunger; label: string; subtitle: string }[] = [
  { value: "nunca", label: "Quase nunca", subtitle: "Fome mais física do que emocional" },
  { value: "as_vezes", label: "Às vezes", subtitle: "Acontece em alguns momentos" },
  { value: "frequente", label: "Com frequência", subtitle: "Afeta bastante minhas decisões" },
];

const dietOptions: { value: DietHistory; label: string }[] = [
  { value: "nenhuma", label: "Nenhuma" },
  { value: "1_2", label: "1 a 2 dietas" },
  { value: "3_5", label: "3 a 5 dietas" },
  { value: "mais_5", label: "Mais de 5" },
];

const mirrorOptions: { value: MirrorFeeling; label: string; subtitle: string }[] = [
  { value: "confiante", label: "Relativamente bem", subtitle: "Quero mais controle do que mudança drástica" },
  { value: "incomodada", label: "Incomodada", subtitle: "Tem algo me travando visualmente" },
  { value: "frustrada", label: "Frustrada", subtitle: "Sinto que já tentei demais" },
  { value: "desmotivada", label: "Desmotivada", subtitle: "Minha autoestima foi bastante afetada" },
];

const consistencyOptions: { value: ConsistencyDifficulty; label: string; subtitle: string }[] = [
  { value: "baixa", label: "Baixa", subtitle: "Costumo seguir quando o plano é claro" },
  { value: "media", label: "Média", subtitle: "Começo bem, mas oscilo" },
  { value: "alta", label: "Alta", subtitle: "Tenho dificuldade real de sustentar" },
];

const hungerOptions: { value: HungerWindow; label: string }[] = [
  { value: "manha", label: "Manhã" },
  { value: "tarde", label: "Tarde" },
  { value: "noite", label: "Noite" },
  { value: "madrugada", label: "Madrugada" },
];

const routineOptions: { value: RoutineImpact; label: string; subtitle: string }[] = [
  { value: "baixo", label: "Baixo", subtitle: "Minha rotina ajuda a manter padrão" },
  { value: "medio", label: "Médio", subtitle: "Alguns dias saem do controle" },
  { value: "alto", label: "Alto", subtitle: "Minha rotina atrapalha bastante" },
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.28 }}
      className="rounded-[1.75rem] border border-stone-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-stone-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold leading-[1.25] tracking-[-0.025em] text-stone-900 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-stone-400">
        {description}
      </p>
      <div className="mt-7">{children}</div>
    </motion.div>
  );
}

function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  columns = "single",
}: {
  options: { value: T; label: string; subtitle?: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: "single" | "double";
}) {
  return (
    <div className={`grid gap-2.5 ${columns === "double" ? "sm:grid-cols-2" : ""}`}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
              selected
                ? "border-green-700 bg-green-700 text-white shadow-sm"
                : "border-stone-100 bg-stone-50 text-stone-900 hover:border-stone-200 hover:bg-white"
            }`}
          >
            <p className="text-base font-semibold">{option.label}</p>
            {option.subtitle ? (
              <p className={`mt-1 text-sm leading-5 ${selected ? "text-green-100" : "text-stone-400"}`}>
                {option.subtitle}
              </p>
            ) : null}
          </button>
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
    if (step === 4) return data.age > 0 && data.weight > 0 && data.height > 0 && Boolean(data.gender);
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
      return;
    }
    onComplete(data);
  };

  const handleBack = () => {
    if (step > 1) setStep((current) => current - 1);
  };

  const approxImc =
    data.weight > 0 && data.height > 0
      ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-5 sm:px-6">

        {/* Header */}
        <div className="mb-6 rounded-[1.5rem] border border-stone-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sage-600">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-900">Shape AI</p>
                <p className="text-xs text-stone-400">
                  Passo {step} de {TOTAL_STEPS}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full border border-stone-100 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-500 sm:flex">
              {progressLabel}
            </div>
          </div>

          <div className="mt-4">
            <div className="h-1.5 overflow-hidden rounded-full bg-stone-100">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full bg-green-600"
              />
            </div>
            <p className="mt-2.5 text-xs text-stone-400 sm:hidden">{progressLabel}</p>
          </div>
        </div>

        {/* Step content */}
        <div className="flex flex-1 items-start">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepShell
                  key="step-1"
                  eyebrow="Identificação"
                  title="Antes de tudo, como podemos te chamar?"
                  description="Seu nome será usado para personalizar a análise e deixar o resultado mais próximo da sua realidade."
                >
                  <div className="space-y-4">
                    <Input
                      value={data.name}
                      onChange={(event) =>
                        setData((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Ex: Mariana"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50 px-5 text-lg focus:border-stone-400 focus:bg-white"
                    />
                    <div className="rounded-2xl border border-stone-100 bg-stone-50 p-4 text-sm leading-6 text-stone-500">
                      Com base nas suas respostas, identificamos padrões e criamos orientações que respeitam a sua rotina.
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  key="step-2"
                  eyebrow="Objetivo principal"
                  title={`${data.name || "Você"}, o que mais quer trabalhar agora?`}
                  description="Isso define a direção das suas recomendações alimentares e como priorizamos cada sugestão."
                >
                  <OptionGrid
                    options={goalOptions}
                    value={data.goal}
                    onChange={(value) => setData((current) => ({ ...current, goal: value }))}
                  />
                </StepShell>
              )}

              {step === 3 && (
                <StepShell
                  key="step-3"
                  eyebrow="Autoestima"
                  title="Qual parte do seu corpo mais afeta como você se sente hoje?"
                  description="Isso nos ajuda a entender o que mais importa para você neste momento e personalizar o foco do plano."
                >
                  <OptionGrid
                    options={bodyConcernOptions}
                    value={data.bodyConcern}
                    onChange={(value) => setData((current) => ({ ...current, bodyConcern: value }))}
                    columns="double"
                  />
                </StepShell>
              )}

              {step === 4 && (
                <StepShell
                  key="step-4"
                  eyebrow="Ponto de partida"
                  title="Queremos entender seu ponto de partida."
                  description="Idade, peso, altura e gênero nos ajudam a calibrar as recomendações para o seu perfil."
                >
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                      type="number"
                      min={1}
                      value={data.age || ""}
                      onChange={(event) =>
                        setData((current) => ({ ...current, age: Number(event.target.value || 0) }))
                      }
                      placeholder="Idade"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50 px-4 text-lg focus:border-stone-400 focus:bg-white"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={data.weight || ""}
                      onChange={(event) =>
                        setData((current) => ({ ...current, weight: Number(event.target.value || 0) }))
                      }
                      placeholder="Peso (kg)"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50 px-4 text-lg focus:border-stone-400 focus:bg-white"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={data.height || ""}
                      onChange={(event) =>
                        setData((current) => ({ ...current, height: Number(event.target.value || 0) }))
                      }
                      placeholder="Altura (cm)"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50 px-4 text-lg focus:border-stone-400 focus:bg-white"
                    />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {genderOptions.map((option) => {
                      const selected = data.gender === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setData((current) => ({ ...current, gender: option.value }))}
                          className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                            selected
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-stone-100 bg-stone-50 text-stone-900 hover:border-stone-200 hover:bg-white"
                          }`}
                        >
                          <p className="font-semibold">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>

                  {approxImc ? (
                    <div className="mt-5 rounded-2xl border border-sage-100 bg-sage-50 p-4">
                      <p className="text-xs text-stone-400">Leitura inicial estimada</p>
                      <p className="mt-1 text-xl font-semibold tracking-[-0.03em] text-stone-900">
                        IMC aproximado {approxImc}
                      </p>
                    </div>
                  ) : null}
                </StepShell>
              )}

              {step === 5 && (
                <StepShell
                  key="step-5"
                  eyebrow="Rotina física"
                  title="Como está seu nível de atividade hoje?"
                  description="Isso influencia as estimativas de energia e como ajustamos as sugestões alimentares para o seu dia."
                >
                  <OptionGrid
                    options={activityOptions}
                    value={data.activityLevel}
                    onChange={(value) =>
                      setData((current) => ({ ...current, activityLevel: value }))
                    }
                  />
                </StepShell>
              )}

              {step === 6 && (
                <StepShell
                  key="step-6"
                  eyebrow="Desafio central"
                  title="O que mais dificulta manter uma alimentação consistente?"
                  description="Entender isso nos permite sugerir estratégias mais realistas e adaptadas ao seu contexto."
                >
                  <OptionGrid
                    options={challengeOptions}
                    value={data.biggestChallenge}
                    onChange={(value) =>
                      setData((current) => ({ ...current, biggestChallenge: value }))
                    }
                  />
                </StepShell>
              )}

              {step === 7 && (
                <StepShell
                  key="step-7"
                  eyebrow="Histórico alimentar"
                  title="Sua relação com a comida já mostra algum padrão repetido?"
                  description="Isso nos ajuda a evitar sugestões que já não funcionaram para você antes e criar algo mais aderente."
                >
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-medium text-stone-500">Você sente fome emocional?</p>
                      <OptionGrid
                        options={emotionalHungerOptions}
                        value={data.emotionalHunger}
                        onChange={(value) =>
                          setData((current) => ({ ...current, emotionalHunger: value }))
                        }
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-medium text-stone-500">Quantas dietas você já tentou?</p>
                      <OptionGrid
                        options={dietOptions}
                        value={data.dietsTried}
                        onChange={(value) => setData((current) => ({ ...current, dietsTried: value }))}
                        columns="double"
                      />
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 8 && (
                <StepShell
                  key="step-8"
                  eyebrow="Aderência"
                  title="Como você se sente e quão difícil é manter constância?"
                  description="Não basta saber o que comer. Precisamos entender sua carga emocional e o que é realista para você."
                >
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-medium text-stone-500">Como se sente ao se olhar no espelho?</p>
                      <OptionGrid
                        options={mirrorOptions}
                        value={data.mirrorFeeling}
                        onChange={(value) =>
                          setData((current) => ({ ...current, mirrorFeeling: value }))
                        }
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-medium text-stone-500">Você sente dificuldade em manter constância?</p>
                      <OptionGrid
                        options={consistencyOptions}
                        value={data.consistencyDifficulty}
                        onChange={(value) =>
                          setData((current) => ({
                            ...current,
                            consistencyDifficulty: value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 9 && (
                <StepShell
                  key="step-9"
                  eyebrow="Últimos detalhes"
                  title="Mais alguns pontos para refinar sua análise."
                  description="Com isso fechamos horários críticos, impacto da rotina, restrições e preferências de treino."
                >
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-medium text-stone-500">Em qual horário sente mais fome?</p>
                      <OptionGrid
                        options={hungerOptions}
                        value={data.hungerTime}
                        onChange={(value) =>
                          setData((current) => ({ ...current, hungerTime: value }))
                        }
                        columns="double"
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-medium text-stone-500">Quanto sua rotina atrapalha sua alimentação?</p>
                      <OptionGrid
                        options={routineOptions}
                        value={data.routineImpact}
                        onChange={(value) =>
                          setData((current) => ({ ...current, routineImpact: value }))
                        }
                      />
                    </div>

                    <Input
                      value={data.restrictions}
                      onChange={(event) =>
                        setData((current) => ({ ...current, restrictions: event.target.value }))
                      }
                      placeholder="Alimentos ou restrições que devemos considerar (opcional)"
                      className="h-14 rounded-2xl border-stone-200 bg-stone-50 px-4 text-base focus:border-stone-400 focus:bg-white"
                    />

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[true, false].map((option) => {
                        const selected = data.wantsWorkout === option;
                        return (
                          <button
                            key={String(option)}
                            type="button"
                            onClick={() =>
                              setData((current) => ({ ...current, wantsWorkout: option }))
                            }
                            className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                              selected
                                ? "border-green-700 bg-green-700 text-white"
                                : "border-stone-100 bg-stone-50 text-stone-900 hover:border-stone-200 hover:bg-white"
                            }`}
                          >
                            <p className="font-semibold">
                              {option ? "Quero incluir treino" : "Quero só o plano alimentar"}
                            </p>
                            <p className={`mt-1 text-sm ${selected ? "text-green-100" : "text-stone-400"}`}>
                              {option
                                ? "Adicionar uma rotina básica para reforçar os resultados"
                                : "Foco total em alimentação e organização"}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </StepShell>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="h-12 flex-1 rounded-2xl border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-40"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-12 flex-1 rounded-2xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40"
              >
                {step === TOTAL_STEPS ? "Gerar minha análise" : "Continuar"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

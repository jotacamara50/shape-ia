"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  { threshold: 12, label: "Analisando perfil corporal" },
  { threshold: 31, label: "Calculando metabolismo" },
  { threshold: 56, label: "Identificando padrões alimentares" },
  { threshold: 78, label: "IA detectando bloqueios" },
  { threshold: 92, label: "Gerando estratégia personalizada" },
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
  { value: "as_vezes", label: "Às vezes", subtitle: "Acontece em alguns gatilhos" },
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.28 }}
      className="rounded-[2rem] border border-white/80 bg-white/82 p-5 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
        {description}
      </p>
      <div className="mt-8">{children}</div>
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
    <div className={`grid gap-3 ${columns === "double" ? "sm:grid-cols-2" : ""}`}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
              selected
                ? "border-slate-950 bg-slate-950 text-white shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
                : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <p className="text-base font-semibold">{option.label}</p>
            {option.subtitle ? (
              <p className={`mt-1 text-sm leading-6 ${selected ? "text-slate-300" : "text-slate-500"}`}>
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
    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  const approxImc =
    data.weight > 0 && data.height > 0 ? (data.weight / Math.pow(data.height / 100, 2)).toFixed(1) : null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_24%),linear-gradient(180deg,_#f6f8fc_0%,_#ffffff_45%,_#f8fbff_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-5 sm:px-6">
        <div className="mb-6 rounded-[2rem] border border-white/80 bg-white/82 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Shape AI
                </p>
                <p className="text-sm text-slate-500">
                  Passo {step} de {TOTAL_STEPS}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 sm:flex">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              {progressLabel}
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progress} className="h-2.5 rounded-full bg-slate-100" />
            <p className="mt-3 text-sm text-slate-500 sm:hidden">{progressLabel}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <StepShell
                  eyebrow="Identificação"
                  title="Antes de tudo, como podemos te chamar?"
                  description="Seu nome será usado para personalizar a leitura inicial e montar um relatório com sensação real de acompanhamento."
                >
                  <div className="space-y-4">
                    <Input
                      value={data.name}
                      onChange={(event) =>
                        setData((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Ex: Mariana"
                      className="h-14 rounded-2xl border-slate-200 px-5 text-lg"
                    />
                    <div className="rounded-[1.5rem] border border-sky-100 bg-sky-50/80 p-4 text-sm leading-6 text-slate-600">
                      A análise cruza sinais físicos, comportamentais e de rotina. Não é um quiz genérico nem uma dieta pronta.
                    </div>
                  </div>
                </StepShell>
              )}

              {step === 2 && (
                <StepShell
                  eyebrow="Objetivo principal"
                  title={`${data.name || "Você"}, o que mais quer destravar agora?`}
                  description="Isso define a direção da estratégia alimentar e como a IA ajusta calorias, aderência e sensação de progresso."
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
                  eyebrow="Autoestima"
                  title="Qual parte do seu corpo mais afeta sua autoestima hoje?"
                  description="Esse sinal ajuda a IA a interpretar urgência emocional, percepção corporal e expectativa de resultado."
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
                  eyebrow="Perfil corporal"
                  title="Vamos medir a base metabólica da sua análise."
                  description="Idade, peso, altura e gênero ajudam a estimar gasto basal, intensidade de ajuste e velocidade provável de resposta."
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
                      className="h-14 rounded-2xl border-slate-200 px-4 text-lg"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={data.weight || ""}
                      onChange={(event) =>
                        setData((current) => ({ ...current, weight: Number(event.target.value || 0) }))
                      }
                      placeholder="Peso (kg)"
                      className="h-14 rounded-2xl border-slate-200 px-4 text-lg"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={data.height || ""}
                      onChange={(event) =>
                        setData((current) => ({ ...current, height: Number(event.target.value || 0) }))
                      }
                      placeholder="Altura (cm)"
                      className="h-14 rounded-2xl border-slate-200 px-4 text-lg"
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
                          className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                            selected
                              ? "border-slate-950 bg-slate-950 text-white"
                              : "border-slate-200 bg-white text-slate-900 hover:border-slate-300"
                          }`}
                        >
                          <p className="font-semibold">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>

                  {approxImc ? (
                    <div className="mt-5 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-4">
                      <p className="text-sm text-slate-500">Leitura inicial estimada</p>
                      <p className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                        IMC aproximado {approxImc}
                      </p>
                    </div>
                  ) : null}
                </StepShell>
              )}

              {step === 5 && (
                <StepShell
                  eyebrow="Rotina física"
                  title="Como está seu nível de atividade hoje?"
                  description="Isso altera sua estimativa calórica, a margem de ajuste e a agressividade recomendada para o protocolo."
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
                  eyebrow="Bloqueio central"
                  title="O que mais dificulta seu emagrecimento?"
                  description="A IA usa esse ponto como bloco principal de fricção para ajustar saciedade, previsibilidade e simplificação do plano."
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
                  eyebrow="Histórico alimentar"
                  title="Sua relação com a comida já mostra algum padrão repetido?"
                  description="Aqui medimos fome emocional e desgaste por tentativas anteriores para evitar mais um plano que parece bom, mas não encaixa."
                >
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-medium text-slate-500">Você sente fome emocional?</p>
                      <OptionGrid
                        options={emotionalHungerOptions}
                        value={data.emotionalHunger}
                        onChange={(value) =>
                          setData((current) => ({ ...current, emotionalHunger: value }))
                        }
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-medium text-slate-500">Quantas dietas você já tentou?</p>
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
                  eyebrow="Aderência"
                  title="Como você se sente e quão difícil é manter constância?"
                  description="Não basta saber o que comer. Precisamos entender sua carga emocional e sua capacidade real de sustentar uma estratégia."
                >
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-medium text-slate-500">Como se sente ao se olhar no espelho?</p>
                      <OptionGrid
                        options={mirrorOptions}
                        value={data.mirrorFeeling}
                        onChange={(value) =>
                          setData((current) => ({ ...current, mirrorFeeling: value }))
                        }
                      />
                    </div>

                    <div>
                      <p className="mb-3 text-sm font-medium text-slate-500">Você sente dificuldade em manter constância?</p>
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
                  eyebrow="Ajuste final"
                  title="Últimos sinais para a IA calibrar seu plano."
                  description="Com isso fechamos horários críticos, atrito da rotina, restrições e se faz sentido incluir uma rotina básica de treino."
                >
                  <div className="space-y-6">
                    <div>
                      <p className="mb-3 text-sm font-medium text-slate-500">Em qual horário sente mais fome?</p>
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
                      <p className="mb-3 text-sm font-medium text-slate-500">Quanto sua rotina atrapalha sua alimentação?</p>
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
                      placeholder="Restrições ou alimentos que devemos evitar"
                      className="h-14 rounded-2xl border-slate-200 px-4 text-base"
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
                            className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                              selected
                                ? "border-slate-950 bg-slate-950 text-white"
                                : "border-slate-200 bg-white text-slate-900"
                            }`}
                          >
                            <p className="font-semibold">
                              {option ? "Quero incluir treino" : "Quero só o plano alimentar"}
                            </p>
                            <p className={`mt-1 text-sm ${selected ? "text-slate-300" : "text-slate-500"}`}>
                              {option
                                ? "Adicionar uma rotina básica para reforçar aderência"
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

            <div className="mt-6 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
                className="h-12 flex-1 rounded-2xl border-slate-200 bg-white/80 text-slate-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="h-12 flex-1 rounded-2xl bg-slate-950 text-white hover:bg-slate-800"
              >
                {step === TOTAL_STEPS ? "Gerar análise" : "Continuar"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

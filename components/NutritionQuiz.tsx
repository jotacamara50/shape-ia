"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ActivityLevel, Gender, Goal, QuizData } from "@/types";

const TOTAL_STEPS = 4;

const goalOptions: { value: Goal; label: string; subtitle: string }[] = [
  { value: "emagrecer", label: "Emagrecer", subtitle: "Perder peso com saúde" },
  { value: "massa", label: "Ganhar massa", subtitle: "Hipertrofia e energia" },
  { value: "manter", label: "Manter peso", subtitle: "Estabilidade e controle" },
  {
    value: "reeducacao",
    label: "Reeducação alimentar",
    subtitle: "Criar hábitos melhores",
  },
];

const genderOptions: { value: Gender; label: string }[] = [
  { value: "feminino", label: "Feminino" },
  { value: "masculino", label: "Masculino" },
];

const activityOptions: { value: ActivityLevel; label: string; desc: string }[] = [
  {
    value: "sedentario",
    label: "Sedentário",
    desc: "Pouca ou nenhuma atividade",
  },
  {
    value: "leve",
    label: "Leve",
    desc: "1-2 treinos por semana",
  },
  {
    value: "moderado",
    label: "Moderado",
    desc: "3-4 treinos por semana",
  },
  {
    value: "intenso",
    label: "Intenso",
    desc: "5-6 treinos por semana",
  },
  {
    value: "atleta",
    label: "Atleta",
    desc: "Treinos diários e alta carga",
  },
];

interface NutritionQuizProps {
  onComplete: (data: QuizData) => void;
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
  });

  const progress = (step / TOTAL_STEPS) * 100;

  const imc = useMemo(() => {
    if (!data.height || !data.weight) return null;
    const h = data.height / 100;
    return data.weight / (h * h);
  }, [data.height, data.weight]);

  const imcLabel = useMemo(() => {
    if (!imc) return null;
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade I";
    if (imc < 40) return "Obesidade II";
    return "Obesidade III";
  }, [imc]);

  const canProceed = () => {
    if (step === 1) return !!data.goal;
    if (step === 2) {
      return (
        data.age > 0 &&
        data.weight > 0 &&
        data.height > 0 &&
        !!data.gender
      );
    }
    if (step === 3) return !!data.activityLevel;
    if (step === 4) return data.name.trim().length > 0;
    return false;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
      return;
    }
    onComplete(data);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <div className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-visible">
              <Image
                src="/logo2.png"
                alt="Shape IA"
                width={36}
                height={36}
                className="h-9 w-9 object-contain scale-[1.6] origin-left"
                priority
              />
              <div>
                <p className="text-sm text-gray-500">
                  Passo {step} de {TOTAL_STEPS}
                </p>
              </div>
            </div>
            <div className="w-40">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Qual é seu principal objetivo agora?
                </h2>
                <p className="text-gray-600 mb-6">
                  Vamos personalizar seu plano de acordo com sua meta.
                </p>

                <div className="grid gap-3">
                  {goalOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setData((prev) => ({ ...prev, goal: opt.value }))}
                      className={`w-full text-left border rounded-xl p-4 transition ${
                        data.goal === opt.value
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">{opt.label}</div>
                      <div className="text-sm text-gray-500">{opt.subtitle}</div>
                    </button>
                  ))}
                </div>

              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Dados físicos
                </h2>
                <p className="text-gray-600 mb-6">
                  Idade, peso, altura e gênero para calcular seu plano.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      min={1}
                      value={data.age || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          age: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min={1}
                      value={data.weight || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          weight: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      min={1}
                      value={data.height || ""}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          height: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="text-sm text-gray-600">Gênero</Label>
                  <div className="mt-2 grid grid-cols-2 gap-3">
                    {genderOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setData((prev) => ({ ...prev, gender: opt.value }))
                        }
                        className={`rounded-xl border px-4 py-3 font-medium transition ${
                          data.gender === opt.value
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {imc && (
                  <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">
                    <div className="text-sm text-green-700">Seu IMC aproximado</div>
                    <div className="text-2xl font-bold text-green-800">
                      {imc.toFixed(1)}
                    </div>
                    <div className="text-sm text-green-700">{imcLabel}</div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Nível de atividade
                </h2>
                <p className="text-gray-600 mb-2">
                  Isso impacta diretamente nas calorias recomendadas.
                </p>
                <p className="text-sm text-green-700 mb-6">
                  Já estamos montando seu plano...
                </p>

                <RadioGroup
                  value={data.activityLevel}
                  onValueChange={(value) =>
                    setData((prev) => ({
                      ...prev,
                      activityLevel: value as ActivityLevel,
                    }))
                  }
                  className="space-y-3"
                >
                  {activityOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${
                        data.activityLevel === opt.value
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <div>
                        <div className="font-semibold text-gray-900">{opt.label}</div>
                        <div className="text-sm text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="bg-white rounded-2xl shadow-xl p-6 sm:p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Últimas informações
                </h2>
                <p className="text-gray-600 mb-4">
                  Seu plano está quase pronto. Falta só personalizar com seu
                  nome.
                </p>

                <div className="space-y-5">
                  <div>
                    <Label htmlFor="name">Seu nome</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) =>
                        setData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Ex: Maria"
                    />
                  </div>

                  <div>
                    <Label htmlFor="restrictions">
                      Tem algo que devemos evitar? (opcional)
                    </Label>
                    <Input
                      id="restrictions"
                      value={data.restrictions}
                      onChange={(e) =>
                        setData((prev) => ({
                          ...prev,
                          restrictions: e.target.value,
                        }))
                      }
                      placeholder="Ex: lactose, glúten, carne vermelha"
                    />
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900 mb-3">
                      Deseja incluir treino?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className={`rounded-lg border px-3 py-2 font-medium transition ${
                          data.wantsWorkout
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() =>
                          setData((prev) => ({ ...prev, wantsWorkout: true }))
                        }
                      >
                        Sim
                      </button>
                      <button
                        type="button"
                        className={`rounded-lg border px-3 py-2 font-medium transition ${
                          !data.wantsWorkout
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                        onClick={() =>
                          setData((prev) => ({ ...prev, wantsWorkout: false }))
                        }
                      >
                        Não
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {step === TOTAL_STEPS ? "Finalizar" : "Continuar"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { QuizData, Goal, Gender, ActivityLevel } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NutritionQuizProps {
  onComplete: (data: QuizData) => void;
}

const TOTAL_STEPS = 4;

export function NutritionQuiz({ onComplete }: NutritionQuizProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuizData>>({
    wantsWorkout: true, // Default true para maximizar valor
    name: "", // Será preenchido automaticamente no final
  });

  const progress = (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      onComplete(formData as QuizData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.goal && !!formData.gender;
      case 2: return !!formData.age && !!formData.weight && !!formData.height;
      case 3: return !!formData.activityLevel;
      case 4: return !!formData.name;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* Header com Progress Bar */}
      <div className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-green-600">Shape IA</h1>
            <span className="text-sm text-gray-500">
              Passo {step} de {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Conteúdo do Quiz */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
            >
              {/* Passo 1: Objetivo + Gênero */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Qual é o seu objetivo? 🎯
                    </h2>
                    <p className="text-gray-600">
                      Vamos criar seu plano personalizado
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Seu objetivo principal:</Label>
                    <RadioGroup
                      value={formData.goal}
                      onValueChange={(value: Goal) =>
                        setFormData({ ...formData, goal: value })
                      }
                    >
                      {[
                        { value: "emagrecer", label: "🔥 Emagrecer", desc: "Perder gordura de forma saudável" },
                        { value: "massa", label: "💪 Ganhar Massa", desc: "Aumentar músculos e força" },
                        { value: "saude", label: "🌱 Saúde Geral", desc: "Alimentação equilibrada" },
                      ].map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.goal === option.value
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-200"
                          }`}
                          onClick={() => setFormData({ ...formData, goal: option.value as Goal })}
                        >
                          <RadioGroupItem value={option.value} id={option.value} />
                          <div className="flex-1">
                            <Label htmlFor={option.value} className="text-lg font-semibold cursor-pointer">
                              {option.label}
                            </Label>
                            <p className="text-sm text-gray-500">{option.desc}</p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-base font-semibold">Gênero:</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value: Gender) =>
                        setFormData({ ...formData, gender: value })
                      }
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: "masculino", label: "👨 Masculino" },
                          { value: "feminino", label: "👩 Feminino" },
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center space-x-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.gender === option.value
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-200"
                            }`}
                            onClick={() => setFormData({ ...formData, gender: option.value as Gender })}
                          >
                            <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                            <Label htmlFor={`gender-${option.value}`} className="cursor-pointer font-semibold">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Passo 2: Dados Corporais (Idade, Peso, Altura) */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Seus dados corporais 📊
                    </h2>
                    <p className="text-gray-600">
                      Precisamos disso para calcular suas necessidades
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Idade</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Ex: 30"
                        value={formData.age || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, age: parseInt(e.target.value) })
                        }
                        className="text-lg py-6"
                        min="18"
                        max="100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="75"
                          value={formData.weight || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, weight: parseFloat(e.target.value) })
                          }
                          className="text-lg py-6"
                          step="0.1"
                          min="30"
                          max="300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="height">Altura (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="170"
                          value={formData.height || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, height: parseFloat(e.target.value) })
                          }
                          className="text-lg py-6"
                          min="100"
                          max="250"
                        />
                      </div>
                    </div>

                    {formData.weight && formData.height && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700">
                          💡 Seu IMC: <span className="font-bold text-green-700 text-lg">
                            {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Passo 3: Atividade Física */}
              {step === 3 && (
                        onChange={(e) =>
                          setFormData({ ...formData, height: parseFloat(e.target.value) })
                        }
                        className="text-lg py-6"
                        min="100"
                        max="250"
                      />
                    </div>
                  </div>

                  {formData.weight && formData.height && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">
                        IMC aproximado: <span className="font-bold text-green-700">
                          {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Passo 5: Nível de Atividade */}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Nível de atividade física
                    </h2>
                    <p className="text-gray-600">
                      Quão ativo você é no dia a dia?
                    </p>
                  </div>
                  <RadioGroup
                    value={formData.activityLevel}
                    onVa3: Atividade Física */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Qual seu nível de atividade? 🏃
                    </h2>
                    <p className="text-gray-600">
                      Isso ajuda a calcular suas calorias ideais
                    </p>
                  </div>
                  <RadioGroup
                    value={formData.activityLevel}
                    onValueChange={(value: ActivityLevel) =>
                      setFormData({ ...formData, activityLevel: value })
                    }
                  >
                    {[
                      { value: "sedentario", label: "😴 Sedentário", desc: "Pouco ou nenhum exercício" },
                      { value: "leve", label: "🚶 Leve", desc: "1-3 dias/semana" },
                      { value: "moderado", label: "🏃 Moderado", desc: "3-5 dias/semana" },
                      { value: "intenso", label: "💪 Intenso", desc: "6-7 dias/semana" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.activityLevel === option.value
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-200"
                        }`}
                        onClick={() => setFormData({ ...formData, activityLevel: option.value as ActivityLevel })}
                      >
                        <RadioGroupItem value={option.value} id={`activity-${option.value}`} />
                        <div className="flex-1">
                          <Label htmlFor={`activity-${option.value}`} className="font-semibold cursor-pointer text-base">
                            {option.label}
                          </Label>
                          <p className="text-sm text-gray-500">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* Passo 4: Nome + Restrições (finalização rápida) */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Quase lá! 🎉
                    </h2>
                    <p className="text-gray-600">
                      Últimos detalhes para personalizar seu plano
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Seu nome</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Ex: Maria"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="text-lg py-6"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="restrictions">Restrições alimentares (opcional)</Label>
                      <Input
                        id="restrictions"
                        type="text"
                        placeholder="Ex: Lactose, glúten..."
                        value={formData.restrictions || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, restrictions: e.target.value })
                        }
                        className="text-lg py-6"
                      />
                      <p className="text-xs text-gray-500">
                        💡 Deixe em branco se não tiver
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-5 rounded-xl border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎁</div>
                      <div>
                        <p className="font-bold text-gray-900 mb-1">BÔNUS INCLUÍDO:</p>
                        <p className="text-sm text-gray-700">
                          ✅ Sugestão de treinos personalizada<br/>
                          ✅ Lista de compras organizada<br/>
                          ✅ Receitas práticas e saudáveis
                        </p>
                      </div>
                    </div>
                  </div
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-8"
                  size="lg"
                >
                  {step === TOTAL_STEPS ? "Gerar Plano" : "Próximo"}
                  {step < TOTAL_STEPS && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} bg-gradient-to-r from-green-600 to-green-500"
                  size="lg"
                >
                  {step === TOTAL_STEPS ? "🎉 Ver Meu Plano" : "Continuar
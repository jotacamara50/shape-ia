"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { QuizData } from "@/types";
import { FileText, CheckCircle2, TrendingDown, Calendar } from "lucide-react";

interface PlanPreviewProps {
  userData: QuizData;
}

export function PlanPreview({ userData }: PlanPreviewProps) {
  const estimatedResult = () => {
    if (userData.goal === "emagrecer") {
      return { text: "-3kg a -5kg", period: "30 dias", icon: TrendingDown };
    } else if (userData.goal === "massa") {
      return { text: "+2kg a +4kg", period: "30 dias", icon: TrendingDown };
    }
    return { text: "Melhora significativa", period: "30 dias", icon: CheckCircle2 };
  };

  const result = estimatedResult();
  const Icon = result.icon;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Seu Plano Está Pronto! 🎉
        </h2>
        <p className="text-gray-600">
          Desbloqueie acesso completo ao seu plano alimentar personalizado
        </p>
      </motion.div>

      {/* Preview do PDF com Blur */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
          {/* Cabeçalho do PDF */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Plano Alimentar</h3>
                <p className="text-green-100">de {userData.name}</p>
              </div>
              <FileText className="w-12 h-12 opacity-80" />
            </div>
          </div>

          {/* Conteúdo Borrado */}
          <div className="relative p-6">
            <div className="absolute inset-0 backdrop-blur-xl bg-white/60 z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-green-600 text-white rounded-full p-4 inline-block mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-lg font-bold text-gray-900">
                  Conteúdo Bloqueado
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Complete o pagamento para desbloquear
                </p>
              </div>
            </div>

            <div className="space-y-4 blur-sm select-none">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Análise Corporal</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-xs text-gray-500">IMC</p>
                    <p className="text-lg font-bold">XX.X</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="text-xs text-gray-500">TMB</p>
                    <p className="text-lg font-bold">XXXX kcal</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Cardápio Semanal</h4>
                <div className="space-y-2">
                  {["Segunda", "Terça", "Quarta"].map((dia) => (
                    <div key={dia} className="bg-gray-100 p-3 rounded">
                      <p className="font-semibold">{dia}</p>
                      <p className="text-sm text-gray-600">Café • Almoço • Jantar • Lanches</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Lista de Compras</h4>
                <div className="bg-gray-100 p-3 rounded">
                  <p className="text-sm">• Item 1 • Item 2 • Item 3...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Card de Resultado Estimado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 text-white rounded-full p-3">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Resultado Estimado</p>
              <p className="text-2xl font-bold text-green-700">{result.text}</p>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                em {result.period}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Características Incluídas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-3"
      >
        <h3 className="font-semibold text-gray-900">Incluído no seu plano:</h3>
        {[
          "Cardápio semanal completo (café, almoço, jantar e lanches)",
          "Análise corporal detalhada (IMC, TMB, calorias)",
          "Lista de compras organizada",
          userData.wantsWorkout && "Rotina de treinos personalizada",
          "Adaptado às suas restrições alimentares",
          "Acesso imediato após pagamento",
        ]
          .filter(Boolean)
          .map((item, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
      </motion.div>
    </div>
  );
}

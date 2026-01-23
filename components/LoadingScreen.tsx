"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "Analisando seu IMC...",
  "Calculando Taxa Metabólica Basal...",
  "Selecionando os melhores alimentos...",
  "Montando cardápio personalizado...",
  "Calculando porções ideais...",
  "Preparando lista de compras...",
  "Gerando seu plano em PDF...",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < loadingMessages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 text-center"
        >
          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Loader2 className="w-16 h-16 text-green-600" />
          </motion.div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Criando seu plano personalizado
          </h2>

          {/* Mensagens dinâmicas */}
          <div className="h-20 flex items-center justify-center">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-600 font-semibold text-lg"
            >
              {loadingMessages[currentMessage]}
            </motion.p>
          </div>

          {/* Barra de progresso animada */}
          <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear" }}
            />
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Aguarde alguns instantes...
          </p>
        </motion.div>
      </div>
    </div>
  );
}

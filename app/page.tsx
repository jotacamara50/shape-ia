"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NutritionQuiz } from "@/components/NutritionQuiz";
import { LoadingScreen } from "@/components/LoadingScreen";
import { QuizData } from "@/types";

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const router = useRouter();

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    // Salvar dados no localStorage para usar na página de checkout
    if (quizData) {
      localStorage.setItem("shapeIA-quiz-data", JSON.stringify(quizData));
      router.push("/seu-plano");
    }
  };

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return <NutritionQuiz onComplete={handleQuizComplete} />;
}

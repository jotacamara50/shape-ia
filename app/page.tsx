"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/LoadingScreen";
import { NutritionQuiz } from "@/components/NutritionQuiz";
import { PremiumLanding } from "@/components/PremiumLanding";
import { QuizData } from "@/types";

export default function HomePage() {
  const [stage, setStage] = useState<"landing" | "quiz" | "loading">("landing");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const router = useRouter();

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setStage("loading");
  };

  const handleLoadingComplete = () => {
    if (quizData) {
      localStorage.setItem("shapeIA-quiz-data", JSON.stringify(quizData));
      router.push("/seu-plano");
    }
  };

  if (stage === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} userName={quizData?.name} />;
  }

  if (stage === "quiz") {
    return <NutritionQuiz onComplete={handleQuizComplete} />;
  }

  return <PremiumLanding onStart={() => setStage("quiz")} />;
}

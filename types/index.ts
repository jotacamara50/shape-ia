export type Goal = "emagrecer" | "massa" | "saude";
export type Gender = "masculino" | "feminino";
export type ActivityLevel = "sedentario" | "leve" | "moderado" | "intenso" | "atleta";

export interface QuizData {
  goal: Goal;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
  restrictions: string;
  wantsWorkout: boolean;
  name: string;
}

export interface MealPlan {
  cafe: string[];
  almoco: string[];
  jantar: string[];
  lanches: string[];
}

export interface WorkoutPlan {
  dias: string[];
  exercicios: { nome: string; series: string; obs: string }[];
}

export interface NutritionPlan {
  analise: {
    imc: number;
    classificacao: string;
    tmb: number;
    caloriasRecomendadas: number;
  };
  cardapioSemanal: {
    [key: string]: MealPlan;
  };
  listaCompras: {
    [categoria: string]: string[];
  };
  treino?: WorkoutPlan;
}

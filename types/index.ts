export type Goal = "emagrecer" | "massa" | "manter" | "reeducacao" | "saude";
export type Gender = "masculino" | "feminino";
export type ActivityLevel = "sedentario" | "leve" | "moderado" | "intenso" | "atleta";
export type BodyConcern = "abdomen" | "pernas" | "bracos" | "rosto" | "corpo_todo";
export type BiggestChallenge =
  | "ansiedade"
  | "beliscos"
  | "falta_rotina"
  | "falta_tempo"
  | "compulsao_noturna";
export type EmotionalHunger = "nunca" | "as_vezes" | "frequente";
export type DietHistory = "nenhuma" | "1_2" | "3_5" | "mais_5";
export type MirrorFeeling = "confiante" | "incomodada" | "frustrada" | "desmotivada";
export type ConsistencyDifficulty = "baixa" | "media" | "alta";
export type HungerWindow = "manha" | "tarde" | "noite" | "madrugada";
export type RoutineImpact = "baixo" | "medio" | "alto";

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
  bodyConcern: BodyConcern;
  biggestChallenge: BiggestChallenge;
  emotionalHunger: EmotionalHunger;
  dietsTried: DietHistory;
  mirrorFeeling: MirrorFeeling;
  consistencyDifficulty: ConsistencyDifficulty;
  hungerTime: HungerWindow;
  routineImpact: RoutineImpact;
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

export interface TimelineStep {
  fase: string;
  foco: string;
  expectativa: string;
}

export interface MacroSplit {
  proteinas: number;
  carboidratos: number;
  gorduras: number;
}

export interface FoodSwap {
  de: string;
  para: string;
  motivo: string;
}

export interface RecipeSuggestion {
  nome: string;
  objetivo: string;
  ingredientes: string[];
  preparo: string[];
}

export interface PlanAnalysis {
  imc: number;
  classificacao: string;
  tmb: number;
  caloriasRecomendadas: number;
  scoreCorporal: number;
  perfilMetabolico: string;
  nivelDificuldade: string;
  bloqueiosIdentificados: string[];
  tendenciaAlimentar: string;
  janelaCritica: string;
  estrategiaRecomendada: string;
  estimativaEvolucao: string;
  resumoInteligente: string;
  hidratacaoMeta: string;
  proteinaMeta: string;
  macros: MacroSplit;
  confiancaAnalise: number;
}

export interface NutritionPlan {
  analise: PlanAnalysis;
  cardapioSemanal: {
    [key: string]: MealPlan;
  };
  listaCompras: {
    [categoria: string]: string[];
  };
  cronograma: TimelineStep[];
  substituicoes: FoodSwap[];
  receitas: RecipeSuggestion[];
  checklist: string[];
  metas: string[];
  treino?: WorkoutPlan;
}

import {
  ActivityLevel,
  BiggestChallenge,
  BodyConcern,
  ConsistencyDifficulty,
  DietHistory,
  Goal,
  HungerWindow,
  NutritionPlan,
  PlanAnalysis,
  QuizData,
  RecipeSuggestion,
  RoutineImpact,
  TimelineStep,
} from "@/types";

const goalLabels: Record<Goal, string> = {
  emagrecer: "Emagrecimento personalizado",
  massa: "Ganho de massa com estrutura",
  manter: "Manutenção e estabilidade",
  reeducacao: "Reeducação alimentar",
  saude: "Saúde metabólica",
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentario: "Baixa atividade",
  leve: "Atividade leve",
  moderado: "Atividade moderada",
  intenso: "Alta atividade",
  atleta: "Perfil atleta",
};

const concernLabels: Record<BodyConcern, string> = {
  abdomen: "acúmulo na região abdominal",
  pernas: "retenção e volume em pernas",
  bracos: "flacidez e definição em braços",
  rosto: "inchaço e retenção no rosto",
  corpo_todo: "sensação de desequilíbrio no corpo inteiro",
};

const challengeLabels: Record<BiggestChallenge, string> = {
  ansiedade: "fome emocional ligada à ansiedade",
  beliscos: "beliscos fora de hora",
  falta_rotina: "falta de constância na rotina",
  falta_tempo: "rotina corrida e refeições improvisadas",
  compulsao_noturna: "compulsão ou excesso no período noturno",
};

const dietHistoryLabels: Record<DietHistory, string> = {
  nenhuma: "sem histórico de dietas restritivas",
  "1_2": "histórico leve de tentativas",
  "3_5": "histórico recorrente de dietas",
  mais_5: "muitas tentativas anteriores",
};

const routineImpactLabels: Record<RoutineImpact, string> = {
  baixo: "rotina relativamente estável",
  medio: "rotina moderadamente imprevisível",
  alto: "rotina altamente instável",
};

const hungerLabels: Record<HungerWindow, string> = {
  manha: "manhã",
  tarde: "tarde",
  noite: "noite",
  madrugada: "madrugada",
};

const consistencyLabels: Record<ConsistencyDifficulty, string> = {
  baixa: "boa capacidade de execução",
  media: "constância parcial",
  alta: "grande dificuldade de sustentação",
};

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  atleta: 1.9,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function getGoalLabel(goal: Goal) {
  return goalLabels[goal];
}

export function getActivityLabel(activityLevel: ActivityLevel) {
  return activityLabels[activityLevel];
}

export function getBodyConcernLabel(bodyConcern: BodyConcern) {
  return concernLabels[bodyConcern];
}

export function getChallengeLabel(challenge: BiggestChallenge) {
  return challengeLabels[challenge];
}

export function getDietHistoryLabel(dietsTried: DietHistory) {
  return dietHistoryLabels[dietsTried];
}

export function getRoutineImpactLabel(routineImpact: RoutineImpact) {
  return routineImpactLabels[routineImpact];
}

export function getHungerWindowLabel(hungerTime: HungerWindow) {
  return hungerLabels[hungerTime];
}

export function getConsistencyLabel(consistencyDifficulty: ConsistencyDifficulty) {
  return consistencyLabels[consistencyDifficulty];
}

export function calculateBMI(weight: number, height: number) {
  const heightInMeters = height / 100;
  return weight / Math.pow(heightInMeters, 2);
}

export function getBMIClassification(imc: number) {
  if (imc < 18.5) return "Abaixo do peso";
  if (imc < 25) return "Peso equilibrado";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidade grau I";
  if (imc < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

export function calculateTMB(userData: QuizData) {
  if (userData.gender === "masculino") {
    return (
      88.362 +
      13.397 * userData.weight +
      4.799 * userData.height -
      5.677 * userData.age
    );
  }

  return (
    447.593 +
    9.247 * userData.weight +
    3.098 * userData.height -
    4.33 * userData.age
  );
}

export function calculateRecommendedCalories(userData: QuizData, tmb: number) {
  const maintenance = tmb * activityMultipliers[userData.activityLevel];

  if (userData.goal === "emagrecer") return Math.round(maintenance * 0.84);
  if (userData.goal === "massa") return Math.round(maintenance * 1.12);
  if (userData.goal === "reeducacao") return Math.round(maintenance * 0.94);

  return Math.round(maintenance);
}

function buildBlockers(userData: QuizData) {
  const blockers = new Set<string>();

  blockers.add(challengeLabels[userData.biggestChallenge]);

  if (userData.emotionalHunger === "frequente") {
    blockers.add("resposta emocional forte à fome e ao estresse");
  }

  if (userData.hungerTime === "noite" || userData.hungerTime === "madrugada") {
    blockers.add("janela crítica de fome no fim do dia");
  }

  if (userData.dietsTried === "3_5" || userData.dietsTried === "mais_5") {
    blockers.add("histórico de efeito sanfona e adaptação metabólica");
  }

  if (userData.routineImpact === "alto") {
    blockers.add("baixa previsibilidade para seguir refeições fixas");
  }

  if (userData.consistencyDifficulty === "alta") {
    blockers.add("dificuldade alta de manter constância por várias semanas");
  }

  return Array.from(blockers);
}

function buildMetabolicProfile(userData: QuizData, blockers: string[]) {
  if (
    userData.dietsTried === "mais_5" ||
    (userData.goal === "emagrecer" && blockers.includes("histórico de efeito sanfona e adaptação metabólica"))
  ) {
    return "Metabolismo adaptativo com resposta defensiva a dietas anteriores";
  }

  if (
    userData.emotionalHunger === "frequente" &&
    (userData.hungerTime === "noite" || userData.hungerTime === "madrugada")
  ) {
    return "Perfil neuroalimentar com fome emocional concentrada no período noturno";
  }

  if (userData.routineImpact === "alto" || userData.biggestChallenge === "falta_tempo") {
    return "Perfil metabólico de rotina instável, com alta sensibilidade a improvisos";
  }

  if (userData.activityLevel === "moderado" || userData.activityLevel === "intenso") {
    return "Metabolismo responsivo com boa margem para ajustes estratégicos";
  }

  return "Metabolismo em fase de reorganização, com necessidade de consistência gradual";
}

function buildDifficulty(scoreCorporal: number) {
  if (scoreCorporal >= 78) return "Baixa a moderada";
  if (scoreCorporal >= 66) return "Moderada";
  return "Moderada a elevada";
}

function buildTendency(userData: QuizData) {
  if (userData.biggestChallenge === "compulsao_noturna") {
    return "Oscilação calórica concentrada à noite";
  }

  if (userData.biggestChallenge === "beliscos") {
    return "Picos de ingestão não planejada ao longo do dia";
  }

  if (userData.biggestChallenge === "falta_tempo") {
    return "Trocas improvisadas e baixa previsibilidade alimentar";
  }

  if (userData.emotionalHunger === "frequente") {
    return "Relação emocional com a alimentação em momentos de pressão";
  }

  return "Consumo relativamente ajustável com foco em estrutura";
}

function buildStrategy(userData: QuizData) {
  if (userData.goal === "emagrecer") {
    return "Aplicar déficit calórico progressivo com refeições de alta saciedade, previsibilidade e controle da janela de maior fome.";
  }

  if (userData.goal === "massa") {
    return "Elevar ingestão calórica com distribuição proteica consistente e refeições simples de repetir na rotina.";
  }

  if (userData.goal === "reeducacao") {
    return "Reestruturar comportamento alimentar com metas pequenas, repetíveis e sustentáveis antes de intensificar o plano.";
  }

  return "Estabilizar ingestão, rotina e qualidade alimentar para consolidar resultados sem rigidez excessiva.";
}

function buildEvolutionEstimate(userData: QuizData, scoreCorporal: number) {
  if (userData.goal === "emagrecer") {
    if (scoreCorporal >= 75) return "Primeiros sinais de desinchaço e controle de fome entre 10 e 14 dias.";
    if (scoreCorporal >= 65) return "Resposta gradual com melhora perceptível entre 2 e 4 semanas.";
    return "A evolução tende a depender mais de consistência do que de intensidade nas primeiras 4 semanas.";
  }

  if (userData.goal === "massa") {
    return "Aumento de energia e melhor recuperação tendem a aparecer nas primeiras 2 a 3 semanas.";
  }

  return "Os ganhos mais rápidos devem surgir em energia, previsibilidade e qualidade da alimentação nas primeiras semanas.";
}

function buildSummary(userData: QuizData, analysis: Omit<PlanAnalysis, "resumoInteligente">) {
  return `Seu perfil sugere ${analysis.perfilMetabolico.toLowerCase()}, com foco crítico em ${getHungerWindowLabel(
    userData.hungerTime
  )} e impacto principal de ${challengeLabels[userData.biggestChallenge]}.`;
}

export function buildTimeline(userData: QuizData): TimelineStep[] {
  const baseFocus =
    userData.goal === "emagrecer"
      ? "reduzir excesso sem perder aderência"
      : userData.goal === "massa"
        ? "aumentar ingestão com consistência"
        : "organizar rotina e previsibilidade";

  return [
    {
      fase: "Fase 1 · Ajuste inicial",
      foco: `Mapear fome, horários e repetir refeições simples para ${baseFocus}.`,
      expectativa: "Primeiros 7 dias de adaptação com menor atrito decisório.",
    },
    {
      fase: "Fase 2 · Consistência metabólica",
      foco: "Consolidar saciedade, distribuição calórica e resposta à janela crítica.",
      expectativa: "Semanas 2 e 3 com maior estabilidade e percepção de controle.",
    },
    {
      fase: "Fase 3 · Evolução personalizada",
      foco: "Refinar substituições, treino e ajustes finos conforme a rotina real.",
      expectativa: "A partir da semana 4 com plano mais sustentável e preciso.",
    },
  ];
}

export function buildAnalysis(userData: QuizData): PlanAnalysis {
  const imc = calculateBMI(userData.weight, userData.height);
  const tmb = calculateTMB(userData);
  const caloriasRecomendadas = calculateRecommendedCalories(userData, tmb);
  const blockers = buildBlockers(userData);

  let scoreBase = 84;

  if (userData.emotionalHunger === "frequente") scoreBase -= 8;
  if (userData.emotionalHunger === "as_vezes") scoreBase -= 4;
  if (userData.dietsTried === "3_5") scoreBase -= 5;
  if (userData.dietsTried === "mais_5") scoreBase -= 9;
  if (userData.routineImpact === "medio") scoreBase -= 4;
  if (userData.routineImpact === "alto") scoreBase -= 8;
  if (userData.consistencyDifficulty === "media") scoreBase -= 4;
  if (userData.consistencyDifficulty === "alta") scoreBase -= 8;
  if (userData.activityLevel === "moderado" || userData.activityLevel === "intenso") scoreBase += 3;
  if (userData.activityLevel === "atleta") scoreBase += 4;
  if (userData.goal === "reeducacao" || userData.goal === "manter") scoreBase += 2;

  const scoreCorporal = clamp(Math.round(scoreBase), 52, 93);
  const proteinaPorKg = userData.goal === "massa" ? 2 : 1.7;
  const gorduraPorKg = userData.goal === "massa" ? 0.9 : 0.75;
  const proteinas = Math.round(userData.weight * proteinaPorKg);
  const gorduras = Math.round(userData.weight * gorduraPorKg);
  const carboidratos = Math.max(
    80,
    Math.round((caloriasRecomendadas - proteinas * 4 - gorduras * 9) / 4)
  );

  const analysisBase = {
    imc: Number(imc.toFixed(1)),
    classificacao: getBMIClassification(imc),
    tmb: Math.round(tmb),
    caloriasRecomendadas,
    scoreCorporal,
    perfilMetabolico: buildMetabolicProfile(userData, blockers),
    nivelDificuldade: buildDifficulty(scoreCorporal),
    bloqueiosIdentificados: blockers,
    tendenciaAlimentar: buildTendency(userData),
    janelaCritica: getHungerWindowLabel(userData.hungerTime),
    estrategiaRecomendada: buildStrategy(userData),
    estimativaEvolucao: buildEvolutionEstimate(userData, scoreCorporal),
    hidratacaoMeta: `${Math.round(userData.weight * 35)} ml por dia`,
    proteinaMeta: `${proteinas} g por dia`,
    macros: {
      proteinas,
      carboidratos,
      gorduras,
    },
    confiancaAnalise: clamp(93 - blockers.length * 4, 72, 94),
  };

  return {
    ...analysisBase,
    resumoInteligente: buildSummary(userData, analysisBase),
  };
}

export function buildFallbackSubstitutions(userData: QuizData) {
  const restrictionHint = userData.restrictions
    ? `ajustada para evitar ${userData.restrictions}`
    : "mais alinhada à sua rotina";

  return [
    {
      de: "Lanche ultraprocessado da tarde",
      para: "Iogurte natural com fruta e aveia",
      motivo: `Troca com maior saciedade e ${restrictionHint}.`,
    },
    {
      de: "Jantar improvisado e tardio",
      para: "Prato simples com proteína magra, legumes e carboidrato controlado",
      motivo: "Reduz a chance de exagero na janela crítica de fome.",
    },
    {
      de: "Sobremesa por impulso",
      para: "Opção doce com proteína e fibra",
      motivo: "Ajuda a modular fome emocional sem sensação de punição.",
    },
  ];
}

export function buildFallbackRecipes(userData: QuizData): RecipeSuggestion[] {
  return [
    {
      nome: "Bowl Metabólico de Saciedade",
      objetivo: "Sustentar energia e reduzir fome entre refeições.",
      ingredientes: [
        "Frango grelhado desfiado",
        "Arroz integral",
        "Legumes assados",
        "Azeite e ervas",
      ],
      preparo: [
        "Monte a base com arroz integral e legumes.",
        "Adicione a proteína por cima.",
        "Finalize com azeite e temperos naturais.",
      ],
    },
    {
      nome: "Café da Manhã de Alta Aderência",
      objetivo: "Começar o dia com proteína e menor oscilação de fome.",
      ingredientes: [
        "Iogurte natural",
        "Aveia",
        "Frutas vermelhas",
        "Sementes",
      ],
      preparo: [
        "Misture o iogurte com a aveia.",
        "Adicione as frutas e sementes.",
        "Consuma frio ou deixe preparado na noite anterior.",
      ],
    },
    {
      nome: "Jantar de Controle Noturno",
      objetivo: "Reduzir impulso alimentar no período crítico.",
      ingredientes: [
        "Omelete com legumes",
        "Salada crocante",
        "Batata ou mandioca em porção controlada",
      ],
      preparo: [
        "Prepare a omelete com vegetais.",
        "Sirva com salada e carboidrato simples.",
        "Mantenha o volume alto e o preparo rápido.",
      ],
    },
  ];
}

export function buildFallbackChecklist(userData: QuizData) {
  return [
    `Priorizar 1 refeição estruturada na ${getHungerWindowLabel(userData.hungerTime)}.`,
    "Repetir combinações fáceis durante a semana para reduzir atrito.",
    "Manter água visível ao longo do dia e atingir a meta diária.",
    "Evitar longos períodos sem comer antes da janela de maior fome.",
    userData.wantsWorkout
      ? "Reservar blocos curtos de treino para reforçar consistência."
      : "Usar caminhadas e deslocamentos como suporte metabólico leve.",
  ];
}

export function buildFallbackGoals(userData: QuizData) {
  return [
    `Executar 80% do plano sem buscar perfeição nas próximas 2 semanas.`,
    `Reduzir o impacto de ${challengeLabels[userData.biggestChallenge]} com uma rotina mínima previsível.`,
    `Melhorar a percepção sobre ${concernLabels[userData.bodyConcern]} com foco em consistência, não restrição extrema.`,
  ];
}

export function buildFallbackPlan(userData: QuizData): Pick<
  NutritionPlan,
  "cronograma" | "substituicoes" | "receitas" | "checklist" | "metas"
> {
  return {
    cronograma: buildTimeline(userData),
    substituicoes: buildFallbackSubstitutions(userData),
    receitas: buildFallbackRecipes(userData),
    checklist: buildFallbackChecklist(userData),
    metas: buildFallbackGoals(userData),
  };
}

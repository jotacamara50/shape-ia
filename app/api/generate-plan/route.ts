import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { QuizData, NutritionPlan } from "@/types";
import {
  buildAnalysis,
  buildFallbackPlan,
  getActivityLabel,
  getBodyConcernLabel,
  getChallengeLabel,
  getConsistencyLabel,
  getDietHistoryLabel,
  getGoalLabel,
  getHungerWindowLabel,
  getRoutineImpactLabel,
} from "@/lib/analysis";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada");
  }

  return new OpenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  try {
    const userData: QuizData = await req.json();
    const analysis = buildAnalysis(userData);
    const fallbackPlan = buildFallbackPlan(userData);

    const systemPrompt = `Você é um especialista em nutrição comportamental e planejamento alimentar. Gere um plano alimentar personalizado em JSON estrito.

DADOS DO CLIENTE:
- Nome: ${userData.name}
- Objetivo: ${getGoalLabel(userData.goal)}
- Gênero: ${userData.gender}
- Idade: ${userData.age} anos
- Peso: ${userData.weight} kg
- Altura: ${userData.height} cm
- IMC: ${analysis.imc} (${analysis.classificacao})
- TMB: ${analysis.tmb} kcal
- Calorias recomendadas: ${analysis.caloriasRecomendadas} kcal/dia
- Nível de atividade: ${getActivityLabel(userData.activityLevel)}
- Área corporal sensível: ${getBodyConcernLabel(userData.bodyConcern)}
- Maior desafio: ${getChallengeLabel(userData.biggestChallenge)}
- Fome emocional: ${userData.emotionalHunger}
- Histórico de dietas: ${getDietHistoryLabel(userData.dietsTried)}
- Sentimento ao se olhar no espelho: ${userData.mirrorFeeling}
- Dificuldade de constância: ${getConsistencyLabel(userData.consistencyDifficulty)}
- Horário de maior fome: ${getHungerWindowLabel(userData.hungerTime)}
- Impacto da rotina: ${getRoutineImpactLabel(userData.routineImpact)}
- Restrições: ${userData.restrictions || "Nenhuma"}
- Deseja treino: ${userData.wantsWorkout ? "Sim" : "Não"}

REGRAS:
1. Retorne apenas JSON válido.
2. Cardápio com 7 dias completos, de Segunda a Domingo.
3. Cada dia deve conter: cafe, almoco, jantar, lanches.
4. Inclua quantidades aproximadas em todos os itens.
5. A listaCompras deve ter as categorias: Hortifruti, Proteínas, Grãos e Cereais, Laticínios, Outros.
6. Não repita itens na listaCompras.
7. Inclua substituicoes com 3 trocas inteligentes e motivo.
8. Inclua receitas com 3 receitas simples, ingredientes e preparo.
9. Inclua checklist com 5 itens de execução.
10. Inclua metas com 3 metas objetivas.
11. Respeite integralmente as restrições e o objetivo do cliente.
12. ${userData.wantsWorkout ? "Inclua treino simples com 3 a 5 dias." : "Não inclua treino."}

FORMATO EXATO:
{
  "cardapioSemanal": {
    "Segunda": {
      "cafe": ["Item 1 (quantidade)", "Item 2 (quantidade)"],
      "almoco": ["Item 1 (quantidade)", "Item 2 (quantidade)"],
      "jantar": ["Item 1 (quantidade)", "Item 2 (quantidade)"],
      "lanches": ["Item 1 (quantidade)", "Item 2 (quantidade)"]
    }
  },
  "listaCompras": {
    "Hortifruti": ["Item 1", "Item 2"],
    "Proteínas": ["Item 1", "Item 2"],
    "Grãos e Cereais": ["Item 1", "Item 2"],
    "Laticínios": ["Item 1", "Item 2"],
    "Outros": ["Item 1", "Item 2"]
  },
  "substituicoes": [
    { "de": "Opção 1", "para": "Opção 2", "motivo": "Motivo" }
  ],
  "receitas": [
    {
      "nome": "Receita 1",
      "objetivo": "Objetivo",
      "ingredientes": ["Ingrediente 1", "Ingrediente 2"],
      "preparo": ["Passo 1", "Passo 2"]
    }
  ],
  "checklist": ["Item 1", "Item 2", "Item 3"],
  "metas": ["Meta 1", "Meta 2", "Meta 3"]${userData.wantsWorkout ? ',\n  "treino": { "dias": ["Segunda", "Quarta", "Sexta"], "exercicios": [{ "nome": "Exercício", "series": "3x12", "obs": "Observação" }] }' : ""}
}`;

    const openai = getOpenAIClient();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Gere o plano alimentar agora." },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const planContent = completion.choices[0].message.content;

    if (!planContent) {
      throw new Error("Resposta vazia da IA");
    }

    const generatedPlan = JSON.parse(planContent);

    const nutritionPlan: NutritionPlan = {
      analise: analysis,
      cardapioSemanal: generatedPlan.cardapioSemanal,
      listaCompras: generatedPlan.listaCompras,
      cronograma: generatedPlan.cronograma || fallbackPlan.cronograma,
      substituicoes: generatedPlan.substituicoes || fallbackPlan.substituicoes,
      receitas: generatedPlan.receitas || fallbackPlan.receitas,
      checklist: generatedPlan.checklist || fallbackPlan.checklist,
      metas: generatedPlan.metas || fallbackPlan.metas,
      ...(userData.wantsWorkout && generatedPlan.treino
        ? { treino: generatedPlan.treino }
        : {}),
    };

    return NextResponse.json(nutritionPlan);
  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    return NextResponse.json(
      { error: "Erro ao gerar plano alimentar" },
      { status: 500 }
    );
  }
}

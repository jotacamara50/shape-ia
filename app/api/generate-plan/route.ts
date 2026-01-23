import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { QuizData, NutritionPlan } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const userData: QuizData = await req.json();

    // Calcular IMC e TMB
    const heightInMeters = userData.height / 100;
    const imc = userData.weight / Math.pow(heightInMeters, 2);
    
    // Fórmula de Harris-Benedict para TMB
    let tmb: number;
    if (userData.gender === "masculino") {
      tmb = 88.362 + (13.397 * userData.weight) + (4.799 * userData.height) - (5.677 * userData.age);
    } else {
      tmb = 447.593 + (9.247 * userData.weight) + (3.098 * userData.height) - (4.330 * userData.age);
    }

    // Multiplicador de atividade
    const activityMultipliers = {
      sedentario: 1.2,
      leve: 1.375,
      moderado: 1.55,
      intenso: 1.725,
      atleta: 1.9,
    };

    const caloriasRecomendadas = Math.round(tmb * activityMultipliers[userData.activityLevel]);

    // Ajustar calorias baseado no objetivo
    let caloriasFinais = caloriasRecomendadas;
    if (userData.goal === "emagrecer") {
      caloriasFinais = Math.round(caloriasRecomendadas * 0.85); // Déficit de 15%
    } else if (userData.goal === "massa") {
      caloriasFinais = Math.round(caloriasRecomendadas * 1.15); // Superávit de 15%
    }

    // Classificação IMC
    let classificacaoIMC = "";
    if (imc < 18.5) classificacaoIMC = "Abaixo do peso";
    else if (imc < 25) classificacaoIMC = "Peso normal";
    else if (imc < 30) classificacaoIMC = "Sobrepeso";
    else classificacaoIMC = "Obesidade";

    // System Prompt para a IA
    const systemPrompt = `Você é um nutricionista experiente. Crie um plano alimentar personalizado em formato JSON ESTRITO.

DADOS DO CLIENTE:
- Nome: ${userData.name}
- Objetivo: ${userData.goal}
- Gênero: ${userData.gender}
- Idade: ${userData.age} anos
- Peso: ${userData.weight}kg
- Altura: ${userData.height}cm
- IMC: ${imc.toFixed(1)} (${classificacaoIMC})
- Nível de Atividade: ${userData.activityLevel}
- Calorias Recomendadas: ${caloriasFinais} kcal/dia
- Restrições: ${userData.restrictions || "Nenhuma"}
- Deseja treino: ${userData.wantsWorkout ? "Sim" : "Não"}

REGRAS ESTRITAS DE FORMATAÇÃO:
1. CAPITALIZAÇÃO: Todo item de alimento DEVE começar com Letra Maiúscula
   ✅ CORRETO: "Arroz integral (150g)", "Peito de frango grelhado (120g)"
   ❌ ERRADO: "arroz integral", "peito de frango"

2. LISTA DE COMPRAS CATEGORIZADA:
   - Organize por categorias: "Hortifruti", "Proteínas", "Grãos e Cereais", "Laticínios", "Outros"
   - NÃO repita itens (ex: se banana aparece 3x, coloque apenas "Banana" uma vez)
   - Capitalize todos os itens da lista

3. ESTRUTURA DO CARDÁPIO:
   - 7 dias completos (Segunda a Domingo)
   - Cada dia: café, almoço, jantar, lanches
   - Inclua quantidades aproximadas (ex: "150g", "1 unidade")
   - Total aproximado de ${caloriasFinais} kcal/dia

4. RESPEITE as restrições alimentares do cliente
5. ${userData.wantsWorkout ? "INCLUA um plano de treino simples com 3-5 dias por semana" : "NÃO inclua treino"}

EXEMPLO DE ESTRUTURA DA LISTA DE COMPRAS:
"listaCompras": {
  "Hortifruti": ["Banana", "Maçã", "Alface", "Tomate"],
  "Proteínas": ["Peito de frango", "Ovos", "Filé de tilápia"],
  "Grãos e Cereais": ["Arroz integral", "Aveia", "Pão integral"],
  "Laticínios": ["Leite desnatado", "Iogurte natural", "Queijo branco"],
  "Outros": ["Azeite de oliva", "Sal rosa", "Temperos naturais"]
}

Retorne APENAS um JSON válido neste formato exato:
{
  "cardapioSemanal": {
    "Segunda": {
      "cafe": ["Item 1 (quantidade)", "Item 2 (quantidade)"],
      "almoco": ["Item 1 (quantidade)", "Item 2 (quantidade)"],
      "jantar": ["Item 1 (quantidade)", "Item 2 (quantidade)"],
      "lanches": ["Item 1 (quantidade)", "Item 2 (quantidade)"]
    },
    "Terça": { ... },
    ... (até Domingo)
  },
  "listaCompras": {
    "Hortifruti": ["Item 1", "Item 2"],
    "Proteínas": ["Item 1", "Item 2"],
    "Grãos e Cereais": ["Item 1", "Item 2"],
    "Laticínios": ["Item 1", "Item 2"],
    "Outros": ["Item 1", "Item 2"]
  }${userData.wantsWorkout ? ',\n  "treino": { "dias": ["Segunda", "Quarta", "Sexta"], "exercicios": [{ "nome": "Exercício", "series": "3x12", "obs": "observação" }] }' : ''}
}`;

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Gere o plano alimentar agora." }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const planContent = completion.choices[0].message.content;
    if (!planContent) {
      throw new Error("Resposta vazia da IA");
    }

    const generatedPlan = JSON.parse(planContent);

    // Montar resposta completa
    const nutritionPlan: NutritionPlan = {
      analise: {
        imc: parseFloat(imc.toFixed(1)),
        classificacao: classificacaoIMC,
        tmb: Math.round(tmb),
        caloriasRecomendadas: caloriasFinais,
      },
      cardapioSemanal: generatedPlan.cardapioSemanal,
      listaCompras: generatedPlan.listaCompras,
      ...(userData.wantsWorkout && generatedPlan.treino ? { treino: generatedPlan.treino } : {}),
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

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { NutritionPlan, QuizData } from "@/types";
import { getBodyConcernLabel, getGoalLabel } from "@/lib/analysis";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F7F9FC",
    paddingTop: 28,
    paddingBottom: 34,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#0F172A",
  },
  hero: {
    backgroundColor: "#0F172A",
    borderRadius: 18,
    padding: 24,
    marginBottom: 18,
  },
  heroEyebrow: {
    fontSize: 9,
    color: "#94A3B8",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 24,
    color: "#FFFFFF",
    marginBottom: 8,
    fontWeight: 700,
  },
  heroSubtitle: {
    fontSize: 11,
    color: "#CBD5E1",
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 10,
  },
  gridRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    border: "1 solid #E2E8F0",
  },
  statLabel: {
    fontSize: 8,
    color: "#64748B",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0F172A",
  },
  statHelp: {
    fontSize: 9,
    color: "#475569",
    marginTop: 5,
    lineHeight: 1.4,
  },
  blockCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    border: "1 solid #E2E8F0",
    marginBottom: 8,
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 4,
    color: "#0F172A",
  },
  blockText: {
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.5,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    border: "1 solid #E2E8F0",
    marginBottom: 10,
  },
  timelinePhase: {
    fontSize: 10,
    color: "#4338CA",
    marginBottom: 6,
    fontWeight: 700,
  },
  timelineFocus: {
    fontSize: 11,
    color: "#0F172A",
    marginBottom: 4,
    fontWeight: 700,
  },
  timelineExpectation: {
    fontSize: 10,
    color: "#475569",
    lineHeight: 1.5,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  badge: {
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 9,
    color: "#0F172A",
  },
  dayCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    border: "1 solid #E2E8F0",
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#334155",
    marginBottom: 4,
  },
  mealItem: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 2,
    marginLeft: 8,
    lineHeight: 1.4,
  },
  listCategory: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    border: "1 solid #E2E8F0",
    marginBottom: 10,
  },
  listCategoryTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0F172A",
    marginBottom: 6,
  },
  listItem: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  splitColumns: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  footer: {
    position: "absolute",
    left: 28,
    right: 28,
    bottom: 14,
    fontSize: 8,
    color: "#94A3B8",
    textAlign: "center",
  },
  disclaimer: {
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  disclaimerText: {
    fontSize: 9,
    color: "#92400E",
    lineHeight: 1.5,
  },
});

interface PDFDocumentProps {
  plan: NutritionPlan;
  userData: QuizData;
}

const renderFooter = (pageLabel: string) => (
  <Text style={styles.footer}>
    Shape AI • Relatório de estratégia alimentar personalizada • {pageLabel}
  </Text>
);

export function NutritionPlanPDF({ plan, userData }: PDFDocumentProps) {
  const days = Object.entries(plan.cardapioSemanal);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Shape AI • Análise Metabólica Inteligente</Text>
          <Text style={styles.heroTitle}>Relatório personalizado de {userData.name}</Text>
          <Text style={styles.heroSubtitle}>
            Objetivo principal: {getGoalLabel(userData.goal)}. Área corporal mais sensível: {getBodyConcernLabel(userData.bodyConcern)}.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leitura executiva</Text>
          <View style={styles.gridRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Score corporal</Text>
              <Text style={styles.statValue}>{plan.analise.scoreCorporal}</Text>
              <Text style={styles.statHelp}>Indicador composto de aderência, rotina e contexto metabólico.</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Perfil metabólico</Text>
              <Text style={styles.statValue}>{plan.analise.perfilMetabolico}</Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Calorias alvo</Text>
              <Text style={styles.statValue}>{plan.analise.caloriasRecomendadas} kcal</Text>
              <Text style={styles.statHelp}>Meta diária sugerida para o momento atual.</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Dificuldade prevista</Text>
              <Text style={styles.statValue}>{plan.analise.nivelDificuldade}</Text>
              <Text style={styles.statHelp}>{plan.analise.estimativaEvolucao}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bloqueios identificados</Text>
          {plan.analise.bloqueiosIdentificados.map((item) => (
            <View key={item} style={styles.blockCard}>
              <Text style={styles.blockText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo da IA</Text>
          <View style={styles.blockCard}>
            <Text style={styles.blockTitle}>Resumo inteligente</Text>
            <Text style={styles.blockText}>{plan.analise.resumoInteligente}</Text>
          </View>
          <View style={styles.badgeRow}>
            {[plan.analise.proteinaMeta, plan.analise.hidratacaoMeta, `Janela crítica: ${plan.analise.janelaCritica}`].map((item) => (
              <View key={item} style={styles.badge}>
                <Text style={styles.badgeText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {renderFooter("Página 1")}
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estratégia e cronograma</Text>
          <View style={styles.blockCard}>
            <Text style={styles.blockTitle}>Estratégia recomendada</Text>
            <Text style={styles.blockText}>{plan.analise.estrategiaRecomendada}</Text>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>IMC</Text>
              <Text style={styles.statValue}>{plan.analise.imc}</Text>
              <Text style={styles.statHelp}>{plan.analise.classificacao}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TMB</Text>
              <Text style={styles.statValue}>{plan.analise.tmb} kcal</Text>
              <Text style={styles.statHelp}>Estimativa de gasto basal atual.</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Macronutrientes</Text>
              <Text style={styles.statValue}>
                P {plan.analise.macros.proteinas}g • C {plan.analise.macros.carboidratos}g • G {plan.analise.macros.gorduras}g
              </Text>
            </View>
          </View>

          {plan.cronograma.map((item) => (
            <View key={item.fase} style={styles.timelineCard}>
              <Text style={styles.timelinePhase}>{item.fase}</Text>
              <Text style={styles.timelineFocus}>{item.foco}</Text>
              <Text style={styles.timelineExpectation}>{item.expectativa}</Text>
            </View>
          ))}
        </View>

        <View style={styles.splitColumns}>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Metas</Text>
            {plan.metas.map((item) => (
              <View key={item} style={styles.blockCard}>
                <Text style={styles.blockText}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Checklist semanal</Text>
            {plan.checklist.map((item) => (
              <View key={item} style={styles.blockCard}>
                <Text style={styles.blockText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {renderFooter("Página 2")}
      </Page>

      {days.map(([day, meals], index) => {
        if (index % 3 !== 0) return null;

        return (
          <Page key={day} size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Cardápio semanal</Text>
            {days.slice(index, index + 3).map(([innerDay, innerMeals]) => (
              <View key={innerDay} style={styles.dayCard}>
                <Text style={styles.dayTitle}>{innerDay}</Text>

                <Text style={styles.mealTitle}>Café da manhã</Text>
                {innerMeals.cafe.map((item) => (
                  <Text key={`${innerDay}-cafe-${item}`} style={styles.mealItem}>
                    • {item}
                  </Text>
                ))}

                <Text style={[styles.mealTitle, { marginTop: 8 }]}>Almoço</Text>
                {innerMeals.almoco.map((item) => (
                  <Text key={`${innerDay}-almoco-${item}`} style={styles.mealItem}>
                    • {item}
                  </Text>
                ))}

                <Text style={[styles.mealTitle, { marginTop: 8 }]}>Jantar</Text>
                {innerMeals.jantar.map((item) => (
                  <Text key={`${innerDay}-jantar-${item}`} style={styles.mealItem}>
                    • {item}
                  </Text>
                ))}

                <Text style={[styles.mealTitle, { marginTop: 8 }]}>Lanches</Text>
                {innerMeals.lanches.map((item) => (
                  <Text key={`${innerDay}-lanches-${item}`} style={styles.mealItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            ))}

            {renderFooter(`Cardápio • bloco ${Math.floor(index / 3) + 1}`)}
          </Page>
        );
      })}

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Lista de compras e otimizações</Text>

        <View style={styles.splitColumns}>
          <View style={styles.column}>
            {Object.entries(plan.listaCompras).map(([category, items]) => (
              <View key={category} style={styles.listCategory}>
                <Text style={styles.listCategoryTitle}>{category}</Text>
                {items.map((item) => (
                  <Text key={`${category}-${item}`} style={styles.listItem}>
                    • {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Substituições inteligentes</Text>
            {plan.substituicoes.map((item) => (
              <View key={`${item.de}-${item.para}`} style={styles.blockCard}>
                <Text style={styles.blockTitle}>
                  {item.de} → {item.para}
                </Text>
                <Text style={styles.blockText}>{item.motivo}</Text>
              </View>
            ))}
          </View>
        </View>

        {renderFooter("Lista de compras")}
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Receitas e extras do protocolo</Text>

        {plan.receitas.map((recipe) => (
          <View key={recipe.nome} style={styles.blockCard}>
            <Text style={styles.blockTitle}>{recipe.nome}</Text>
            <Text style={styles.blockText}>{recipe.objetivo}</Text>
            <Text style={[styles.mealTitle, { marginTop: 8 }]}>Ingredientes</Text>
            {recipe.ingredientes.map((ingredient) => (
              <Text key={`${recipe.nome}-${ingredient}`} style={styles.mealItem}>
                • {ingredient}
              </Text>
            ))}
            <Text style={[styles.mealTitle, { marginTop: 8 }]}>Preparo</Text>
            {recipe.preparo.map((step) => (
              <Text key={`${recipe.nome}-${step}`} style={styles.mealItem}>
                • {step}
              </Text>
            ))}
          </View>
        ))}

        {plan.treino ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Treino de apoio</Text>
            <View style={styles.blockCard}>
              <Text style={styles.blockTitle}>Dias sugeridos</Text>
              <Text style={styles.blockText}>{plan.treino.dias.join(", ")}</Text>
              {plan.treino.exercicios.map((exercise) => (
                <Text key={exercise.nome} style={[styles.blockText, { marginTop: 6 }]}>
                  {exercise.nome} • {exercise.series} • {exercise.obs}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Este relatório foi gerado com apoio de IA para fins educacionais. Ele não substitui acompanhamento individual de nutricionista ou médico.
          </Text>
        </View>

        {renderFooter("Receitas e extras")}
      </Page>
    </Document>
  );
}

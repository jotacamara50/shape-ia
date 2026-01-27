import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { NutritionPlan, QuizData } from "@/types";

// Estilos para o PDF
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    backgroundColor: "#16A34A",
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#D1FAE5",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "2 solid #16A34A",
  },
  analysisGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  analysisCard: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 6,
    width: "48%",
  },
  analysisLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16A34A",
  },
  dayCard: {
    backgroundColor: "#F9FAFB",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    borderLeft: "4 solid #16A34A",
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  mealSection: {
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 4,
  },
  mealItem: {
    fontSize: 9,
    color: "#4B5563",
    marginLeft: 8,
    marginBottom: 2,
  },
  shoppingList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  shoppingItem: {
    fontSize: 10,
    color: "#4B5563",
    width: "50%",
    marginBottom: 4,
  },
  shoppingCategory: {
    marginBottom: 15,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 6,
    paddingBottom: 3,
    borderBottom: "1 solid #D1FAE5",
  },
  categoryItem: {
    fontSize: 10,
    color: "#4B5563",
    marginLeft: 5,
    marginBottom: 3,
  },
  workoutDay: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#16A34A",
    marginBottom: 6,
  },
  exerciseItem: {
    marginBottom: 8,
    paddingLeft: 10,
  },
  exerciseName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1F2937",
  },
  exerciseDetails: {
    fontSize: 9,
    color: "#6B7280",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 9,
    borderTop: "1 solid #E5E7EB",
    paddingTop: 10,
  },
});

interface PDFDocumentProps {
  plan: NutritionPlan;
  userData: QuizData;
}

export function NutritionPlanPDF({ plan, userData }: PDFDocumentProps) {
  return (
    <Document>
      {/* Página 1: Capa e Análise */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Plano Alimentar Personalizado</Text>
          <Text style={styles.headerSubtitle}>de {userData.name}</Text>
        </View>

        {/* Análise Corporal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise Corporal</Text>
          
          <View style={styles.analysisGrid}>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisLabel}>IMC</Text>
              <Text style={styles.analysisValue}>{plan.analise.imc}</Text>
              <Text style={styles.analysisLabel}>{plan.analise.classificacao}</Text>
            </View>
            
            <View style={styles.analysisCard}>
              <Text style={styles.analysisLabel}>TMB</Text>
              <Text style={styles.analysisValue}>{plan.analise.tmb} kcal</Text>
              <Text style={styles.analysisLabel}>Taxa Metabólica Basal</Text>
            </View>
          </View>

          <View style={styles.analysisGrid}>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisLabel}>Meta Calórica Diária</Text>
              <Text style={styles.analysisValue}>{plan.analise.caloriasRecomendadas} kcal</Text>
            </View>
            
            <View style={styles.analysisCard}>
              <Text style={styles.analysisLabel}>Objetivo</Text>
              <Text style={styles.analysisValue}>
                {userData.goal === "emagrecer"
                  ? "Emagrecimento"
                  : userData.goal === "massa"
                    ? "Ganho de Massa"
                    : userData.goal === "reeducacao"
                      ? "Reeducacao alimentar"
                      : userData.goal === "manter"
                        ? "Manter"
                        : "Saude"}
              </Text>
            </View>
          </View>
        </View>

        {/* Seus Dados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus Dados</Text>
          <View style={{ backgroundColor: "#F9FAFB", padding: 12, borderRadius: 6 }}>
            <Text style={{ fontSize: 10, marginBottom: 4, color: "#4B5563" }}>
              • Idade: {userData.age} anos
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 4, color: "#4B5563" }}>
              • Peso: {userData.weight}kg
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 4, color: "#4B5563" }}>
              • Altura: {userData.height}cm
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 4, color: "#4B5563" }}>
              • Nível de Atividade: {userData.activityLevel}
            </Text>
            {userData.restrictions && (
              <Text style={{ fontSize: 10, color: "#4B5563" }}>
                • Restrições: {userData.restrictions}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.footer}>
          Shape IA - Plano gerado por Inteligência Artificial • Página 1
        </Text>
      </Page>

      {/* Página 2-3: Cardápio Semanal */}
      {Object.entries(plan.cardapioSemanal).map(([dia, refeicoes], index) => {
        // Mostrar 3-4 dias por página
        if (index % 4 === 0 || index === 0) {
          return (
            <Page key={`page-${index}`} size="A4" style={styles.page}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Cardápio Semanal</Text>
              </View>

              {Object.entries(plan.cardapioSemanal)
                .slice(index, index + 4)
                .map(([d, r]) => (
                  <View key={d} style={styles.dayCard}>
                    <Text style={styles.dayTitle}>{d}</Text>
                    
                    <View style={styles.mealSection}>
                      <Text style={styles.mealTitle}>☕ Café da Manhã</Text>
                      {r.cafe.map((item, i) => (
                        <Text key={i} style={styles.mealItem}>• {item}</Text>
                      ))}
                    </View>

                    <View style={styles.mealSection}>
                      <Text style={styles.mealTitle}>🍽️ Almoço</Text>
                      {r.almoco.map((item, i) => (
                        <Text key={i} style={styles.mealItem}>• {item}</Text>
                      ))}
                    </View>

                    <View style={styles.mealSection}>
                      <Text style={styles.mealTitle}>🌙 Jantar</Text>
                      {r.jantar.map((item, i) => (
                        <Text key={i} style={styles.mealItem}>• {item}</Text>
                      ))}
                    </View>

                    <View style={styles.mealSection}>
                      <Text style={styles.mealTitle}>🍎 Lanches</Text>
                      {r.lanches.map((item, i) => (
                        <Text key={i} style={styles.mealItem}>• {item}</Text>
                      ))}
                    </View>
                  </View>
                ))}

              <Text style={styles.footer}>
                Shape IA - Plano gerado por Inteligência Artificial • Página {Math.floor(index / 4) + 2}
              </Text>
            </Page>
          );
        }
        return null;
      })}

      {/* Página Final: Lista de Compras e Treino */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Lista de Compras & Extras</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Lista de Compras</Text>
          <View>
            {Object.entries(plan.listaCompras).map(([categoria, itens]) => (
              <View key={categoria} style={styles.shoppingCategory}>
                <Text style={styles.categoryTitle}>{categoria}</Text>
                {itens.map((item, index) => (
                  <Text key={index} style={styles.categoryItem}>☐ {item}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>

        {plan.treino && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💪 Plano de Treino</Text>
            <Text style={styles.workoutDay}>
              Dias de Treino: {plan.treino.dias.join(", ")}
            </Text>
            {plan.treino.exercicios.map((ex, index) => (
              <View key={index} style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>
                  {index + 1}. {ex.nome}
                </Text>
                <Text style={styles.exerciseDetails}>
                  {ex.series} • {ex.obs}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 30, padding: 15, backgroundColor: "#FEF3C7", borderRadius: 6 }}>
          <Text style={{ fontSize: 10, color: "#92400E", textAlign: "center" }}>
            ⚠️ Este plano foi gerado por IA e tem caráter educacional.{"\n"}
            Consulte um nutricionista para acompanhamento profissional.
          </Text>
        </View>

        <Text style={styles.footer}>
          Shape IA - Plano gerado por Inteligência Artificial • Página Final
        </Text>
      </Page>
    </Document>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Star,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumLandingProps {
  onStart: () => void;
}

const metrics = [
  { value: "+48 mil", label: "análises geradas" },
  { value: "4.9/5", label: "satisfação média" },
  { value: "3 min", label: "onboarding rápido" },
];

const benefits = [
  {
    icon: Activity,
    title: "Mapeamento Biométrico Individual",
    description: "Analisamos o seu ponto de partida físico, idade e taxa metabólica basal exata antes de traçar qualquer estratégia.",
  },
  {
    icon: Heart,
    title: "Ajuste Psico-Comportamental",
    description: "Identificamos os seus gatilhos de ansiedade e picos de fome noturna para criar um protocolo que você realmente consegue sustentar.",
  },
  {
    icon: Zap,
    title: "Otimização Metabólica Ativa",
    description: "Esqueça restrições extremas. Nosso foco é ajustar os macronutrientes para acelerar a queima calórica de forma previsível e segura.",
  },
];

const proofPoints = [
  "Protocolo alimentar 100% individualizado gerado pelo algoritmo",
  "Mapeamento científico dos seus bloqueios e gatilhos de rotina",
  "Guia prático instantâneo em PDF com listas de compras e receitas",
];

const testimonials = [
  {
    name: "Mariana S., 32 anos",
    quote: "Pela primeira vez um plano alimentar pareceu feito para a minha rotina real, e não para uma rotina ideal que não existe no meu dia a dia.",
  },
  {
    name: "Carlos M., 38 anos",
    quote: "Direto ao ponto. Sem culpa e sem promessas milagrosas. A IA identificou exatamente o que me fazia quebrar a dieta no fim da noite.",
  },
];

export function PremiumLanding({ onStart }: PremiumLandingProps) {
  return (
    <main className="min-h-screen bg-[#fafaf8] text-stone-900 flex flex-col items-center selection:bg-stone-200">
      
      {/* Navbar Minimalista Premium de App */}
      <nav className="w-full max-w-5xl flex items-center justify-between px-5 py-4 sm:px-8 border-b border-stone-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-950 shadow-sm">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-stone-900">Shape AI</span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-500 shadow-inner">
          <ShieldCheck className="h-3.5 w-3.5 text-stone-900" />
          Protocolo Criptografado
        </div>
      </nav>

      {/* Hero Section - Otimizada para Mobile e Meta Ads */}
      <section className="w-full max-w-5xl px-5 pt-8 pb-14 sm:px-8 sm:pt-16 flex flex-col items-center text-center lg:text-left lg:items-start">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center w-full">
          
          {/* Lado Esquerdo - Copy e Chamada Principal */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-1.5 text-xs font-bold text-stone-700 shadow-wellness-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-stone-950" />
              Análise Metabólica Inteligente v4.12
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-[2.5rem] sm:text-5xl font-extrabold leading-[1.1] tracking-tight text-stone-900"
            >
              O seu corpo pode estar <span className="underline decoration-stone-400 decoration-wavy underline-offset-4">bloqueando</span> o seu emagrecimento.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="max-w-xl text-sm sm:text-base leading-relaxed text-stone-400 font-medium mx-auto lg:mx-0"
            >
              Nossa Inteligência Artificial analisa minuciosamente os seus hábitos diários, biotipo e rotina hormonal para construir um plano alimentar estratégico, focado em consistência de longo prazo.
            </motion.p>

            {/* CTA Principal - Efeito Tátil Vibrante */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button
                size="lg"
                onClick={onStart}
                className="h-14 w-full sm:w-auto rounded-2xl bg-stone-950 px-8 text-base font-bold text-white hover:bg-stone-900 shadow-wellness-md transition-all active:scale-[0.99]"
              >
                Iniciar Análise Gratuita
                <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
              </Button>
              <div className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                ⏱️ Leva menos de 3 minutos
              </div>
            </motion.div>

            {/* Grid de Métricas Auxiliares */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="grid grid-cols-3 gap-3 pt-4 w-full"
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-stone-200/60 bg-white px-3 py-4 shadow-wellness-sm text-center"
                >
                  <p className="text-lg sm:text-xl font-extrabold tracking-tight text-stone-900">
                    {metric.value}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-stone-400 uppercase tracking-wide">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Lado Direito - Prova Social Coletiva (Cards Estilo App) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="flex flex-col gap-4 w-full"
          >
            {/* Bloco de Depoimentos Reais */}
            <div className="rounded-[2rem] border border-stone-200/60 bg-white p-5 shadow-wellness-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
                <div className="flex gap-0.5 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-stone-900 text-stone-900" />
                  ))}
                </div>
                Avaliações Recentes
              </div>
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-xl border border-stone-100 bg-stone-50/50 p-4 shadow-inner">
                    <p className="text-xs font-bold text-stone-900">{t.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-stone-400 font-medium">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bloco explicativo - O que o Usuário Ganha */}
            <div className="rounded-[2rem] border border-stone-200/60 bg-white p-5 shadow-wellness-sm space-y-3.5">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">O que você vai receber no diagnóstico:</p>
              <div className="space-y-3">
                {proofPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-stone-950 shrink-0" />
                    <p className="text-xs sm:text-sm font-semibold text-stone-600 leading-normal">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Seção Informativa de Diferenciais Científicos */}
      <section className="w-full border-t border-stone-200/50 bg-white py-14 flex flex-col items-center">
        <div className="w-full max-w-5xl px-5 sm:px-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Uma abordagem puramente tecnológica e comportamental
            </h2>
            <p className="mx-auto max-w-md text-xs sm:text-sm font-medium text-stone-400 leading-relaxed">
              Cruzamos algoritmos nutricionais com as suas dores reais para gerar um modelo adaptável e de fácil execução.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-2xl border border-stone-200/60 bg-[#fafaf8] p-5 shadow-wellness-xs"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-stone-200/40 shadow-sm">
                  <benefit.icon className="h-4 w-4 text-stone-950" />
                </div>
                <h3 className="mt-4 text-sm sm:text-base font-bold text-stone-900 tracking-tight">{benefit.title}</h3>
                <p className="mt-1.5 text-xs sm:text-sm font-medium text-stone-400 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Final - Resgate e Fechamento de Funil */}
      <section className="w-full py-16 flex flex-col items-center">
        <div className="w-full max-w-xl px-5 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
              Pronto para decifrar a sua rotina?
            </h2>
            <p className="max-w-xs mx-auto text-xs sm:text-sm font-medium text-stone-400 leading-relaxed">
              O onboarding é totalmente gratuito e estruturado para te entregar respostas reais imediatamente.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Button
              size="lg"
              onClick={onStart}
              className="h-14 w-full sm:w-auto rounded-2xl bg-stone-950 px-10 text-base font-bold text-white hover:bg-stone-900 shadow-wellness-md transition-all active:scale-[0.99]"
            >
              Começar Meu Onboarding
              <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
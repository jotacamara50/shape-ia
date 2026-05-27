"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Leaf,
  ShieldCheck,
  Star,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumLandingProps {
  onStart: () => void;
}

const benefits = [
  {
    icon: Leaf,
    title: "Análise do seu estilo de vida",
    description: "Entendemos sua rotina, seus horários e seus desafios reais antes de sugerir qualquer mudança.",
  },
  {
    icon: Heart,
    title: "Plano que respeita você",
    description: "As recomendações são baseadas no que funciona para o seu dia a dia — não em dietas genéricas.",
  },
  {
    icon: Sun,
    title: "Hábitos que se sustentam",
    description: "Foco em constância e clareza, não em restrições extremas ou mudanças impossíveis de manter.",
  },
];

const proofPoints = [
  "Plano alimentar personalizado com base nas suas respostas",
  "Insights sobre seus hábitos e padrões alimentares",
  "Guia prático com cardápio, lista de compras e sugestões",
];

const metrics = [
  { value: "+48 mil", label: "pessoas atendidas" },
  { value: "4.9/5", label: "avaliação média" },
  { value: "8 min", label: "para concluir" },
];

const testimonials = [
  {
    name: "Mariana, 32",
    quote: "Pela primeira vez um plano pareceu feito pra mim, não para uma pessoa ideal que não existe.",
  },
  {
    name: "Carlos, 38",
    quote: "Simples e direto. Sem culpa, sem promessas impossíveis. Me ajudou a entender minha relação com a comida.",
  },
  {
    name: "Juliana, 27",
    quote: "A análise identificou exatamente o que me fazia sair do plano sempre no fim do dia.",
  },
];

export function PremiumLanding({ onStart }: PremiumLandingProps) {
  return (
    <main className="min-h-screen bg-[#fafaf8] text-stone-900">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sage-600">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-semibold text-stone-900">Shape AI</span>
        </div>
        <div className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm text-stone-500 shadow-sm sm:flex">
          <ShieldCheck className="h-3.5 w-3.5 text-sage-600" />
          Pagamento seguro
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage-200 bg-sage-50 px-4 py-2 text-sm font-medium text-sage-700"
            >
              <Leaf className="h-3.5 w-3.5" />
              Personalizado para você
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 }}
              className="text-[2.4rem] font-semibold leading-[1.15] tracking-[-0.03em] text-stone-900 sm:text-5xl"
            >
              Entenda seu corpo e crie hábitos que realmente duram.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-lg text-base leading-7 text-stone-500 sm:text-lg"
            >
              Uma análise personalizada para ajudar você a emagrecer com mais clareza e constância — sem fórmulas prontas.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                size="lg"
                onClick={onStart}
                className="h-14 rounded-2xl bg-stone-900 px-8 text-base font-semibold text-white hover:bg-stone-800 active:scale-[0.98]"
              >
                Começar análise gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-stone-400">Leva menos de 8 minutos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 grid grid-cols-3 gap-3"
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-stone-100 bg-white px-4 py-4 shadow-sm"
                >
                  <p className="text-xl font-semibold tracking-[-0.03em] text-stone-900">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">{metric.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — social proof + benefits */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="flex flex-col gap-4"
          >
            {/* Depoimentos */}
            <div className="rounded-[1.75rem] border border-stone-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>O que dizem por aí</span>
              </div>
              <div className="mt-4 space-y-3">
                {testimonials.map((t) => (
                  <div key={t.name} className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3.5">
                    <p className="text-sm font-semibold text-stone-800">{t.name}</p>
                    <p className="mt-1 text-sm leading-6 text-stone-500">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>

            {/* O que está incluído */}
            <div className="rounded-[1.75rem] border border-stone-100 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-stone-400">O que você recebe</p>
              <div className="mt-3 space-y-2.5">
                {proofPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-sage-50 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-sage-500" />
                    </div>
                    <p className="text-sm leading-6 text-stone-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-t border-stone-100 bg-white py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-2xl font-semibold tracking-[-0.025em] text-stone-900"
          >
            Uma abordagem diferente
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mx-auto mt-3 max-w-lg text-center text-base leading-7 text-stone-400"
          >
            Com base nas suas respostas, identificamos padrões e criamos orientações que respeitam sua realidade.
          </motion.p>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="rounded-[1.5rem] border border-stone-100 bg-[#fafaf8] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-50">
                  <benefit.icon className="h-5 w-5 text-sage-600" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-stone-900">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold tracking-[-0.025em] text-stone-900"
          >
            Pronto para começar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="mx-auto mt-3 max-w-md text-base leading-7 text-stone-400"
          >
            A análise é gratuita e leva menos de 8 minutos. Sem compromisso.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-7"
          >
            <Button
              size="lg"
              onClick={onStart}
              className="h-14 rounded-2xl bg-stone-900 px-10 text-base font-semibold text-white hover:bg-stone-800 active:scale-[0.98]"
            >
              Começar análise gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

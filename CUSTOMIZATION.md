# 🎨 Guia de Personalização - Shape IA

Este guia mostra como personalizar o Shape IA para sua marca e necessidades.

## 🎨 Alterar Cores

### Tema Principal (Verde → Sua Cor)

Edite: [app/globals.css](app/globals.css)

```css
:root {
  --primary: 142 76% 36%;  /* Verde atual */
  /* Mude para sua cor (HSL): */
  --primary: 221 83% 53%;  /* Exemplo: Azul */
}
```

**Conversor HSL:** https://hslpicker.com/

### Cores do PDF

Edite: [components/NutritionPlanPDF.tsx](components/NutritionPlanPDF.tsx)

```typescript
// Linha ~15
header: {
  backgroundColor: "#16A34A", // Verde → Sua cor
}
```

## 💰 Alterar Preço

Edite: [.env](.env)

```env
NEXT_PUBLIC_PRODUCT_PRICE=27.90  # Seu novo preço
```

## 📝 Textos e Copy

### Título do Site

Edite: [app/layout.tsx](app/layout.tsx)

```typescript
export const metadata: Metadata = {
  title: "Shape IA - Seu Plano Alimentar",  // Mude aqui
  description: "Sua descrição personalizada",
};
```

### Nome da Marca

Busque e substitua `Shape IA` por sua marca em:
- `app/page.tsx`
- `app/seu-plano/page.tsx`
- `components/NutritionQuiz.tsx`
- `components/NutritionPlanPDF.tsx`
- `README.md`

## 🖼️ Adicionar Logo

### 1. Criar pasta de imagens
```bash
mkdir public/images
```

### 2. Adicionar logo
Coloque seu logo em: `public/images/logo.png`

### 3. Usar no header

Edite: [components/NutritionQuiz.tsx](components/NutritionQuiz.tsx)

```tsx
import Image from "next/image";

// Linha ~45
<div className="flex items-center justify-between mb-3">
  <Image src="/images/logo.png" alt="Logo" width={120} height={40} />
  <span className="text-sm text-gray-500">
    Passo {step} de {TOTAL_STEPS}
  </span>
</div>
```

## 📧 Adicionar Envio de Email

### Com Resend (Recomendado)

1. **Instalar:**
```bash
npm install resend
```

2. **Obter API Key:**
- Acesse: https://resend.com
- Copie a API Key

3. **Adicionar ao .env:**
```env
RESEND_API_KEY=re_sua_chave_aqui
```

4. **Criar API de envio:**

Criar: `app/api/send-email/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email, name, pdfUrl } = await req.json();

  try {
    await resend.emails.send({
      from: "Shape IA <noreply@seudominio.com>",
      to: email,
      subject: `${name}, seu plano está pronto! 🎉`,
      html: `
        <h1>Olá ${name}!</h1>
        <p>Seu plano alimentar personalizado está pronto.</p>
        <a href="${pdfUrl}">Baixar PDF</a>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
```

## 🎯 Personalizar Perguntas do Quiz

Edite: [components/NutritionQuiz.tsx](components/NutritionQuiz.tsx)

### Adicionar nova pergunta:

```typescript
// Aumentar TOTAL_STEPS
const TOTAL_STEPS = 8; // Era 7

// Adicionar novo passo
{step === 8 && (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold">Sua Pergunta?</h2>
    {/* Seu input aqui */}
  </div>
)}

// Atualizar validação em canProceed()
case 8: return !!formData.suaNovaProp;
```

### Remover pergunta:

1. Diminua `TOTAL_STEPS`
2. Remova o bloco `{step === X && ...}`
3. Atualize `canProceed()`
4. Remova do tipo `QuizData` em `types/index.ts`

## 🤖 Personalizar Prompt da IA

Edite: [app/api/generate-plan/route.ts](app/api/generate-plan/route.ts)

```typescript
// Linha ~50
const systemPrompt = `Você é um nutricionista experiente...

// Adicione suas instruções personalizadas:
- Sempre incluir opções vegetarianas
- Focar em alimentos brasileiros
- Incluir dicas de preparo
- etc...
`;
```

## 📄 Personalizar Layout do PDF

Edite: [components/NutritionPlanPDF.tsx](components/NutritionPlanPDF.tsx)

### Adicionar nova seção:

```tsx
<View style={styles.section}>
  <Text style={styles.sectionTitle}>🎯 Dicas Extras</Text>
  <Text style={{ fontSize: 10 }}>
    Suas dicas personalizadas aqui...
  </Text>
</View>
```

### Mudar cores/estilos:

```typescript
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#SUA_COR", // Mude aqui
  },
  // ... outros estilos
});
```

## 🌐 Adicionar Idioma (i18n)

Para suporte a múltiplos idiomas:

1. **Instalar:**
```bash
npm install next-intl
```

2. **Configurar:** Siga a documentação em https://next-intl-docs.vercel.app/

## 📊 Adicionar Mais Campos de Análise

Em: [app/api/generate-plan/route.ts](app/api/generate-plan/route.ts)

```typescript
// Calcular novos campos
const gorduraCorporal = calcularGordura(userData);
const pesoIdeal = calcularPesoIdeal(userData);

// Adicionar à resposta
analise: {
  imc: ...,
  gorduraCorporal,
  pesoIdeal,
  // ...
}
```

## 💳 Adicionar Outros Métodos de Pagamento

### Stripe:
```bash
npm install @stripe/stripe-js stripe
```

### PayPal:
```bash
npm install @paypal/react-paypal-js
```

**Documentação:** Consulte docs oficiais de cada gateway.

## 🎁 Adicionar Upsell/Cross-sell

Após o pagamento, ofereça produtos adicionais:

```tsx
// Em app/seu-plano/page.tsx após isPaid
{isPaid && (
  <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
    <h3>🎁 Complemento Especial</h3>
    <p>Adicione consultoria online por +R$ 49,90</p>
    <Button>Adicionar ao Pedido</Button>
  </div>
)}
```

## 🔔 Adicionar Notificações

### Web Push:
```bash
npm install web-push
```

### WhatsApp (via API):
Use serviços como:
- Twilio
- MessageBird
- WhatsApp Business API

## 📱 Progressive Web App (PWA)

Para transformar em PWA:

1. **Instalar:**
```bash
npm install next-pwa
```

2. **Configurar:** `next.config.js`

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  // sua config
});
```

## 🎨 Templates de Cores Prontos

### Azul Profissional
```css
--primary: 221 83% 53%;
```

### Roxo Moderno
```css
--primary: 262 83% 58%;
```

### Laranja Vibrante
```css
--primary: 25 95% 53%;
```

### Rosa Saúde
```css
--primary: 330 81% 60%;
```

## 📝 Checklist de Personalização

- [ ] Cores alteradas
- [ ] Logo adicionado
- [ ] Textos personalizados
- [ ] Preço ajustado
- [ ] Perguntas do quiz customizadas
- [ ] Prompt da IA ajustado
- [ ] Layout do PDF personalizado
- [ ] Email configurado (opcional)
- [ ] Analytics adicionado
- [ ] Domínio personalizado

---

**Dica:** Faça mudanças incrementais e teste após cada alteração!

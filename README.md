# Shape IA - Plano Alimentar Personalizado com IA 🥗🤖

MVP de venda de planos alimentares personalizados por R$ 27,90 usando Inteligência Artificial.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 14+ (App Router)
- **UI/UX:** Tailwind CSS + Shadcn/UI
- **Animações:** Framer Motion + Canvas Confetti
- **Pagamento:** Mercado Pago SDK React (Payment Brick)
- **Banco de Dados:** Vercel Postgres
- **IA:** OpenAI API (gpt-4o-mini)
- **PDF:** @react-pdf/renderer

## 📋 Funcionalidades

### 1. Quiz de Nutrição (Wizard Multi-Step)
- 7 perguntas interativas com transição suave
- Barra de progresso em tempo real
- Validação em cada etapa
- Coleta: objetivo, dados corporais, atividade física, restrições e preferência de treino

### 2. Tela de Loading Psicológica
- Mensagens dinâmicas (5-7 segundos)
- Animações de carregamento
- Preparação psicológica para o checkout

### 3. Página de Checkout (/seu-plano)
- **Preview do PDF** com efeito blur
- **Integração Mercado Pago** (PIX e Cartão)
- Layout responsivo (2 colunas desktop / empilhado mobile)
- Selos de segurança e garantia

### 4. Backend com IA
- Cálculo automático de IMC e TMB
- Geração de cardápio semanal personalizado
- Adaptação às restrições alimentares
- Plano de treino opcional
- **Banco de dados para validação de pagamento**
- **Sistema de tokens únicos para download seguro**

### 5. Sistema de Pagamento Seguro
✅ Integração Mercado Pago (PIX + Cartão)  
✅ **Webhook para confirmação automática**  
✅ **Salvamento do pedido no banco de dados**  
✅ **Validação antes de liberar o PDF**  
✅ Polling para atualização em tempo real

### 5. Geração de PDF Profissional
- Design clean (verde, branco, cinza)
- Análise corporal completa
- Cardápio semanal (7 dias)
- Lista de compras organizada
- Seção de treino (se solicitado)

### 6. Entrega Instantânea
- Animação de confetes ao aprovar pagamento
- Botão de download imediato
- PDF com nome personalizado

## 🛠️ Instalação

### 1. Clone o repositório
```bash
cd nutri-ia
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
Vercel Postgres (obrigatório - veja DATABASE.md)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
# ... outras variáveis do Postgres

# Configurações
NEXT_PUBLIC_PRODUCT_PRICE=27.90
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**📚 Leia [DATABASE.md](DATABASE.md) para instruções completas do banco de dados**

### 4. Configure o Banco de Dados

**Opção 1: Vercel Postgres (Recomendado para produção)**
1. Siga as instruções em [DATABASE.md](DATABASE.md)
2. Configure as variáveis `POSTGRES_*`
3. Acesse `http://localhost:3000/api/init-db` para criar tabelas

### 5. Inicialize o banco de dados
Acesse no navegador: **http://localhost:3000/api/init-db**

Deve retornar:
```json
{"success": true, "message": "Database initialized successfully"}
```

**Opção 2: Local (Desenvolvimento - temporário)**
```bash
# As tabelas serão criadas automaticamente na primeira vez
OPENAI_API_KEY=sk-your-openai-key-here

# Mercado Pago (obrigatório)
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-your-public-key
MP_ACCESS_TOKEN=APP_USR-your-access-token

# Configurações
NEXT_PUBLIC_PRODUCT_PRICE=27.90
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Execute o projeto (com validação)
│   │   ├── create-order/     # Criar pedido no banco
│   │   ├── check-payment/    # Verificar status do pagamento
│   │   ├── init-db/          # Inicializar banco de dados
│   │   └── webhooks/
│   │       └── mercadopago/  # Webhook do Mercado Pago
│   ├── seu-plano/
│   │   └── page.tsx          # Página de checkout
│   ├── layout.tsx
│   ├── page.tsx              # Quiz inicial
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes Shadcn/UI
│   ├── NutritionQuiz.tsx     # Wizard do quiz
│   ├── LoadingScreen.tsx     # Tela de loading
│   ├── PlanPreview.tsx       # Preview do plano
│   ├── CheckoutSection.tsx   # Seção de pagamento
│   └── NutritionPlanPDF.tsx  # Template do PDF
├── lib/
│   ├── db.ts                 # Funções do banco de dados
│   └── utils.ts
├── types/
│   └── index.ts              # TypeScript typecess Token** → `MP_ACCESS_TOKEN`

## 📁 Estrutura do Projeto

```
nutri-ia/
├── app/
│   ├── api/
│   │   ├── generate-plan/    # API de geração do plano com IA
│   │   ├── generate-pdf/     # API de geração do PDF
│   │   ├── create-payment/   # Criar preferência MP
│   │   └── process-payment/  # Processar pagamento
│   ├── seu-plano/
│   │   └── page.tsx          # Página de checkout
│   ├── layout.tsx
│   ├── page.tsx              # Quiz inicial
│   └── globals.css
├── components/
│   ├── ui/                   # Componentes Shadcn/UI
│   ├── NutritionQuiz.tsx     # Wizard do quiz
│   ├── LoadingScreen.tsx     # Tela de loading
│   ├── PlanPreview.tsx       # Preview do plano
│   ├── CheckoutSection.tsx   # Seção de pagamento
│   └── NutritionPlanPDF.tsx  # Template do PDF
├── types/
│   └── index.ts              # TypeScript types
├── lib/
│   └── utils.ts
└── .env                      # Variáveis de ambiente
```

## 🎨 Design System

### Cores
- **Primária:** Verde (#16A34A)
- **Background:** Gradiente verde claro para branco
- **Texto:** Cinza escuro (#1F2937)
- **Destaque:** Verde claro (#F0FDF4)

### Tipografia
- **Font:** Inter (Google Fonts)
- **Tamanhos:** Responsivos e acessíveis

## 🧪 Modo de Teste

Para testar sem pagamento real:
1. Na página `/seu-plano`, clique em **[TESTE] Simular Pagamento Aprovado**
2. O sistema vai simular aprovação e gerar o PDF

## 🚢 Deploy (Recomendado: Vercel)

### 1. Push para GitHub
```bash
git init
git add .
git commit -m "Initial commit - Shape IA MVP"
git remote add origin <seu-repo>
git push -u origin main
```

### 2. Deploy na Vercel
1. Acesse: [https://vercel.com](https://vercel.com)
2. Importe o repositório
3. Configure as **Environment Variables** (cole o conteúdo do `.env`)
4. Deploy!

### 3. Atualize a variável
```env
NEXT_PUBLIC_BASE_URL=https://seu-dominio.vercel.app
```

## 📊 Fluxo do Usuário
**Banco de dados para controle de pagamentos**
- ✅ **Tokens únicos e impossíveis de adivinhar**
- ✅ **Validação antes de liberar PDF**
- ✅ Pagamento via Mercado Pago (PCI Compliant)
- ✅ **Webhook para confirmação automática**
1. **Landing (/)** → Quiz de 7 perguntas
2. **Loading** → 5-7 segundos de preparação
3. **Checkout (/seu-plano)** → Preview + Pagamento
4. **Aprovação** → Confetes + Geração do PDF
5. **Download** → Botão gigante de download

## 🔒 Segurança

- ✅ Variáveis sensíveis no `.env`
- ✅📚 Documentação Adicional

- [DATABASE.md](DATABASE.md) - Configuração completa do banco de dados
- [QUICKSTART.md](QUICKSTART.md) - Guia de início rápido
- [DEPLOY.md](DEPLOY.md) - Deploy na Vercel
- [CUSTOMIZATION.md](CUSTOMIZATION.md) - Personalização

##  API Keys protegidas no servidor
- ✅ Validação de dados no backend
- ✅ Pagamento via Mercado Pago (PCI Compliant)

## 📝 Licença

Este é um projeto educacional/comercial. Adapte conforme sua necessidade.

## 🤝 Suporte

Para dúvidas:
- Documentação OpenAI: [https://platform.openai.com/docs](https://platform.openai.com/docs)
- Documentação Mercado Pago: [https://www.mercadopago.com.br/developers](https://www.mercadopago.com.br/developers)
- Next.js Docs: [https://nextjs.org/docs](https://nextjs.org/docs)

---

**Desenvolvido com ❤️ usando Next.js + IA**

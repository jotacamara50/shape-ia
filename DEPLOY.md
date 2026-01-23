# 🚀 Guia de Deploy - Shape IA na Vercel

## Pré-requisitos
- [ ] Conta no GitHub
- [ ] Conta na Vercel (grátis)
- [ ] Chaves de API configuradas

## Passo a Passo

### 1. Preparar o Repositório

```bash
# Inicializar Git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "feat: Shape IA MVP completo"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/Shape IA.git
git branch -M main
git push -u origin main
```

### 2. Deploy na Vercel

1. **Acesse:** https://vercel.com
2. **Login** com GitHub
3. **Import Project** → Selecione o repositório `Shape IA`
4. **Configure:**
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. **Environment Variables** - Adicione:

```env
OPENAI_API_KEY=sk-sua-chave-real
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-sua-chave
MP_ACCESS_TOKEN=APP_USR-seu-token
NEXT_PUBLIC_PRODUCT_PRICE=27.90
NEXT_PUBLIC_BASE_URL=https://seu-projeto.vercel.app
```

6. **Deploy!** 🎉

### 3. Após o Deploy

1. **Copie a URL** gerada pela Vercel
2. **Atualize** a variável `NEXT_PUBLIC_BASE_URL` nas configurações da Vercel
3. **Redeploy** (vai atualizar automaticamente)

### 4. Configurar Mercado Pago para Produção

⚠️ **IMPORTANTE:** Use credenciais de PRODUÇÃO no deploy final!

1. Acesse o painel do Mercado Pago
2. Mude de "Teste" para "Produção"
3. Copie as novas credenciais
4. Atualize na Vercel:
   - `NEXT_PUBLIC_MP_PUBLIC_KEY` (Produção)
   - `MP_ACCESS_TOKEN` (Produção)

### 5. Domínio Personalizado (Opcional)

1. **Na Vercel:**
   - Settings → Domains
   - Add Domain: `seuplano.com.br`

2. **No seu provedor de domínio:**
   - Adicione os DNS Records fornecidos pela Vercel

3. **Aguarde propagação** (até 48h)

## 🔒 Segurança em Produção

### Checklist de Segurança:
- [ ] Todas as API Keys em variáveis de ambiente
- [ ] Mercado Pago em modo PRODUÇÃO
- [ ] HTTPS habilitado (Vercel faz automaticamente)
- [ ] `.env` no `.gitignore`
- [ ] Rate limiting nas APIs (considere adicionar)

## 📊 Monitoramento

### Analytics Recomendados:
- **Google Analytics 4**
- **Vercel Analytics** (já incluso)
- **Hotjar** (comportamento do usuário)

### Adicionar Google Analytics:

1. Crie uma propriedade GA4
2. Adicione ao `app/layout.tsx`:

```typescript
import Script from 'next/script'

// Dentro do <head>
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

## 🐛 Debugging em Produção

### Ver Logs:
1. Vercel Dashboard → Seu Projeto
2. Aba "Logs"
3. Filtre por erros

### Testar em Produção:
```bash
# Rodar build localmente
npm run build
npm run start
```

## 🔄 Atualizações Futuras

Para atualizar o site:
```bash
git add .
git commit -m "feat: nova funcionalidade"
git push
```

A Vercel faz deploy automático! 🎉

## 📈 Escala e Performance

### Se tiver muito tráfego:
- [ ] Considere upgrade do plano Vercel
- [ ] Implemente cache de respostas da IA
- [ ] Adicione CDN para assets
- [ ] Monitore custos da OpenAI API

## 💰 Custos Estimados

### Vercel:
- **Hobby (Grátis):** 100GB bandwidth/mês
- **Pro ($20/mês):** Bandwidth ilimitado

### OpenAI:
- **gpt-4o-mini:** ~$0.15 por 1M tokens input
- **Estimativa:** ~$0.01-0.03 por plano gerado
- **100 planos:** ~$2-3

### Mercado Pago:
- **Taxa:** 4.99% + R$0.49 por transação (PIX)
- **Em R$27,90:** você recebe ~R$26,00

## 🎯 Checklist Final de Deploy

- [ ] Código no GitHub
- [ ] Deploy na Vercel concluído
- [ ] Variáveis de ambiente configuradas
- [ ] Mercado Pago em modo produção
- [ ] Teste completo do fluxo
- [ ] Analytics configurado
- [ ] Domínio personalizado (opcional)
- [ ] Primeira venda testada! 🎉

---

**Parabéns! Seu MVP está no ar! 🚀**

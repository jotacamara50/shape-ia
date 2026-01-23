# 🚀 Guia de Início Rápido - Shape IA

## Passos para rodar o projeto

### 1️⃣ Instalar Dependências
```bash
npm install
```

### 2️⃣ Configurar Variáveis de Ambiente
Abra o arquivo `.env` e preencha:

```env
OPENAI_API_KEY=sk-sua-chave-aqui
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-sua-chave-publica
MP_ACCESS_TOKEN=APP_USR-seu-token

# Banco de dados (Vercel Postgres)
POSTGRES_URL=sua-url-aqui
POSTGRES_PRISMA_URL=sua-url-aqui
# ... outras variáveis
```

#### Como obter as chaves:

**OpenAI:**
- Acesse: https://platform.openai.com/api-keys
- Clique em "Create new secret key"
- Copie e cole no `.env`

**Mercado Pago:**
- Acesse: https://www.mercadopago.com.br/developers/panel
- Crie uma aplicação
- Vá em "Credenciais" e copie:
  - Public Key → NEXT_PUBLIC_MP_PUBLIC_KEY
  - Access Token → MP_ACCESS_TOKEN

**Vercel Postgres:**
- Leia [DATABASE.md](DATABASE.md) para instruções completas
- Crie um banco gratuito na Vercel
- Copie as variáveis geradas automaticamente

### 3️⃣ Rodar o Projeto
```bash
npm run dev
```

### 4️⃣ Inicializar Banco de Dados

Acesse no navegador: **http://localhost:3000/api/init-db**

✅ Deve retornar: `{"success": true}`

Abra: **http://localhost:3000**
**Digite um email** (obrigatório agora!)
   - Para testar SEM pagamento real: clique em "[TESTE] Simular Pagamento Aprovado"
   - Para testar COM pagamento real: clique em "DESBLOQUEAR MEU PLANO"
4. **Aguarde a confirmação** (webhook processa automaticamente)
5
1. **Preencha o Quiz** (7 perguntas)
2. **Aguarde o Loading** (5-7 segundos)
3. **Na página de checkout:**
   - Para testar SEM pagamento real: clique em "[TESTE] Simular Pagamento Aprovado"
   - Para testar COM pagamento real: clique em "DESBLOQUEAR MEU PLANO"
4. **Baixe o PDF** gerado

## 📝 Checklist de Configuração

- [ ] Node.js 18+ instaladochaves (OpenAI, MP, Postgres)
- [ ] Banco de dados criado na Vercel
- [ ] Tabelas criadas (`/api/init-db`)
- [ ] Projeto rodando (`npm run dev`)
- [ ] Quiz funcional
- [ ] Email sendo solicitado no checkout
- [ ] Integração com IA testada
- [ ] Pagamento de teste funcionando
- [ ] PDF sendo gerado e validl
- [ ] Integração com IA testada
- [ ] PDF sendo gerado

## ⚠️ Problemas Comuns

### Erro: "OPENAI_API_KEY não configurada"
✅ Verifique se você configurou a chave no arquivo `.env`

### Erro: "Mercado Pago não configurado"
✅ Certifique-se de ter as duas chaves do Mercado Pago no `.env`

### PDF não está gerando
✅ Verifique se a API OpenAI está respondendo (veja o console)
✅ Verifique se você tem créditos na OpenAI

### Pagamento não está funcionando
✅ Use o botão de TESTE para simular
✅ Verifique se as credenciais do Mercado Pago estão corretas
✅ Em produção, use credenciais de produção (não teste)

## 🎯 Próximos Passos

1. **Personalizar:** Altere cores, textos e preço conforme sua necessidade
2. **Deploy:** Faça deploy na Vercel (grátis)
3. **Domínio:** Configure um domínio personalizado
4. **Analytics:** Adicione Google Analytics ou similar
5. **Email:** Configure envio de email com Resend ou Nodemailer

## 📞 Suporte

Documentações oficiais:
- **Next.js:** https://nextjs.org/docs
- **OpenAI:** https://platform.openai.com/docs
- **Mercado Pago:** https://www.mercadopago.com.br/developers/pt/docs

---

**Bom desenvolvimento! 🚀**

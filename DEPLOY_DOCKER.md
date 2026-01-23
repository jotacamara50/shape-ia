# 🚀 Deploy em Produção - Shape IA

## Pré-requisitos no Servidor

- Docker e Docker Compose instalados
- Domínio `shapeia.com.br` apontando para o servidor (A record)
- Portas 80 e 443 abertas no firewall

## Passo a Passo

### 1. Clone o repositório no servidor

```bash
git clone https://github.com/jotacamara50/shape-ia.git
cd shape-ia
```

### 2. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.production.example .env.production

# Edite com suas credenciais REAIS
nano .env.production
```

**Variáveis obrigatórias:**

```env
# OpenAI
OPENAI_API_KEY=sk-proj-SEU-TOKEN-REAL

# Mercado Pago PRODUÇÃO (não use TEST-)
NEXT_PUBLIC_MP_PUBLIC_KEY=APP_USR-seu-public-key-producao
MP_ACCESS_TOKEN=APP_USR-seu-access-token-producao

# Database
POSTGRES_PASSWORD=senha-super-segura-aqui

# Preço
NEXT_PUBLIC_PRODUCT_PRICE=27.90
```

### 3. Execute o deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

### 4. Inicialize o banco de dados

**IMPORTANTE:** Após o primeiro deploy, acesse uma única vez:

```
https://shapeia.com.br/api/init-db
```

Você verá: `{"message":"Database initialized successfully"}`

### 5. Remova as rotas de teste (PRODUÇÃO)

Antes de colocar no ar, delete estes arquivos:

```bash
rm app/api/create-order-test/route.ts
rm app/api/mark-as-paid-test/route.ts
```

E remova o botão de teste de `components/CheckoutSection.tsx`.

Depois, faça commit e deploy novamente:

```bash
git add .
git commit -m "Remove test routes for production"
git push origin main
./deploy.sh
```

## Comandos Úteis

### Ver logs em tempo real
```bash
docker-compose logs -f app
```

### Ver logs do PostgreSQL
```bash
docker-compose logs -f postgres
```

### Reiniciar apenas a aplicação
```bash
docker-compose restart app
```

### Parar tudo
```bash
docker-compose down
```

### Atualizar após mudanças no código
```bash
git pull origin main
docker-compose build app
docker-compose up -d app
```

## Certificado SSL (Let's Encrypt)

O certificado SSL é configurado automaticamente pelo `acme-companion`.

- Primeiro acesso pode demorar 1-2 minutos para gerar o certificado
- Renovação automática a cada 60 dias
- Certificados ficam em `./data/nginx/certs/`

## Backup do Banco de Dados

### Criar backup
```bash
docker exec shapeia-postgres pg_dump -U postgres shapeia > backup_$(date +%Y%m%d).sql
```

### Restaurar backup
```bash
docker exec -i shapeia-postgres psql -U postgres shapeia < backup_20260123.sql
```

## Troubleshooting

### Site não abre (erro SSL)
- Aguarde 2 minutos para o Let's Encrypt gerar o certificado
- Verifique se o DNS está configurado corretamente
- Veja logs: `docker-compose logs acme-companion`

### Erro de conexão com banco
- Verifique: `docker-compose logs postgres`
- Confirme que inicializou o banco em `/api/init-db`

### Pagamento não funciona
- Verifique se usou credenciais de PRODUÇÃO (não pode ter `TEST-`)
- Configure webhook no painel do Mercado Pago: `https://shapeia.com.br/api/webhooks/mercadopago`

## Monitoramento

### Verificar containers rodando
```bash
docker-compose ps
```

### Uso de recursos
```bash
docker stats
```

### Espaço em disco
```bash
df -h
du -sh ./data/
```

## Estrutura de Dados

```
./data/
├── nginx/
│   ├── certs/          # Certificados SSL
│   ├── vhost.d/        # Configurações de virtual hosts
│   ├── html/           # Arquivos estáticos do nginx
│   └── acme/           # Dados do ACME (Let's Encrypt)
└── postgres/           # Dados do PostgreSQL (via volume)
```

## Segurança

✅ **Checklist de segurança:**

- [ ] `.env` e `.env.production` no `.gitignore`
- [ ] Credenciais de PRODUÇÃO no Mercado Pago
- [ ] Senha forte no PostgreSQL
- [ ] Rotas de teste removidas
- [ ] Firewall configurado (apenas 80, 443, 22)
- [ ] SSL/HTTPS funcionando
- [ ] Backup automático configurado

## URLs Importantes

- **Site:** https://shapeia.com.br
- **Webhook MP:** https://shapeia.com.br/api/webhooks/mercadopago
- **Init DB:** https://shapeia.com.br/api/init-db (usar apenas uma vez)

#!/bin/bash

# Script de deploy para Shape IA
# Executar no servidor de produção

set -e

echo "🚀 Iniciando deploy do Shape IA..."

# 1. Verificar se as variáveis de ambiente estão configuradas
if [ ! -f .env.production ]; then
    echo "❌ Erro: Arquivo .env.production não encontrado!"
    echo "📝 Copie .env.production.example para .env.production e configure as variáveis."
    exit 1
fi

# 2. Carregar variáveis de ambiente
export $(cat .env.production | grep -v '^#' | xargs)

# 3. Parar containers antigos (se existirem)
echo "🛑 Parando containers antigos..."
docker-compose down || true

# 4. Fazer pull da última versão do código
echo "📦 Atualizando código..."
git pull origin main

# 5. Build das imagens
echo "🔨 Construindo imagens Docker..."
docker-compose build --no-cache

# 6. Iniciar serviços
echo "▶️  Iniciando serviços..."
docker-compose up -d

# 7. Aguardar PostgreSQL ficar pronto
echo "⏳ Aguardando PostgreSQL inicializar..."
sleep 10

# 8. Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose ps

# 9. Mostrar logs
echo ""
echo "✅ Deploy concluído!"
echo ""
echo "📋 Para ver os logs em tempo real:"
echo "   docker-compose logs -f app"
echo ""
echo "🌐 Acesse: https://shapeia.com.br"
echo ""
echo "⚠️  IMPORTANTE: Após o primeiro deploy, acesse:"
echo "   https://shapeia.com.br/api/init-db"
echo "   Para inicializar as tabelas do banco de dados."

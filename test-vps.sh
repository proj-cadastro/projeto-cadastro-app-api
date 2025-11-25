#!/bin/bash

echo "🚀 CONFIGURADOR DE TESTES VPS"
echo "=============================="
echo ""

# Verificar se .env.vps existe
if [ ! -f ".env.vps" ]; then
    echo "❌ Arquivo .env.vps não encontrado!"
    echo "   Criando arquivo de configuração..."
    cat > .env.vps << EOL
# URL da sua VPS (substitua pelo IP ou domínio real)
VPS_URL=http://localhost:3000
EOL
fi

echo "📝 Configuração atual:"
cat .env.vps
echo ""

read -p "🔧 Deseja alterar a URL da VPS? (s/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo "📋 Exemplos de URLs:"
    echo "   • http://192.168.1.100:3000 (IP local)"
    echo "   • http://123.456.789.10:3000 (IP público)"
    echo "   • https://minha-api.herokuapp.com (Heroku)"
    echo "   • https://api.meudominio.com.br (Domínio próprio)"
    echo ""
    
    read -p "🌐 Digite a URL completa da sua VPS: " vps_url
    
    if [ ! -z "$vps_url" ]; then
        echo "VPS_URL=$vps_url" > .env.vps
        echo "✅ Configuração salva!"
    fi
fi

echo ""
echo "🧪 Executando testes de performance na VPS..."
echo "⏱️  Isso pode demorar alguns minutos..."
echo ""

# Executar os testes carregando as variáveis
source .env.vps && npm run test:vps-direct

echo ""
echo "✅ Testes concluídos!"
echo "📊 Verifique os resultados acima para apresentar ao professor."
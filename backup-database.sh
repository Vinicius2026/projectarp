#!/bin/bash

# ============================================
# SCRIPT DE BACKUP DO BANCO DE DADOS SUPABASE
# ============================================

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}============================================"
echo "BACKUP DO BANCO DE DADOS SUPABASE"
echo "============================================${NC}"

# Verificar se pg_dump está instalado
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}ERRO: pg_dump não encontrado!${NC}"
    echo ""
    echo "Por favor, instale o PostgreSQL Client:"
    echo ""
    echo "Windows (usando Chocolatey):"
    echo "  choco install postgresql"
    echo ""
    echo "Windows (usando winget):"
    echo "  winget install PostgreSQL.PostgreSQL"
    echo ""
    echo "macOS (usando Homebrew):"
    echo "  brew install postgresql"
    echo ""
    echo "Linux (Ubuntu/Debian):"
    echo "  sudo apt-get install postgresql-client"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ pg_dump encontrado${NC}"
echo ""

# Solicitar credenciais
echo "Por favor, insira as informações de conexão do Supabase:"
echo ""
read -p "Host (ex: aws-0-sa-east-1.pooler.supabase.com): " DB_HOST
read -p "Porta (padrão: 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "Usuário (padrão: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}
read -sp "Senha: " DB_PASSWORD
echo ""
read -p "Nome do banco (padrão: postgres): " DB_NAME
DB_NAME=${DB_NAME:-postgres}

# Criar diretório de backups se não existir
BACKUP_DIR="backups"
mkdir -p "$BACKUP_DIR"

# Data e hora para nome do arquivo
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_completo_$TIMESTAMP.sql"

echo ""
echo -e "${YELLOW}Iniciando backup...${NC}"

# Construir string de conexão
CONNECTION_STRING="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Executar backup
if pg_dump --dbname="$CONNECTION_STRING" --file="$BACKUP_FILE" --verbose; then
    # Obter tamanho do arquivo
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    
    echo ""
    echo -e "${GREEN}============================================"
    echo "✓ BACKUP CONCLUÍDO COM SUCESSO!"
    echo "============================================${NC}"
    echo ""
    echo "Arquivo: $BACKUP_FILE"
    echo "Tamanho: $FILE_SIZE"
    echo ""
    echo -e "${YELLOW}Dica: Mantenha este arquivo em local seguro!${NC}"
else
    echo ""
    echo -e "${RED}============================================"
    echo "✗ ERRO AO FAZER BACKUP"
    echo "============================================${NC}"
    echo ""
    echo "Verifique:"
    echo "1. Se as credenciais estão corretas"
    echo "2. Se você tem acesso à internet"
    echo "3. Se o banco de dados está acessível"
    exit 1
fi


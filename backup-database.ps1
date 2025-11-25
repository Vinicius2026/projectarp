# ============================================
# SCRIPT DE BACKUP DO BANCO DE DADOS SUPABASE (PowerShell)
# ============================================

Write-Host "============================================" -ForegroundColor Yellow
Write-Host "BACKUP DO BANCO DE DADOS SUPABASE" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow
Write-Host ""

# Verificar se pg_dump está instalado
$pgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
if (-not $pgDumpPath) {
    Write-Host "ERRO: pg_dump não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale o PostgreSQL Client:"
    Write-Host ""
    Write-Host "Usando Chocolatey:"
    Write-Host "  choco install postgresql"
    Write-Host ""
    Write-Host "Usando winget:"
    Write-Host "  winget install PostgreSQL.PostgreSQL"
    Write-Host ""
    Write-Host "Ou baixe em: https://www.postgresql.org/download/windows/"
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "[OK] pg_dump encontrado" -ForegroundColor Green
Write-Host ""

# Solicitar credenciais
$DB_HOST = Read-Host "Host (ex: aws-0-sa-east-1.pooler.supabase.com)"
$DB_PORT = Read-Host "Porta (padrão: 5432)"
if ([string]::IsNullOrWhiteSpace($DB_PORT)) { $DB_PORT = "5432" }
$DB_USER = Read-Host "Usuário (padrão: postgres)"
if ([string]::IsNullOrWhiteSpace($DB_USER)) { $DB_USER = "postgres" }
$DB_PASSWORD = Read-Host "Senha" -AsSecureString
$DB_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($DB_PASSWORD)
)
$DB_NAME = Read-Host "Nome do banco (padrão: postgres)"
if ([string]::IsNullOrWhiteSpace($DB_NAME)) { $DB_NAME = "postgres" }

# Criar diretório de backups se não existir
$BACKUP_DIR = "backups"
if (-not (Test-Path $BACKUP_DIR)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR | Out-Null
}

# Data e hora para nome do arquivo
$TIMESTAMP = Get-Date -Format "yyyyMMdd_HHmmss"
$BACKUP_FILE = Join-Path $BACKUP_DIR "backup_completo_$TIMESTAMP.sql"

Write-Host ""
Write-Host "Iniciando backup..." -ForegroundColor Yellow
Write-Host ""

# Construir string de conexão
$CONNECTION_STRING = "postgresql://${DB_USER}:${DB_PASSWORD_PLAIN}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

# Executar backup
try {
    & pg_dump --dbname="$CONNECTION_STRING" --file="$BACKUP_FILE" --verbose
    
    if ($LASTEXITCODE -eq 0) {
        # Obter tamanho do arquivo
        $FILE_SIZE = (Get-Item $BACKUP_FILE).Length / 1MB
        $FILE_SIZE_FORMATTED = "{0:N2} MB" -f $FILE_SIZE
        
        Write-Host ""
        Write-Host "============================================" -ForegroundColor Green
        Write-Host "[OK] BACKUP CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
        Write-Host "============================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Arquivo: $BACKUP_FILE"
        Write-Host "Tamanho: $FILE_SIZE_FORMATTED"
        Write-Host ""
        Write-Host "Dica: Mantenha este arquivo em local seguro!" -ForegroundColor Yellow
    } else {
        throw "Erro ao executar pg_dump"
    }
} catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "[ERRO] FALHA AO FAZER BACKUP" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique:"
    Write-Host "1. Se as credenciais estão corretas"
    Write-Host "2. Se você tem acesso à internet"
    Write-Host "3. Se o banco de dados está acessível"
    Write-Host ""
    Write-Host "Erro: $_" -ForegroundColor Red
}

Write-Host ""
Read-Host "Pressione Enter para sair"


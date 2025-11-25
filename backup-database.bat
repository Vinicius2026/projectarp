@echo off
REM ============================================
REM SCRIPT DE BACKUP DO BANCO DE DADOS SUPABASE (Windows)
REM ============================================

echo ============================================
echo BACKUP DO BANCO DE DADOS SUPABASE
echo ============================================
echo.

REM Verificar se pg_dump está instalado
where pg_dump >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: pg_dump nao encontrado!
    echo.
    echo Por favor, instale o PostgreSQL Client:
    echo.
    echo Usando Chocolatey:
    echo   choco install postgresql
    echo.
    echo Usando winget:
    echo   winget install PostgreSQL.PostgreSQL
    echo.
    echo Ou baixe em: https://www.postgresql.org/download/windows/
    echo.
    pause
    exit /b 1
)

echo [OK] pg_dump encontrado
echo.

REM Solicitar credenciais
set /p DB_HOST="Host (ex: aws-0-sa-east-1.pooler.supabase.com): "
set /p DB_PORT="Porta (padrao: 5432): "
if "%DB_PORT%"=="" set DB_PORT=5432
set /p DB_USER="Usuario (padrao: postgres): "
if "%DB_USER%"=="" set DB_USER=postgres
set /p DB_PASSWORD="Senha: "
set /p DB_NAME="Nome do banco (padrao: postgres): "
if "%DB_NAME%"=="" set DB_NAME=postgres

REM Criar diretório de backups se não existir
if not exist "backups" mkdir backups

REM Data e hora para nome do arquivo
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%
set BACKUP_FILE=backups\backup_completo_%TIMESTAMP%.sql

echo.
echo Iniciando backup...
echo.

REM Construir string de conexão e executar backup
set CONNECTION_STRING=postgresql://%DB_USER%:%DB_PASSWORD%@%DB_HOST%:%DB_PORT%/%DB_NAME%

pg_dump --dbname="%CONNECTION_STRING%" --file="%BACKUP_FILE%" --verbose

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo [OK] BACKUP CONCLUIDO COM SUCESSO!
    echo ============================================
    echo.
    echo Arquivo: %BACKUP_FILE%
    echo.
    echo Dica: Mantenha este arquivo em local seguro!
) else (
    echo.
    echo ============================================
    echo [ERRO] FALHA AO FAZER BACKUP
    echo ============================================
    echo.
    echo Verifique:
    echo 1. Se as credenciais estao corretas
    echo 2. Se voce tem acesso a internet
    echo 3. Se o banco de dados esta acessivel
)

echo.
pause


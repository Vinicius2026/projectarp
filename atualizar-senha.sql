-- ============================================
-- ATUALIZAR SENHA DE USUÁRIO NO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- IMPORTANTE: As senhas no Supabase são criptografadas.
-- Para atualizar, você precisa usar a função auth.update_user_by_id()
-- ou fazer pelo painel do Supabase.

-- ============================================
-- MÉTODO 1: Via Painel do Supabase (RECOMENDADO)
-- ============================================
-- 1. Vá em Authentication > Users
-- 2. Clique no usuário que deseja atualizar
-- 3. Clique em "Update user" ou nos três pontos
-- 4. Escolha "Send password reset email" ou "Update password"
-- 5. Digite a nova senha e confirme

-- ============================================
-- MÉTODO 2: Enviar Email de Recuperação (RECOMENDADO)
-- ============================================
-- Use o Supabase Management API ou a função:
-- supabase.auth.resetPasswordForEmail('email@example.com')

-- ============================================
-- MÉTODO 3: Via SQL (NÃO RECOMENDADO - Use apenas em desenvolvimento)
-- ============================================
-- ATENÇÃO: Isso requer acesso direto ao banco e conhecimento de criptografia.
-- O Supabase usa bcrypt para hashear senhas, então não é simples fazer via SQL.

-- Para desenvolvimento/testes, use o painel ou a API:

-- Buscar informações do usuário
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'ovinibeni@gmail.com';

-- ============================================
-- MÉTODO 4: Via Supabase Client (JavaScript/TypeScript)
-- ============================================
-- No seu código, use:
-- 
-- const { data, error } = await supabase.auth.admin.updateUserById(
--   'user-id-here',
--   { password: 'nova-senha-123' }
-- )

-- ============================================
-- VERIFICAR USUÁRIO
-- ============================================
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  p.full_name,
  p.role
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'ovinibeni@gmail.com';


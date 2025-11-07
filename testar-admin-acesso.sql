-- ============================================
-- TESTAR ACESSO ADMIN
-- Execute este script para verificar se as políticas estão corretas
-- ============================================

-- 1. Verificar se o usuário existe e é admin
SELECT 
  p.id,
  p.full_name,
  p.role,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE au.email = 'ovinibeni@gmail.com';

-- 2. Verificar políticas RLS na tabela profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';

-- 3. Verificar se RLS está habilitado
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 4. Testar se a política permite leitura do próprio perfil
-- (Isso deve funcionar se você estiver logado como ovinibeni@gmail.com)
SELECT * FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'ovinibeni@gmail.com'
);


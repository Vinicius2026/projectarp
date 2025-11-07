-- ============================================
-- CRIAR NOVO ADMINISTRADOR
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- ============================================
-- PASSO 1: VERIFICAR SE O USUÁRIO EXISTE
-- ============================================
-- Primeiro, vamos verificar se o usuário já existe no sistema:

SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at,
  p.full_name,
  p.role,
  p.plan_type
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email = 'NOVO_ADMIN@email.com'; -- ← SUBSTITUA PELO EMAIL DO NOVO ADMIN

-- ============================================
-- PASSO 2: CRIAR ADMIN (ESCOLHA UMA OPÇÃO)
-- ============================================

-- OPÇÃO A: Se o usuário JÁ EXISTE (tem conta e perfil)
-- Apenas atualizar o role para 'admin'
DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT := 'NOVO_ADMIN@email.com'; -- ← SUBSTITUA PELO EMAIL
BEGIN
  -- Buscar o ID do usuário pelo email
  SELECT au.id INTO v_user_id
  FROM auth.users au
  WHERE au.email = v_user_email
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Verificar se o perfil existe
    IF EXISTS (SELECT 1 FROM profiles WHERE id = v_user_id) THEN
      -- Atualizar role para admin
      UPDATE profiles 
      SET role = 'admin' 
      WHERE id = v_user_id;
      
      RAISE NOTICE '✅ Usuário % agora é admin!', v_user_email;
    ELSE
      -- Criar perfil se não existir
      INSERT INTO profiles (id, full_name, plan_type, role)
      VALUES (v_user_id, 'Administrador', 'Premium', 'admin');
      
      RAISE NOTICE '✅ Perfil criado e usuário % agora é admin!', v_user_email;
    END IF;
  ELSE
    RAISE NOTICE '❌ Usuário com email % não encontrado.', v_user_email;
    RAISE NOTICE '💡 Primeiro crie o usuário em: Authentication > Users > Add user';
  END IF;
END $$;

-- OPÇÃO B: Criar usuário completo do zero (requer informações do usuário)
-- Execute isso apenas se você souber o ID do usuário
-- Você pode pegar o ID em Authentication > Users após criar o usuário

-- DO $$
-- DECLARE
--   v_user_id UUID := 'COLE_O_ID_DO_USUARIO_AQUI'; -- ← COLE O ID AQUI
-- BEGIN
--   -- Criar ou atualizar perfil como admin
--   INSERT INTO profiles (id, full_name, plan_type, role)
--   VALUES (v_user_id, 'Nome do Admin', 'Premium', 'admin')
--   ON CONFLICT (id) DO UPDATE
--   SET role = 'admin';
--   
--   RAISE NOTICE '✅ Admin criado/atualizado com sucesso!';
-- END $$;

-- ============================================
-- PASSO 3: VERIFICAR SE FOI CRIADO
-- ============================================
-- Execute esta query para ver todos os admins:

SELECT 
  p.id,
  p.full_name,
  p.role,
  p.plan_type,
  au.email,
  au.created_at,
  au.email_confirmed_at
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.role = 'admin'
ORDER BY au.created_at DESC;

-- ============================================
-- PASSO 4: REMOVER ADMIN (SE NECESSÁRIO)
-- ============================================
-- Para remover privilégios de admin (tornar usuário comum):

-- DO $$
-- DECLARE
--   v_user_email TEXT := 'email@exemplo.com'; -- ← Email do admin a remover
-- BEGIN
--   UPDATE profiles 
--   SET role = 'user' 
--   WHERE id IN (
--     SELECT id FROM auth.users WHERE email = v_user_email
--   );
--   
--   RAISE NOTICE '✅ Privilégios de admin removidos para %', v_user_email;
-- END $$;

-- ============================================
-- INSTRUÇÕES COMPLETAS
-- ============================================
-- 
-- 1️⃣ PRIMEIRO: Crie o usuário no Supabase
--    - Vá em Authentication > Users
--    - Clique em "Add user" > "Create new user"
--    - Preencha email e senha
--    - Clique em "Create user"
--
-- 2️⃣ DEPOIS: Execute este script SQL
--    - Abra o SQL Editor no Supabase
--    - Substitua 'NOVO_ADMIN@email.com' pelo email do novo admin
--    - Execute o bloco DO $$ (OPÇÃO A)
--
-- 3️⃣ VERIFICAR: Execute a query do PASSO 3
--    - Veja se o novo admin aparece na lista
--
-- 4️⃣ TESTAR: Faça logout e login com o novo admin
--    - Acesse /admin/dashboard
--    - Deve funcionar normalmente!
--
-- ============================================


-- ============================================
-- TORNAR USUÁRIO ADMIN
-- Execute este script no SQL Editor do Supabase
-- ============================================
--
-- INSTRUÇÕES:
-- 1. Substitua 'EMAIL_DO_USUARIO@exemplo.com' pelo email do usuário que deseja tornar admin
-- 2. Se o usuário não existir, crie primeiro em Authentication > Users
-- 3. Execute este script no SQL Editor do Supabase
-- ============================================

-- ⚙️ CONFIGURAÇÃO: Substitua o email abaixo
DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT := 'EMAIL_DO_USUARIO@exemplo.com'; -- ← SUBSTITUA AQUI
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
      UPDATE profiles SET role = 'admin' WHERE id = v_user_id;
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

-- Verificar se foi criado/atualizado
SELECT 
  p.id,
  p.full_name,
  p.role,
  p.plan_type,
  au.email,
  au.created_at
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE au.email = 'EMAIL_DO_USUARIO@exemplo.com'; -- ← SUBSTITUA AQUI TAMBÉM

-- Listar todos os admins
SELECT 
  p.id,
  p.full_name,
  p.role,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.role = 'admin'
ORDER BY au.created_at DESC;


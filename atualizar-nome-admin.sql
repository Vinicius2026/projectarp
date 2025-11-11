-- ============================================
-- ATUALIZAR NOME DO ADMIN PARA "Pedro Bertotto"
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Atualizar o nome do usuário admin para "Pedro Bertotto"
-- Substitua 'EMAIL_DO_ADMIN@exemplo.com' pelo email do admin atual
DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT := 'EMAIL_DO_ADMIN@exemplo.com'; -- ← SUBSTITUA PELO EMAIL DO ADMIN
BEGIN
  -- Buscar o ID do usuário pelo email
  SELECT au.id INTO v_user_id
  FROM auth.users au
  WHERE au.email = v_user_email
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Atualizar o nome do perfil
    UPDATE profiles 
    SET full_name = 'Pedro Bertotto'
    WHERE id = v_user_id;
    
    RAISE NOTICE '✅ Nome atualizado para "Pedro Bertotto"!';
  ELSE
    RAISE NOTICE '❌ Usuário com email % não encontrado.', v_user_email;
  END IF;
END $$;

-- Verificar se foi atualizado
SELECT 
  p.id,
  p.full_name,
  p.role,
  p.plan_type,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.role = 'admin'
ORDER BY au.created_at DESC;


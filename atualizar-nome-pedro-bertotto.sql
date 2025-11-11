-- ============================================
-- ATUALIZAR NOME DO ADMIN PARA "Pedro Bertotto"
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- MÉTODO MAIS SIMPLES: Atualizar todos os admins de uma vez
UPDATE profiles 
SET full_name = 'Pedro Bertotto' 
WHERE role = 'admin';

-- OU se quiser atualizar apenas um admin específico pelo email:
-- Substitua 'SEU_EMAIL@exemplo.com' pelo email do admin
/*
DO $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT := 'SEU_EMAIL@exemplo.com'; -- ← SUBSTITUA AQUI
BEGIN
  SELECT au.id INTO v_user_id
  FROM auth.users au
  WHERE au.email = v_user_email
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    UPDATE profiles 
    SET full_name = 'Pedro Bertotto'
    WHERE id = v_user_id;
    
    RAISE NOTICE '✅ Nome atualizado para "Pedro Bertotto"!';
  ELSE
    RAISE NOTICE '❌ Usuário não encontrado.';
  END IF;
END $$;
*/

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


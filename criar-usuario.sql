-- ============================================
-- SCRIPT PARA CRIAR PERFIL DE USUÁRIO
-- ============================================

-- 1. PRIMEIRO: Vá em Authentication > Users no Supabase
--    e COPIE o ID (UUID) do usuário teste@example.com

-- 2. DEPOIS: Cole o ID abaixo e execute este script

-- Substitua 'COLE_O_ID_DO_USUARIO_AQUI' pelo ID real
DO $$
DECLARE
  v_user_id UUID := 'COLE_O_ID_DO_USUARIO_AQUI'; -- ← COLE O ID AQUI
BEGIN
  -- Deletar perfil anterior se existir
  DELETE FROM profiles WHERE id = v_user_id;
  
  -- Criar novo perfil
  INSERT INTO profiles (id, full_name, plan_type) 
  VALUES (v_user_id, 'Usuário Teste', 'Premium');
  
  RAISE NOTICE 'Perfil criado com sucesso para o usuário: %', v_user_id;
END $$;

-- Verificar se foi criado
SELECT * FROM profiles;


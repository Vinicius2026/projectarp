-- ============================================
-- ADICIONAR CAMPOS AO PERFIL (BIO, FATURADO, UNIDADES VENDIDAS)
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Adicionar coluna bio (biografia do usuário)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Adicionar coluna total_revenue (total faturado)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_revenue NUMERIC(12, 2) DEFAULT 0;

-- Adicionar coluna total_units_sold (total de unidades vendidas)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_units_sold INTEGER DEFAULT 0;

-- Atualizar dados mockados para o admin (substitua o email)
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
    -- Atualizar dados do perfil
    UPDATE profiles 
    SET 
      bio = '❤️‍🔥 Jesus @pedrobertotto',
      total_revenue = 1402294.39,
      total_units_sold = 54908
    WHERE id = v_user_id;
    
    RAISE NOTICE '✅ Dados do perfil atualizados!';
  ELSE
    RAISE NOTICE '❌ Usuário com email % não encontrado.', v_user_email;
  END IF;
END $$;

-- Verificar se foi atualizado
SELECT 
  p.id,
  p.full_name,
  p.bio,
  p.total_revenue,
  p.total_units_sold,
  p.role,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.role = 'admin'
ORDER BY au.created_at DESC;


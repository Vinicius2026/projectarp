-- ============================================
-- CORRIGIR POLÍTICAS RLS PARA PERMITIR LEITURA DO PRÓPRIO PERFIL
-- Execute este script no Supabase SQL Editor
-- ============================================

-- Remover política antiga se existir
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON profiles;

-- Criar política que permite que o próprio usuário veja seu perfil
-- Isso é necessário para o middleware e páginas funcionarem
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Verificar se a política foi criada
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles' AND policyname = 'Usuários podem ver seu próprio perfil';

-- Testar se funciona (substitua pelo ID do seu usuário)
-- SELECT * FROM profiles WHERE id = auth.uid();


-- ============================================
-- PLACE APP - SETUP ADMINISTRATIVO
-- Execute este script DEPOIS do supabase-setup.sql
-- ============================================

-- ============================================
-- 1. ADICIONAR COLUNA DE ROLE (ADMIN/USER)
-- ============================================

-- Adicionar coluna role na tabela profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Atualizar políticas RLS para profiles
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON profiles;

-- Nova política: usuários veem seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Nova política: usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 2. POLÍTICAS PARA ADMINS
-- ============================================

-- Remover políticas antigas se existirem (para poder executar múltiplas vezes)
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Admins podem criar áreas" ON areas;
DROP POLICY IF EXISTS "Admins podem atualizar áreas" ON areas;
DROP POLICY IF EXISTS "Admins podem deletar áreas" ON areas;
DROP POLICY IF EXISTS "Admins podem criar módulos" ON modules;
DROP POLICY IF EXISTS "Admins podem atualizar módulos" ON modules;
DROP POLICY IF EXISTS "Admins podem deletar módulos" ON modules;
DROP POLICY IF EXISTS "Admins podem criar aulas" ON lessons;
DROP POLICY IF EXISTS "Admins podem atualizar aulas" ON lessons;
DROP POLICY IF EXISTS "Admins podem deletar aulas" ON lessons;
DROP POLICY IF EXISTS "Admins podem criar links" ON lesson_links;
DROP POLICY IF EXISTS "Admins podem atualizar links" ON lesson_links;
DROP POLICY IF EXISTS "Admins podem deletar links" ON lesson_links;

-- (REMOVIDO) Policy que causava recursão em profiles

-- Admins podem criar áreas
CREATE POLICY "Admins podem criar áreas"
  ON areas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar áreas
CREATE POLICY "Admins podem atualizar áreas"
  ON areas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem deletar áreas
CREATE POLICY "Admins podem deletar áreas"
  ON areas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem criar módulos
CREATE POLICY "Admins podem criar módulos"
  ON modules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar módulos
CREATE POLICY "Admins podem atualizar módulos"
  ON modules FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem deletar módulos
CREATE POLICY "Admins podem deletar módulos"
  ON modules FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem criar aulas
CREATE POLICY "Admins podem criar aulas"
  ON lessons FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar aulas
CREATE POLICY "Admins podem atualizar aulas"
  ON lessons FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem deletar aulas
CREATE POLICY "Admins podem deletar aulas"
  ON lessons FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem criar links
CREATE POLICY "Admins podem criar links"
  ON lesson_links FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem atualizar links
CREATE POLICY "Admins podem atualizar links"
  ON lesson_links FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins podem deletar links
CREATE POLICY "Admins podem deletar links"
  ON lesson_links FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 3. ADICIONAR ORDEM NAS AULAS
-- ============================================

-- Adicionar coluna order nas aulas (para ordenação)
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS "order" INT DEFAULT 0;

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons("order");

-- Adicionar coluna de duração (segundos) nas aulas
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS duration_seconds INT;
CREATE INDEX IF NOT EXISTS idx_lessons_duration ON lessons(duration_seconds);

-- ============================================
-- 4. CRIAR BUCKET DE STORAGE PARA THUMBNAILS
-- ============================================

-- IMPORTANTE: Execute este comando no SQL Editor:
-- Este comando cria um bucket público para imagens

-- Verificar se o bucket já existe antes de criar
INSERT INTO storage.buckets (id, name, public)
VALUES ('module-thumbnails', 'module-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Remover políticas de storage antigas se existirem
DROP POLICY IF EXISTS "Todos podem ver thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem fazer upload de thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins podem deletar thumbnails" ON storage.objects;

-- Política de storage: todos podem ler
CREATE POLICY "Todos podem ver thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'module-thumbnails');

-- Política de storage: admins podem fazer upload
CREATE POLICY "Admins podem fazer upload de thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'module-thumbnails' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política de storage: admins podem deletar
CREATE POLICY "Admins podem deletar thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'module-thumbnails' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 5. FUNÇÕES AUXILIARES
-- ============================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. CRIAR USUÁRIO ADMIN PADRÃO
-- ============================================

-- ATENÇÃO: Substitua o ID pelo ID do seu usuário atual
-- Você pode pegar o ID em Authentication > Users

-- Exemplo de como tornar um usuário admin:
-- UPDATE profiles SET role = 'admin' WHERE id = 'SEU_USER_ID_AQUI';

-- Ou execute este bloco após substituir o email:
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Buscar o ID do usuário pelo email
  SELECT au.id INTO v_user_id
  FROM auth.users au
  WHERE au.email = 'teste@example.com' -- ← SUBSTITUA PELO SEU EMAIL
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Atualizar role para admin
    UPDATE profiles SET role = 'admin' WHERE id = v_user_id;
    RAISE NOTICE 'Usuário % agora é admin!', v_user_id;
  ELSE
    RAISE NOTICE 'Usuário não encontrado. Crie o perfil primeiro.';
  END IF;
END $$;

-- ============================================
-- 7. VERIFICAÇÕES FINAIS
-- ============================================

-- Verificar admins cadastrados
SELECT 
  p.id,
  p.full_name,
  p.role,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.role = 'admin';

-- Verificar estrutura das tabelas
SELECT 
  'Profiles' as tabela, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 
  'Áreas criadas: ' || COUNT(*) as info 
FROM areas
UNION ALL
SELECT 
  'Módulos criados: ' || COUNT(*) 
FROM modules
UNION ALL
SELECT 
  'Aulas criadas: ' || COUNT(*) 
FROM lessons
UNION ALL
SELECT 
  'Admins cadastrados: ' || COUNT(*) 
FROM profiles WHERE role = 'admin';

-- ============================================
-- FIM DO SETUP ADMINISTRATIVO
-- ============================================


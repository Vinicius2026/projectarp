-- ============================================
-- CRIAR BUCKET DE STORAGE PARA AVATARES DE PERFIL
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Criar bucket para avatares de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('profile-avatars', 'profile-avatars', true, 26214400)
ON CONFLICT (id) DO UPDATE 
SET file_size_limit = 26214400;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Usuários podem ver seus próprios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de seus próprios avatares" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus próprios avatares" ON storage.objects;

-- Política: todos podem ver avatares (público)
CREATE POLICY "Usuários podem ver seus próprios avatares"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

-- Política: usuários autenticados podem fazer upload de avatares
CREATE POLICY "Usuários podem fazer upload de avatares"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-avatars' AND
    auth.uid() IS NOT NULL
  );

-- Política: usuários podem atualizar seus próprios avatares
CREATE POLICY "Usuários podem atualizar seus próprios avatares"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-avatars' AND
    auth.uid() IS NOT NULL
  );

-- Política: usuários podem deletar seus próprios avatares
CREATE POLICY "Usuários podem deletar seus próprios avatares"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-avatars' AND
    auth.uid() IS NOT NULL
  );

-- Adicionar coluna avatar_url na tabela profiles (se não existir)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Atualizar file_size_limit para 25MB (se o bucket já existe)
-- 25MB = 25 * 1024 * 1024 = 26214400 bytes
UPDATE storage.buckets 
SET file_size_limit = 26214400 
WHERE id = 'profile-avatars';

-- Verificar se foi criado/atualizado
SELECT 
  id, 
  name, 
  public, 
  file_size_limit,
  file_size_limit / 1024 / 1024 as file_size_limit_mb
FROM storage.buckets 
WHERE id = 'profile-avatars';


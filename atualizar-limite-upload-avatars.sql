-- ============================================
-- ATUALIZAR LIMITE DE TAMANHO DE ARQUIVO PARA 25MB
-- Execute este script no SQL Editor do Supabase
-- ============================================
-- 
-- IMPORTANTE: Este limite é apenas para o TAMANHO DO ARQUIVO (MB)
-- NÃO há limitação de dimensões (largura/altura em pixels)
-- O usuário pode fazer upload de imagens de qualquer tamanho em pixels,
-- desde que o arquivo não ultrapasse 25MB
-- ============================================

-- Atualizar file_size_limit para 25MB (tamanho do arquivo, não dimensões)
-- 25MB = 25 * 1024 * 1024 = 26214400 bytes
UPDATE storage.buckets 
SET file_size_limit = 26214400 
WHERE id = 'profile-avatars';

-- Verificar se foi atualizado
-- file_size_limit está em bytes, convertemos para MB para visualização
SELECT 
  id, 
  name, 
  public, 
  file_size_limit as tamanho_limite_bytes,
  ROUND(file_size_limit / 1024.0 / 1024.0, 2) as tamanho_limite_mb
FROM storage.buckets 
WHERE id = 'profile-avatars';


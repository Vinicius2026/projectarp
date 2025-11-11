-- ============================================
-- VERIFICAR SE AVATAR_URL ESTÁ SENDO SALVO
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Verificar se a coluna avatar_url existe
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' 
  AND column_name = 'avatar_url';

-- Verificar perfis com avatar_url
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  LENGTH(p.avatar_url) as url_length,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.avatar_url IS NOT NULL
ORDER BY p.updated_at DESC;

-- Verificar todos os perfis (incluindo sem avatar)
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.updated_at,
  au.email
FROM profiles p
JOIN auth.users au ON au.id = p.id
ORDER BY p.updated_at DESC;


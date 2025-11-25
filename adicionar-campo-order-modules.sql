-- ============================================
-- ADICIONAR CAMPO ORDER NA TABELA MODULES
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Adicionar coluna order na tabela modules
ALTER TABLE modules 
ADD COLUMN IF NOT EXISTS "order" INT DEFAULT 0;

-- Atualizar os módulos existentes com valores sequenciais baseados na área
-- Isso garante que módulos existentes tenham uma ordem inicial
DO $$
DECLARE
  area_record RECORD;
  module_record RECORD;
  current_order INT;
BEGIN
  -- Para cada área, ordenar os módulos por ID e atribuir ordem sequencial
  FOR area_record IN SELECT id FROM areas LOOP
    current_order := 1;
    
    FOR module_record IN 
      SELECT id FROM modules 
      WHERE area_id = area_record.id 
      ORDER BY id ASC
    LOOP
      UPDATE modules 
      SET "order" = current_order 
      WHERE id = module_record.id;
      
      current_order := current_order + 1;
    END LOOP;
  END LOOP;
END $$;

-- Criar índice para melhorar performance nas queries ordenadas por área e order
CREATE INDEX IF NOT EXISTS idx_modules_area_order ON modules(area_id, "order");

-- Comentário na coluna
COMMENT ON COLUMN modules."order" IS 'Ordem de exibição do módulo dentro de sua área (1-10 por área)';


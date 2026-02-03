-- =============================================
-- 15: ADD CLASSIC READING TYPE (3 CARDS)
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Insertar tipo de lectura clásica (Pasado-Presente-Futuro)
INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order) VALUES
    ('classic', 'Evolución Temporal', 'Tirada de 3 cartas: Pasado, Presente y Futuro. Comprende tu trayectoria evolutiva.', 100, '⏳', 3)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    credit_cost = EXCLUDED.credit_cost,
    icon = EXCLUDED.icon;

-- Agregar columna position a lecturas para soportar tiradas multi-carta
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'position'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN position TEXT;
    END IF;
    
    -- Agregar parent_reading_id para agrupar cartas de una misma tirada
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'parent_reading_id'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN parent_reading_id BIGINT REFERENCES public.lecturas(id);
    END IF;
END $$;

-- Índice para búsqueda por tirada padre
CREATE INDEX IF NOT EXISTS idx_lecturas_parent ON public.lecturas(parent_reading_id);

-- Comentarios
COMMENT ON COLUMN public.lecturas.position IS 'Posición de la carta en tirada multi-carta (ej: Pasado, Presente, Futuro)';
COMMENT ON COLUMN public.lecturas.parent_reading_id IS 'ID de la lectura padre para tiradas de múltiples cartas (BIGINT para coincidir con lecturas.id)';

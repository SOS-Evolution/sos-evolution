-- =============================================
-- 04: ENHANCE LECTURAS TABLE
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Tabla de tipos de lectura
CREATE TABLE IF NOT EXISTS public.reading_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    credit_cost INTEGER NOT NULL DEFAULT 0,
    icon TEXT DEFAULT '🔮',
    prompt_template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reading_types_code ON public.reading_types(code);
CREATE INDEX IF NOT EXISTS idx_reading_types_active ON public.reading_types(is_active);

-- Habilitar RLS
ALTER TABLE public.reading_types ENABLE ROW LEVEL SECURITY;

-- Políticas (lectura pública)
CREATE POLICY "Anyone can view active reading types"
    ON public.reading_types FOR SELECT
    USING (is_active = TRUE);

-- Insertar tipos de lectura iniciales
INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order) VALUES
    ('daily', 'Oráculo Diario', 'Tu mensaje del universo para hoy', 0, '☀️', 1),
    ('general', 'Consulta General', 'Respuesta a cualquier pregunta', 0, '🔮', 2),
    ('love', 'Sendero del Amor', 'Guía para relaciones y conexiones', 10, '💜', 3),
    ('career', 'Camino Profesional', 'Orientación laboral y de propósito', 10, '💼', 4),
    ('spiritual', 'Evolución Espiritual', 'Profundiza en tu camino interior', 15, '✨', 5),
    ('celtic_cross', 'Cruz Celta', 'Tirada completa de 10 cartas (próximamente)', 25, '🌟', 6)
ON CONFLICT (code) DO NOTHING;

-- Agregar columnas nuevas a lecturas (si no existen)
DO $$ 
BEGIN
    -- Agregar reading_type_id si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'reading_type_id'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN reading_type_id UUID REFERENCES public.reading_types(id);
    END IF;
    
    -- Agregar question si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'question'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN question TEXT;
    END IF;
END $$;

-- Índice para búsqueda por tipo
CREATE INDEX IF NOT EXISTS idx_lecturas_type ON public.lecturas(reading_type_id);

-- Vista para estadísticas de cartas por usuario
CREATE OR REPLACE VIEW public.user_card_stats AS
SELECT 
    user_id,
    card_name,
    COUNT(*) as times_drawn,
    MAX(created_at) as last_drawn
FROM public.lecturas
GROUP BY user_id, card_name;

-- Función para obtener la carta más frecuente de un usuario
CREATE OR REPLACE FUNCTION public.get_top_card(p_user_id UUID)
RETURNS TABLE (
    card_name TEXT,
    times_drawn BIGINT,
    last_drawn TIMESTAMPTZ
) AS $$
    SELECT card_name, times_drawn, last_drawn
    FROM public.user_card_stats
    WHERE user_id = p_user_id
    ORDER BY times_drawn DESC, last_drawn DESC
    LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Función para obtener estadísticas completas de cartas
CREATE OR REPLACE FUNCTION public.get_card_stats(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    card_name TEXT,
    times_drawn BIGINT,
    last_drawn TIMESTAMPTZ
) AS $$
    SELECT card_name, times_drawn, last_drawn
    FROM public.user_card_stats
    WHERE user_id = p_user_id
    ORDER BY times_drawn DESC, last_drawn DESC
    LIMIT p_limit;
$$ LANGUAGE sql SECURITY DEFINER;

-- Actualizar lecturas existentes con tipo 'general'
UPDATE public.lecturas 
SET reading_type_id = (SELECT id FROM public.reading_types WHERE code = 'general')
WHERE reading_type_id IS NULL;

-- Comentarios
COMMENT ON TABLE public.reading_types IS 'Tipos de lecturas de tarot disponibles';
COMMENT ON VIEW public.user_card_stats IS 'Estadísticas de cartas por usuario';
COMMENT ON FUNCTION public.get_top_card IS 'Obtiene la carta más frecuente de un usuario';

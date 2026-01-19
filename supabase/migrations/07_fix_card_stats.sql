-- =============================================
-- 07: FIX CARD STATS AND SECURITY
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Eliminar versiones anteriores de funciones y vista
DROP FUNCTION IF EXISTS public.get_top_card(UUID);
DROP FUNCTION IF EXISTS public.get_card_stats(UUID, INTEGER);
DROP VIEW IF EXISTS public.user_card_stats;

-- 2. Recrear la Vista (Filtrando cartas nulas y asegurando esquema public)
CREATE OR REPLACE VIEW public.user_card_stats AS
SELECT 
    user_id,
    card_name,
    COUNT(*) as times_drawn,
    MAX(created_at) as last_drawn
FROM public.lecturas
WHERE card_name IS NOT NULL AND card_name != ''
GROUP BY user_id, card_name;

-- Permitir acceso a la vista (aunque por defecto es public en supabase)
GRANT SELECT ON public.user_card_stats TO authenticated;
GRANT SELECT ON public.user_card_stats TO service_role;

-- 3. Recrear Funciones sin SECURITY DEFINER (Usar SECURITY INVOKER por defecto)
-- Esto hace que la función use los permisos del usuario actual (respetando RLS de lecturas)
-- evitando el aviso de seguridad y problemas de contexto.

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
$$ LANGUAGE sql;

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
$$ LANGUAGE sql;

COMMENT ON VIEW public.user_card_stats IS 'Estadísticas de cartas por usuario (Filtrada)';

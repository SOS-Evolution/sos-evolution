-- =============================================
-- 09: FIX STATS v2 & SECURITY (CORREGIDO)
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Eliminar funciones anteriores (para cambiar firma)
DROP FUNCTION IF EXISTS public.get_top_card(UUID);
DROP FUNCTION IF EXISTS public.get_card_stats(UUID, INTEGER);

-- 2. Función get_top_card REFACTORIZADA (Sin parámetros)
CREATE OR REPLACE FUNCTION public.get_top_card()
RETURNS TABLE (
    card_name TEXT,
    times_drawn BIGINT,
    last_drawn TIMESTAMPTZ
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.card_name, 
        COUNT(*) as times_drawn, 
        MAX(l.created_at) as last_drawn
    FROM public.lecturas l
    WHERE l.user_id = auth.uid()
      AND l.card_name IS NOT NULL 
      AND l.card_name != ''
    GROUP BY l.card_name
    ORDER BY times_drawn DESC, last_drawn DESC
    LIMIT 1;
END;
$$;

-- 3. Función get_card_stats REFACTORIZADA
CREATE OR REPLACE FUNCTION public.get_card_stats(p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    card_name TEXT,
    times_drawn BIGINT,
    last_drawn TIMESTAMPTZ
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.card_name, 
        COUNT(*) as times_drawn, 
        MAX(l.created_at) as last_drawn
    FROM public.lecturas l
    WHERE l.user_id = auth.uid()
      AND l.card_name IS NOT NULL 
      AND l.card_name != ''
    GROUP BY l.card_name
    ORDER BY times_drawn DESC, last_drawn DESC
    LIMIT p_limit;
END;
$$;

-- 4. Permisos
GRANT EXECUTE ON FUNCTION public.get_top_card() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_card() TO service_role;
GRANT EXECUTE ON FUNCTION public.get_card_stats(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_card_stats(INTEGER) TO service_role;

-- 5. Arreglar warnings de "search_path" en otras funciones existentes
-- NOTA: Se ha corregido la firma de spend_credits (tiene 4 argumentos, no 5)
ALTER FUNCTION public.handle_new_user() SET search_path = public, temp;
ALTER FUNCTION public.get_user_balance(UUID) SET search_path = public, temp;
ALTER FUNCTION public.add_credits(UUID, INTEGER, TEXT, TEXT, UUID) SET search_path = public, temp;
ALTER FUNCTION public.spend_credits(UUID, INTEGER, TEXT, UUID) SET search_path = public, temp; 
ALTER FUNCTION public.complete_mission(UUID, TEXT) SET search_path = public, temp;
ALTER FUNCTION public.grant_welcome_credits() SET search_path = public, temp;
ALTER FUNCTION public.init_user_missions() SET search_path = public, temp;
ALTER FUNCTION public.handle_reading_mission_progress() SET search_path = public, temp;

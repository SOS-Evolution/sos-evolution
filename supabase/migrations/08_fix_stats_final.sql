-- =============================================
-- 08: FIX STATS FINAL (DIRECT QUERY)
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- 1. Limpiar todo lo relacionado con stats anterior
DROP FUNCTION IF EXISTS public.get_top_card(UUID);
DROP FUNCTION IF EXISTS public.get_card_stats(UUID, INTEGER);
DROP VIEW IF EXISTS public.user_card_stats CASCADE;

-- 2. Función DIRECTA para obtener la carta más frecuente
-- Usamos SECURITY DEFINER para asegurar que pueda leer la tabla sin problemas de permisos extraños,
-- pero filtramos SIEMPRE por p_user_id para seguridad.
CREATE OR REPLACE FUNCTION public.get_top_card(p_user_id UUID)
RETURNS TABLE (
    card_name TEXT,
    times_drawn BIGINT,
    last_drawn TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.card_name, 
        COUNT(*) as times_drawn, 
        MAX(l.created_at) as last_drawn
    FROM public.lecturas l
    WHERE l.user_id = p_user_id
      AND l.card_name IS NOT NULL 
      AND l.card_name != ''
    GROUP BY l.card_name
    ORDER BY times_drawn DESC, last_drawn DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función DIRECTA para obtener lista de estadísticas
CREATE OR REPLACE FUNCTION public.get_card_stats(p_user_id UUID, p_limit INTEGER DEFAULT 5)
RETURNS TABLE (
    card_name TEXT,
    times_drawn BIGINT,
    last_drawn TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.card_name, 
        COUNT(*) as times_drawn, 
        MAX(l.created_at) as last_drawn
    FROM public.lecturas l
    WHERE l.user_id = p_user_id
      AND l.card_name IS NOT NULL 
      AND l.card_name != ''
    GROUP BY l.card_name
    ORDER BY times_drawn DESC, last_drawn DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Permisos
GRANT EXECUTE ON FUNCTION public.get_top_card(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_card(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_card_stats(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_card_stats(UUID, INTEGER) TO service_role;

-- 5. VERIFICACIÓN (Opcional - Esto mostrará algo en la salida si hay datos)
DO $$
DECLARE
    v_test_user UUID;
    v_has_readings BOOLEAN;
BEGIN
    -- Intentar buscar un usuario con lecturas para probar
    SELECT user_id INTO v_test_user FROM public.lecturas LIMIT 1;
    
    IF v_test_user IS NOT NULL THEN
        RAISE NOTICE 'Usuario encontrado para prueba: %', v_test_user;
        
        PERFORM * FROM public.get_top_card(v_test_user);
        RAISE NOTICE 'Función ejecutada correctamente (revisa resultados si pudieras verlos en un SELECT).';
    ELSE
        RAISE NOTICE 'No se encontraron lecturas en la base de datos para probar.';
    END IF;
END $$;

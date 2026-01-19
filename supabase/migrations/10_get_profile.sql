-- =============================================
-- 10: GET PROFILE FUNCTION
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Función para obtener el perfil completo de un usuario
-- Útil para server components que necesitan datos frescos
CREATE OR REPLACE FUNCTION public.get_profile(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    birth_date DATE,
    birth_place TEXT,
    life_path_number INTEGER,
    zodiac_sign TEXT,
    birth_time TIME,
    latitude NUMERIC,
    longitude NUMERIC,
    avatar_url TEXT,
    extra_data JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, temp
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM public.profiles
    WHERE public.profiles.id = p_user_id;
END;
$$;

-- Permisos
GRANT EXECUTE ON FUNCTION public.get_profile(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile(UUID) TO service_role;

COMMENT ON FUNCTION public.get_profile IS 'Obtiene los detalles del perfil de un usuario específico';

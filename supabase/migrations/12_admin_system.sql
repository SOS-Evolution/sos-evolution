-- =============================================
-- 12: ADMIN SYSTEM & ROLE MANAGEMENT
-- =============================================

-- 1. Add Role Column to Profiles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- Index for faster queries on role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Function to get Admin Dashboard Stats (KPIs)
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB AS $$
DECLARE
    total_users INTEGER;
    total_credits_circulating INTEGER;
    total_readings_all_time INTEGER;
BEGIN
    -- Validar que sea admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT COUNT(*) INTO total_users FROM public.profiles;
    
    SELECT COALESCE(SUM(amount), 0) INTO total_credits_circulating 
    FROM public.user_credits;

    SELECT COUNT(*) INTO total_readings_all_time FROM public.lecturas;

    RETURN jsonb_build_object(
        'total_users', total_users,
        'total_credits', total_credits_circulating,
        'total_readings', total_readings_all_time
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Function to get Users List with Stats for Admin
CREATE OR REPLACE FUNCTION public.get_users_list_admin(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_search TEXT DEFAULT ''
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    role TEXT,
    created_at TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    credit_balance INTEGER,
    readings_count BIGINT
) AS $$
BEGIN
    -- Validar que sea admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        u.email::TEXT, -- Casting a TEXT para evitar problemas de tipo
        p.role,
        p.created_at,
        p.updated_at as last_login, -- Usamos updated_at como proxy de ultimo login por ahora
        COALESCE((SELECT SUM(uc.amount) FROM public.user_credits uc WHERE uc.user_id = p.id), 0)::INTEGER as credit_balance,
        (SELECT COUNT(*) FROM public.lecturas l WHERE l.user_id = p.id) as readings_count
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE 
        (p_search = '' OR 
         p.full_name ILIKE '%' || p_search || '%' OR 
         u.email ILIKE '%' || p_search || '%')
    ORDER BY p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permisos
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_users_list_admin(INTEGER, INTEGER, TEXT) TO authenticated;

COMMENT ON FUNCTION public.is_admin IS 'Checks if the current user has the admin role';
COMMENT ON FUNCTION public.get_admin_stats IS 'Returns aggregated system stats for the admin dashboard';
COMMENT ON FUNCTION public.get_users_list_admin IS 'Returns a paginated list of users with their stats';

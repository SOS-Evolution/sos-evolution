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

-- 5. Security & RLS Updates
-- Permitir que admins vean todos los perfiles
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles'
    ) THEN
        CREATE POLICY "Admins can view all profiles"
            ON public.profiles FOR SELECT
            USING (public.is_admin());
    END IF;

    -- Permitir que admins vean todos los créditos
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_credits' AND policyname = 'Admins can view all credits'
    ) THEN
        CREATE POLICY "Admins can view all credits"
            ON public.user_credits FOR SELECT
            USING (public.is_admin());
    END IF;

    -- Permitir que admins vean todas las lecturas
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'lecturas' AND policyname = 'Admins can view all readings'
    ) THEN
        CREATE POLICY "Admins can view all readings"
            ON public.lecturas FOR SELECT
            USING (public.is_admin());
    END IF;
END $$;

-- 6. Function to get single user detail for Admin
CREATE OR REPLACE FUNCTION public.get_user_detail_admin(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Validar que sea admin
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT jsonb_build_object(
        'id', p.id,
        'full_name', p.full_name,
        'email', u.email,
        'role', p.role,
        'birth_date', p.birth_date,
        'birth_place', p.birth_place,
        'life_path_number', p.life_path_number,
        'zodiac_sign', p.zodiac_sign,
        'avatar_url', p.avatar_url,
        'created_at', p.created_at,
        'updated_at', p.updated_at
    ) INTO result
    FROM public.profiles p
    JOIN auth.users u ON p.id = u.id
    WHERE p.id = p_user_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_detail_admin(UUID) TO authenticated;

-- 7. Global Logs for Admin (Readings & Transactions)
CREATE OR REPLACE FUNCTION public.get_readings_list_admin(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    card_name TEXT,
    is_reversed BOOLEAN,
    question TEXT,
    created_at TIMESTAMPTZ,
    full_name TEXT,
    email TEXT
) AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        l.id::UUID,
        l.card_name::TEXT,
        false::BOOLEAN, -- Placeholder ya que no estamos seguros si la columna existe
        l.question::TEXT,
        l.created_at::TIMESTAMPTZ,
        p.full_name::TEXT,
        u.email::TEXT
    FROM public.lecturas l
    JOIN public.profiles p ON l.user_id = p.id
    JOIN auth.users u ON p.id = u.id
    ORDER BY l.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_transactions_list_admin(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
    id UUID,
    amount INTEGER,
    source TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    full_name TEXT,
    email TEXT
) AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        uc.id,
        uc.amount,
        uc.source,
        uc.description,
        uc.created_at,
        p.full_name,
        u.email::TEXT
    FROM public.user_credits uc
    JOIN public.profiles p ON uc.user_id = p.id
    JOIN auth.users u ON p.id = u.id
    ORDER BY uc.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_readings_list_admin(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_transactions_list_admin(INTEGER) TO authenticated;

COMMENT ON FUNCTION public.is_admin IS 'Checks if the current user has the admin role';
COMMENT ON FUNCTION public.get_admin_stats IS 'Returns aggregated system stats for the admin dashboard';
COMMENT ON FUNCTION public.get_users_list_admin IS 'Returns a paginated list of users with their stats';
COMMENT ON FUNCTION public.get_user_detail_admin IS 'Returns full user details for the admin view';
COMMENT ON FUNCTION public.get_readings_list_admin IS 'Returns global readings history with user info';
COMMENT ON FUNCTION public.get_transactions_list_admin IS 'Returns global credits transactions with user info';
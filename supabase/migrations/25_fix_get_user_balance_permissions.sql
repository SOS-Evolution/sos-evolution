-- =================================================================
-- 25: FIX GET_USER_BALANCE PERMISSIONS (CRITICAL HOTFIX)
-- =================================================================

-- Recreate get_user_balance with correct security
DROP FUNCTION IF EXISTS public.get_user_balance(UUID);

CREATE OR REPLACE FUNCTION public.get_user_balance(user_uuid UUID)
RETURNS INTEGER 
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(SUM(amount), 0)::INTEGER
    FROM public.user_credits
    WHERE user_id = user_uuid;
$$;

-- Grant explicit permissions
GRANT EXECUTE ON FUNCTION public.get_user_balance(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_balance(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_balance(UUID) TO service_role;

-- Add comment
COMMENT ON FUNCTION public.get_user_balance(UUID) IS 'Returns the current credit balance for a user. SECURITY DEFINER allows safe querying of user_credits table.';

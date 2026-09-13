-- =================================================================
-- 41: OPTIMIZE CREDITS FUNCTIONS FOR PRODUCTION LATENCY
-- =================================================================
-- Problem: get_user_balance_v2 was hitting "Gateway Timeout" on Supabase
-- in production. Root causes:
--   1. Missing composite index (user_id + created_at) for ledger scans
--   2. Functions had no explicit statement_timeout
--   3. Too many sequential Supabase roundtrips in the request path
-- =================================================================

-- 1. Ensure a composite index exists for fast balance aggregation
--    This covers: WHERE user_id = $1 (plus ordering by created_at for ledger queries)
CREATE INDEX IF NOT EXISTS idx_credits_user_created
    ON public.user_credits(user_id, created_at DESC);

-- 2. Rebuild get_user_balance_v2 with explicit statement_timeout to avoid
--    ambiguous "Gateway Timeout" errors. Uses a simple SQL function (faster than plpgsql).
CREATE OR REPLACE FUNCTION public.get_user_balance_v2(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
SET statement_timeout = '8000'  -- 8 second hard limit; fail fast rather than hang
AS $$
    SELECT COALESCE(SUM(amount), 0)::INTEGER
    FROM public.user_credits
    WHERE user_id = p_user_id;
$$;

-- 3. Rebuild spend_credits_v2 with explicit timeout
CREATE OR REPLACE FUNCTION public.spend_credits_v2(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET statement_timeout = '8000'
AS $$
DECLARE
    v_current_balance INTEGER;
    caller_role TEXT;
    caller_uid UUID;
BEGIN
    caller_role := auth.role();
    caller_uid  := auth.uid();

    -- Authorization: authenticated callers can only spend their own credits.
    -- service_role and internal triggers may operate on behalf of any user.
    IF caller_role = 'authenticated' AND caller_uid IS NOT NULL AND caller_uid <> p_user_id THEN
        RAISE EXCEPTION 'Unauthorized: Cannot spend credits belonging to another user';
    END IF;

    -- Check balance
    v_current_balance := public.get_user_balance_v2(p_user_id);

    IF v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient credits. Balance: %, Required: %', v_current_balance, p_amount;
    END IF;

    -- Insert negative transaction
    INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
    VALUES (p_user_id, -p_amount, 'reading', p_description, p_reference_id);

    -- Return new balance (avoids an extra roundtrip from the application layer)
    RETURN public.get_user_balance_v2(p_user_id);
END;
$$;

-- 4. Re-grant permissions (CREATE OR REPLACE resets them)
REVOKE EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) TO authenticated, service_role;

-- 5. Comments
COMMENT ON FUNCTION public.get_user_balance_v2(UUID) IS
    'Fast balance aggregation. SQL language (no PL/pgSQL overhead). statement_timeout=8s.';
COMMENT ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) IS
    'Secure credit spending. Returns new balance directly to avoid extra roundtrip. statement_timeout=8s.';

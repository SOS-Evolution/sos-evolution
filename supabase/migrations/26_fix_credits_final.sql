-- =================================================================
-- 26: ROBUST CREDITS SYSTEM FIX (V2)
-- =================================================================

-- 1. Create robust balance check function (SECURITY DEFINER)
-- This function runs with the privileges of the creator (postgres/superuser),
-- bypassing RLS on user_credits table completely.
CREATE OR REPLACE FUNCTION public.get_user_balance_v2(p_user_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, temp
AS $$
BEGIN
    -- Direct sum query, bypassing RLS due to SECURITY DEFINER
    RETURN COALESCE(
        (SELECT SUM(amount) FROM public.user_credits WHERE user_id = p_user_id), 
        0
    )::INTEGER;
END;
$$;

-- 2. Create robust spend function (SECURITY DEFINER)
-- Bypasses RLS for both the balance check and the insert.
CREATE OR REPLACE FUNCTION public.spend_credits_v2(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, temp
AS $$
DECLARE
    current_balance INTEGER;
    new_balance INTEGER;
BEGIN
    -- Check balance using robust v2 function
    current_balance := public.get_user_balance_v2(p_user_id);
    
    IF current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient credits. Balance: %, Required: %', current_balance, p_amount;
    END IF;
    
    -- Insert negative transaction
    -- Because this function is SECURITY DEFINER, it bypasses the RLS policy 
    -- "System can insert credits" which checks auth.uid() = user_id.
    -- This allows server-side operations where auth.uid() might not match 100% 
    -- if connected via service key or specialized client.
    INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
    VALUES (p_user_id, -p_amount, 'reading', p_description, p_reference_id);
    
    -- Return new balance
    RETURN public.get_user_balance_v2(p_user_id);
END;
$$;

-- 3. Update legacy functions to use v2 logic (for backward compatibility)
CREATE OR REPLACE FUNCTION public.get_user_balance(user_uuid UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, temp
AS $$
BEGIN
    RETURN public.get_user_balance_v2(user_uuid);
END;
$$;

-- 4. Grant explicit permissions
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO anon;
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO service_role;

GRANT EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) TO service_role;

-- 5. Add useful comments
COMMENT ON FUNCTION public.get_user_balance_v2(UUID) IS 'Robust balance check bypassing RLS. Use this for server-side checks.';
COMMENT ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) IS 'Robust credit spending bypassing RLS. Use this for server-side operations.';

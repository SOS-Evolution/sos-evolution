-- =================================================================
-- 37: SECURE CREDITS RPC FUNCTIONS AND PAYMENTS PERMISSIONS
-- =================================================================

-- 1. REVOKE dangerous public/anonymous execution permissions on credits functions
REVOKE EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER, TEXT, TEXT, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.spend_credits(UUID, INTEGER, TEXT, UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_balance(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) FROM PUBLIC, anon;

-- 2. Restrict add_credits strictly to service_role (and internal triggers/functions)
GRANT EXECUTE ON FUNCTION public.add_credits(UUID, INTEGER, TEXT, TEXT, UUID) TO service_role;

-- 3. Secure spend_credits_v2 so authenticated users CANNOT spend other users' credits
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
    caller_role TEXT;
    caller_uid UUID;
BEGIN
    caller_role := auth.role();
    caller_uid := auth.uid();

    -- Authorization check:
    -- If called by authenticated user (via PostgREST/client), caller_uid MUST match p_user_id.
    -- service_role or internal triggers can operate on behalf of any user.
    IF caller_role = 'authenticated' AND caller_uid IS NOT NULL AND caller_uid <> p_user_id THEN
        RAISE EXCEPTION 'Unauthorized: Cannot spend credits belonging to another user';
    END IF;

    -- Check balance using robust v2 function
    current_balance := public.get_user_balance_v2(p_user_id);
    
    IF current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient credits. Balance: %, Required: %', current_balance, p_amount;
    END IF;
    
    -- Insert negative transaction
    INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
    VALUES (p_user_id, -p_amount, 'reading', p_description, p_reference_id);
    
    -- Return new balance
    RETURN public.get_user_balance_v2(p_user_id);
END;
$$;

-- Grant execution of spend_credits_v2 only to authenticated users (with internal check) and service_role
GRANT EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) TO service_role;

-- Ensure get_user_balance_v2 is available to authenticated users for their balance checks
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO service_role;

-- 4. Ensure payments table has proper service_role & admin update policies
CREATE POLICY "Service role can manage all payments"
    ON public.payments
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

COMMENT ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) IS 'Secure credit spending. Validates caller identity against target user.';
COMMENT ON FUNCTION public.add_credits(UUID, INTEGER, TEXT, TEXT, UUID) IS 'Restricted credit minting. Only callable by service_role or triggers.';

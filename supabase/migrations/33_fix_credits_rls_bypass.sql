-- =============================================
-- 33: RE-ROBUSTIFY CREDITS SYSTEM
-- =============================================

-- Ensure get_user_balance_v2 is truly robust
CREATE OR REPLACE FUNCTION public.get_user_balance_v2(p_user_id UUID)
RETURNS INTEGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, temp
AS $$
DECLARE
    v_balance INTEGER;
BEGIN
    -- Sum all amounts for this user
    SELECT COALESCE(SUM(amount), 0)::INTEGER
    INTO v_balance
    FROM public.user_credits 
    WHERE user_id = p_user_id;

    RETURN v_balance;
END;
$$;

-- Ensure spend_credits_v2 is truly robust
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
    v_current_balance INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- 1. Get current balance using robust function
    v_current_balance := public.get_user_balance_v2(p_user_id);
    
    -- 2. Check if enough credits
    IF v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient credits. Balance: %, Required: %', v_current_balance, p_amount;
    END IF;
    
    -- 3. Insert transaction
    INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
    VALUES (p_user_id, -p_amount, 'reading', p_description, p_reference_id);
    
    -- 4. Get new balance
    v_new_balance := public.get_user_balance_v2(p_user_id);
    
    RETURN v_new_balance;
END;
$$;

-- Alias spend_credits to spend_credits_v2 for safety
CREATE OR REPLACE FUNCTION public.spend_credits(
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
BEGIN
    RETURN public.spend_credits_v2(p_user_id, p_amount, p_description, p_reference_id);
END;
$$;

-- Explicit grants
GRANT EXECUTE ON FUNCTION public.get_user_balance_v2(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_credits_v2(UUID, INTEGER, TEXT, UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.spend_credits(UUID, INTEGER, TEXT, UUID) TO authenticated, service_role;

-- =============================================
-- 24: ENSURE READING TYPES AND FIX CREDITS
-- =============================================

-- 1. Upsert reading types to ensure they exist and have correct costs
INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order, is_active)
VALUES 
    ('daily', 'Oráculo Diario', 'Tu mensaje del universo para hoy', 20, '☀️', 1, TRUE),
    ('general', 'Consulta General', 'Respuesta a cualquier pregunta', 20, '🔮', 2, TRUE),
    ('classic', 'Evolución Temporal', 'Tirada de 3 cartas: Pasado, Presente y Futuro', 100, '⏳', 3, TRUE)
ON CONFLICT (code) DO UPDATE SET
    credit_cost = EXCLUDED.credit_cost,
    is_active = TRUE;

-- 2. Grant permissions explicitly to avoid silent failures
GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, integer, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.spend_credits(uuid, integer, text, uuid) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_user_balance(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_balance(uuid) TO service_role;

-- 3. Log verifying that types exist (for manual run verification)
DO $$
DECLARE
    daily_cost INTEGER;
BEGIN
    SELECT credit_cost INTO daily_cost FROM public.reading_types WHERE code = 'daily';
    RAISE NOTICE 'Daily reading cost is set to: %', daily_cost;
END $$;

-- =============================================
-- 02: CREATE CREDITS SYSTEM
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Tabla de transacciones de créditos (ledger)
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('mission', 'purchase', 'admin', 'reading', 'bonus', 'refund')),
    description TEXT,
    reference_id UUID, -- Referencia opcional a otra entidad (mission_id, lectura_id, etc)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_credits_user ON public.user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_source ON public.user_credits(source);
CREATE INDEX IF NOT EXISTS idx_credits_created ON public.user_credits(created_at DESC);

-- Habilitar RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own credits"
    ON public.user_credits FOR SELECT
    USING (auth.uid() = user_id);

-- Solo el sistema puede insertar créditos (vía funciones SECURITY DEFINER)
CREATE POLICY "System can insert credits"
    ON public.user_credits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Función para obtener balance de un usuario
CREATE OR REPLACE FUNCTION public.get_user_balance(user_uuid UUID)
RETURNS INTEGER AS $$
    SELECT COALESCE(SUM(amount), 0)::INTEGER
    FROM public.user_credits
    WHERE user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- Función para agregar créditos
CREATE OR REPLACE FUNCTION public.add_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_source TEXT,
    p_description TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    new_balance INTEGER;
BEGIN
    INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
    VALUES (p_user_id, p_amount, p_source, p_description, p_reference_id);
    
    SELECT public.get_user_balance(p_user_id) INTO new_balance;
    RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para gastar créditos (con validación de balance)
CREATE OR REPLACE FUNCTION public.spend_credits(
    p_user_id UUID,
    p_amount INTEGER,
    p_description TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    current_balance INTEGER;
    new_balance INTEGER;
BEGIN
    SELECT public.get_user_balance(p_user_id) INTO current_balance;
    
    IF current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient credits. Balance: %, Required: %', current_balance, p_amount;
    END IF;
    
    INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
    VALUES (p_user_id, -p_amount, 'reading', p_description, p_reference_id);
    
    SELECT public.get_user_balance(p_user_id) INTO new_balance;
    RETURN new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar créditos iniciales a usuarios nuevos (50 créditos de bienvenida)
CREATE OR REPLACE FUNCTION public.grant_welcome_credits()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM public.add_credits(
        NEW.id,
        50,
        'bonus',
        'Créditos de bienvenida'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created_credits ON public.profiles;
CREATE TRIGGER on_profile_created_credits
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.grant_welcome_credits();

-- Comentarios
COMMENT ON TABLE public.user_credits IS 'Registro de transacciones de créditos (ledger pattern)';
COMMENT ON FUNCTION public.get_user_balance IS 'Obtiene el balance actual de créditos de un usuario';
COMMENT ON FUNCTION public.add_credits IS 'Agrega créditos a un usuario';
COMMENT ON FUNCTION public.spend_credits IS 'Gasta créditos de un usuario con validación de balance';

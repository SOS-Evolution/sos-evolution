-- =============================================
-- 36: CREATE PAYMENTS TABLE
-- =============================================

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_id TEXT UNIQUE, -- Lemon Squeezy Order ID
    variant_id TEXT NOT NULL, -- Lemon Squeezy Variant ID (identifica el paquete de créditos)
    amount INTEGER NOT NULL, -- Monto en centavos
    currency TEXT NOT NULL DEFAULT 'USD',
    status payment_status NOT NULL DEFAULT 'pending',
    credits_awarded INTEGER NOT NULL DEFAULT 0,
    checkout_id TEXT, -- ID de checkout de Lemon Squeezy
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Habilitar RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- Solo el sistema puede insertar/actualizar (vía funciones o API con service role)
-- Pero permitimos que el usuario inserte su propio pago pendiente al iniciar checkout
CREATE POLICY "Users can insert own pending payments"
    ON public.payments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_updated
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comentarios
COMMENT ON TABLE public.payments IS 'Registro de transacciones de pago externas (Lemon Squeezy)';

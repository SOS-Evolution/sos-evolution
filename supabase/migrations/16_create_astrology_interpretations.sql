-- =============================================
-- 16: CREATE ASTROLOGY INTERPRETATIONS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.astrology_interpretations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    core_personality TEXT,
    strengths TEXT[],
    challenges TEXT[],
    evolutionary_advice TEXT,
    chart_snapshot JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_astrology_interpretations_user ON public.astrology_interpretations(user_id);

-- Enable RLS
ALTER TABLE public.astrology_interpretations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own astrology interpretations"
    ON public.astrology_interpretations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own astrology interpretations"
    ON public.astrology_interpretations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Add to reading_types if it doesn't exist
INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order)
VALUES ('astrology_full', 'Análisis de Carta Natal', 'Interpretación profunda de tu mapa evolutivo estelar', 20, '🪐', 10)
ON CONFLICT (code) DO UPDATE 
SET credit_cost = 20, description = 'Interpretación profunda de tu mapa evolutivo estelar';

-- Comments
COMMENT ON TABLE public.astrology_interpretations IS 'Stored AI interpretations for user natal charts';

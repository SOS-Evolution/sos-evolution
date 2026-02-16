-- =============================================
-- 27: DAILY HOROSCOPE SYSTEM
-- =============================================

-- 1. Tabla de Caché de Tránsitos Diarios (Global)
-- Almacena la posición de los planetas por día para no consultar la API externa mil veces.
CREATE TABLE IF NOT EXISTS public.daily_transits (
    date DATE PRIMARY KEY, -- La fecha es la clave única (una entrada por día)
    planets_data JSONB NOT NULL, -- Datos crudos de la API de tránsitos
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS para daily_transits
ALTER TABLE public.daily_transits ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer los tránsitos (necesario para la API server-side y debug)
CREATE POLICY "Anyone can view daily transits"
    ON public.daily_transits FOR SELECT
    USING (true);

-- Solo el sistema (service_role) o admins pueden insertar (aunque por ahora lo haremos vía API)
CREATE POLICY "System can insert daily transits"
    ON public.daily_transits FOR INSERT
    WITH CHECK (true); -- En realidad la API usa service key o el usuario autenticado actúa como trigger, lo dejaremos abierto para facilitar la caché "on demand"

-- 2. Tabla de Horóscopos Diarios por Usuario
-- Historial para no cobrar dos veces si entran el mismo día
CREATE TABLE IF NOT EXISTS public.daily_horoscopes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    content JSONB NOT NULL, -- La interpretación de la IA { "message": "...", "lucky_color": "..." }
    transits_snapshot JSONB, -- Copia de los tránsitos usados (por si acaso)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date) -- Un solo horóscopo por usuario por día
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_daily_horoscopes_user_date ON public.daily_horoscopes(user_id, date);

-- Políticas RLS para daily_horoscopes
ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own daily horoscopes"
    ON public.daily_horoscopes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily horoscopes"
    ON public.daily_horoscopes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 3. Registrar el Tipo de Lectura
INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order)
VALUES ('daily_scope', 'Horóscopo Evolutivo', 'Tu guía personalizada para el día de hoy basada en tus tránsitos reales.', 10, '📅', 0)
ON CONFLICT (code) DO UPDATE 
SET credit_cost = 10, description = 'Tu guía personalizada para el día de hoy basada en tus tránsitos reales.', sort_order = 0;

-- 4. Comentarios
COMMENT ON TABLE public.daily_transits IS 'Global cache for daily planetary positions to minimize API costs';
COMMENT ON TABLE public.daily_horoscopes IS 'Personalized daily generated horoscopes for users';

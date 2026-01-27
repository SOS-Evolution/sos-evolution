-- =============================================
-- 13: SYSTEM SETTINGS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Poliza: Todos pueden leer (para que el cliente vea la config)
CREATE POLICY "Anyone can read system settings"
    ON public.system_settings FOR SELECT
    USING (true);

-- Poliza: Solo admins pueden modificar
CREATE POLICY "Only admins can modify system settings"
    ON public.system_settings FOR UPDATE
    USING (public.is_admin());

-- Insertar configuración inicial del marco de tarot
INSERT INTO public.system_settings (key, value, description)
VALUES 
    ('tarot_frame', '"celestial"', 'Marco global por defecto para las cartas de tarot')
ON CONFLICT (key) DO NOTHING;

COMMENT ON TABLE public.system_settings IS 'Global platform configurations and settings';

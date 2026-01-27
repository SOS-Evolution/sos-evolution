-- =============================================
-- 15: ADD DISPLAY_NAME TO PROFILES
-- =============================================

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='display_name') THEN
        ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
    END IF;
END $$;

COMMENT ON COLUMN public.profiles.display_name IS 'Nombre de usuario/apodo para uso en la interfaz (sin impacto en cálculos)';

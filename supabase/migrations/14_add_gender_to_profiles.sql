-- =============================================
-- 14: ADD GENDER TO PROFILES
-- =============================================

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='gender') THEN
        ALTER TABLE public.profiles ADD COLUMN gender TEXT;
    END IF;
END $$;

COMMENT ON COLUMN public.profiles.gender IS 'Sexo de nacimiento del usuario para cálculos precisos';

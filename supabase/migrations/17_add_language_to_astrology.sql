-- =============================================
-- 17: ADD LANGUAGE TO ASTROLOGY INTERPRETATIONS
-- =============================================

ALTER TABLE public.astrology_interpretations 
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es';

-- Update existing records to 'es' (default) if any
UPDATE public.astrology_interpretations SET language = 'es' WHERE language IS NULL;

-- Comment for clarity
COMMENT ON COLUMN public.astrology_interpretations.language IS 'The locale (es/en) used for the AI interpretation';

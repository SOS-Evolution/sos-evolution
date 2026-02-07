-- =============================================
-- 18: ADD CHART CACHE TO PROFILES
-- =============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS astrology_chart JSONB;

COMMENT ON COLUMN public.profiles.astrology_chart IS 'Cached result from FreeAstrologyAPI for the current natal chart';

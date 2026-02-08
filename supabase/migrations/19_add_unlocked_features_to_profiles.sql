-- =============================================
-- 19: ADD UNLOCKED FEATURES TO PROFILES
-- =============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS unlocked_features TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.unlocked_features IS 'List of features unlocked by the user using AURA (e.g., astrology, numerology)';

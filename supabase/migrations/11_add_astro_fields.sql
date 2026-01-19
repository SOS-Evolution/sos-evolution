-- Add Astrology fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS birth_time TIME DEFAULT '12:00',
ADD COLUMN IF NOT EXISTS latitude NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS longitude NUMERIC DEFAULT 0;

-- Update the comment
COMMENT ON TABLE public.profiles IS 'User profiles with astrology data';

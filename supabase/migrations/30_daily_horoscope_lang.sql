-- =============================================
-- 30: DAILY PROMPTS LANGUAGE SUPPORT - SCHEMA UPDATE
-- =============================================

-- 1. Add 'language' column to daily_horoscopes if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'daily_horoscopes' AND column_name = 'language') THEN
        ALTER TABLE public.daily_horoscopes ADD COLUMN language TEXT NOT NULL DEFAULT 'es';
    END IF;
END $$;

-- 2. Drop old unique constraint (user_id, date)
ALTER TABLE public.daily_horoscopes DROP CONSTRAINT IF EXISTS daily_horoscopes_user_id_date_key;

-- 3. Add new unique constraint (user_id, date, language)
-- This allows a user to have one horoscope in 'es' and another in 'en' for the same day.
ALTER TABLE public.daily_horoscopes ADD CONSTRAINT daily_horoscopes_user_id_date_lang_key UNIQUE (user_id, date, language);

-- 4. Update existing rows to match the content language if possible (optional, defaulting to 'es' is fine for now as most are likely Spanish)

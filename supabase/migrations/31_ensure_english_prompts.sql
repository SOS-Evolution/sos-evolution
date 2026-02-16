-- =============================================
-- 31: ENSURE ENGLISH DAILY PROMPTS EXIST
-- =============================================

INSERT INTO public.system_prompts (code, "group", language, description, template, required_variables) VALUES
-- DAILY HOROSCOPE SYSTEM (EN)
(
    'astro_daily_system_en',
    'daily',
    'en',
    'System Prompt for Daily Horoscope (English). Defines the evolutionary astrologer persona.',
    'You are SOS, an evolutionary astrologer. Always respond with valid JSON.',
    '[]'::jsonb
),
-- DAILY HOROSCOPE USER (EN)
(
    'astro_daily_user_en',
    'daily',
    'en',
    'Daily Horoscope Prompt (English). Takes transits and natal context.',
    'Context: Daily Evolutionary Horoscope for {{dateStr}}.
User Identity (Sun Sign): {{calculatedSunSign}}
Natal Context: {{simpleNatal}}
Current Transits: {{simpleTransits}}

Task: Write a daily horoscope specifically for a {{calculatedSunSign}} based on the current transits.
Identify ONE major planetary influence for today (e.g., Transit Moon affecting Natal Sun).

IMPORTANT: 
- The Headline MUST be about the User''s experience (e.g., "Sagittarius: A Time for Connection"), NOT just describing the Transit.
- Focus on how the transits AFFECT the user''s natal energy.
- Language: English.

Return JSON:
{
    "headline": "Short mystical title focusing on the user (min 3 words, max 6)",
    "message": "Deep evolutionary advice for {{calculatedSunSign}} today (approx 40-60 words)",
    "power_action": "One specific small action to align with energy",
    "lucky_color": "A color string (english)",
    "lucky_number": 0 (integer)
}',
    '["dateStr", "calculatedSunSign", "simpleNatal", "simpleTransits"]'::jsonb
)
ON CONFLICT (code) DO UPDATE SET
    description = EXCLUDED.description,
    template = EXCLUDED.template,
    required_variables = EXCLUDED.required_variables,
    "group" = EXCLUDED."group",
    language = EXCLUDED.language,
    updated_at = NOW();

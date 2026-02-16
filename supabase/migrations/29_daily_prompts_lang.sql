-- =============================================
-- 29: DAILY PROMPTS LANGUAGE SPECIFIC
-- =============================================

INSERT INTO public.system_prompts (code, "group", language, description, template, required_variables) VALUES
-- DAILY HOROSCOPE SYSTEM (ES)
(
    'astro_daily_system_es',
    'daily',
    'es',
    'System Prompt para Horóscopo Diario (Español). Define la personalidad de astrólogo evolutivo.',
    'Eres SOS, un astrólogo evolutivo. Responde siempre con JSON válido.',
    '[]'::jsonb
),
-- DAILY HOROSCOPE SYSTEM (EN)
(
    'astro_daily_system_en',
    'daily',
    'en',
    'System Prompt for Daily Horoscope (English). Defines the evolutionary astrologer persona.',
    'You are SOS, an evolutionary astrologer. Always respond with valid JSON.',
    '[]'::jsonb
),
-- DAILY HOROSCOPE USER (ES)
(
    'astro_daily_user_es',
    'daily',
    'es',
    'Prompt Horóscopo Diario (Español). Recibe tránsitos y contexto natal.',
    'Contexto: Horóscopo Evolutivo Diario para {{dateStr}}.
Identidad del Usuario (Signo Solar): {{calculatedSunSign}}
Contexto Natal: {{simpleNatal}}
Tránsitos Actuales: {{simpleTransits}}

Tarea: Escribe un horóscopo diario para un {{calculatedSunSign}} basado en los tránsitos actuales.
Identifica UNA influencia planetaria mayor para hoy (ej. Luna en Tránsito afectando Sol Natal).

IMPORTANTE: 
- El Titular DEBE tratar sobre la experiencia del Usuario, NO solo describir el Tránsito.
- Enfócate en cómo los tránsitos AFECTAN la energía natal del usuario.
- Idioma: Español.

Devuelve JSON:
{
    "headline": "Título místico corto centrado en el usuario (mín 3 palabras, máx 6)",
    "message": "Consejo evolutivo profundo para {{calculatedSunSign}} hoy (aprox 40-60 palabras)",
    "power_action": "Una pequeña acción específica para alinearse con la energía",
    "lucky_color": "Un color (string español)",
    "lucky_number": 0 (numero entero)
}',
    '["dateStr", "calculatedSunSign", "simpleNatal", "simpleTransits"]'::jsonb
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

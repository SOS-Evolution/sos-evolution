-- =============================================
-- 28: SYSTEM PROMPTS TABLE & ADMIN SETUP
-- =============================================

-- Ensure role column exists in profiles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Create is_admin function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE TABLE IF NOT EXISTS public.system_prompts (
    code TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    template TEXT NOT NULL,
    required_variables JSONB DEFAULT '[]'::jsonb,
    "group" TEXT NOT NULL, -- 'tarot', 'astrology', 'daily', etc.
    language TEXT NOT NULL DEFAULT 'multi', -- 'es', 'en', 'multi'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asegurar que la columna existe si la tabla ya existía
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'system_prompts' AND column_name = 'language') THEN
        ALTER TABLE public.system_prompts ADD COLUMN language TEXT NOT NULL DEFAULT 'multi';
    END IF;
END $$;


-- Habilitar RLS
ALTER TABLE public.system_prompts ENABLE ROW LEVEL SECURITY;

-- Políticas:
-- Dropear primero para evitar error "policy already exists"
DROP POLICY IF EXISTS "Admins can view all prompts" ON public.system_prompts;
DROP POLICY IF EXISTS "Admins can update prompts" ON public.system_prompts;

CREATE POLICY "Admins can view all prompts"
    ON public.system_prompts FOR SELECT
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update prompts"
    ON public.system_prompts FOR UPDATE
    USING (public.is_admin(auth.uid()));

-- Insertar Seed Data

INSERT INTO public.system_prompts (code, "group", language, description, template, required_variables) VALUES
-- TAROT SYSTEM
(
    'tarot_system',
    'tarot',
    'multi',
    'System Prompt para Lecturas de Tarot. Define la personalidad básica del lector.',
    'You are a mystical tarot reader. Output only valid JSON.',
    '[]'::jsonb
),
-- TAROT USER
(
    'tarot_user',
    'tarot',
    'multi',
    'User Prompt principal para Tarot. Recibe la carta, el tipo de lectura y el contexto del usuario para generar la interpretación profunda.',
    'Actúa como SOS (Soul Operating System). Carta: {{selectedCard}}.
{{typeContext}}
{{positionContext}}
Contexto del usuario: {{userContext}}

IMPORTANT: Respond strictly in {{language}}.

Return a JSON object with these FOUR fields (all are required):
- "cardName": exactly "{{selectedCard}}"
- "keywords": an array of exactly 3 mystical keywords related to the card''s energy and meaning (each keyword should be 1-3 words)
- "description": a deep, mystical interpretation of the card (minimum 50 words, be poetic and insightful)
- "action": a specific ritual, action or practice the user should do based on this card (minimum 15 words)

Schema for reference:
{{schemaJSON}}

CRITICAL: The "description" field must be a FULL mystical interpretation, NOT a label or title. It must be at least 50 words long.
The "action" field must be a specific actionable suggestion, NOT empty or generic.',
    '["selectedCard", "typeContext", "positionContext", "userContext", "language", "schemaJSON"]'::jsonb
),
-- TAROT RETRY
(
    'tarot_retry',
    'tarot',
    'multi',
    'Prompt de reintento corto para Tarot. Se usa si la primera respuesta falla o es incompleta.',
    'Interpret the tarot card "{{selectedCard}}" in {{language}}. Return JSON: {"cardName": "{{selectedCard}}", "keywords": ["word1", "word2", "word3"], "description": "A deep mystical interpretation of at least 50 words", "action": "A specific ritual or action suggestion of at least 15 words"}',
    '["selectedCard", "language"]'::jsonb
),

-- ASTROLOGY NATAL SYSTEM (EN)
(
    'astro_natal_system_en',
    'astrology',
    'en',
    'System Prompt for Natal Chart (English). Defines the expert astrologer persona.',
    'You are SOS (Soul Operating System), an expert astrologer specializing in evolutionary and psychological astrology. You always respond with valid JSON only, no markdown or extra text.',
    '[]'::jsonb
),
-- ASTROLOGY NATAL SYSTEM (ES)
(
    'astro_natal_system_es',
    'astrology',
    'es',
    'System Prompt para Carta Natal (Español). Define la personalidad de astrólogo experto.',
    'Eres SOS (Soul Operating System), un astrólogo experto en astrología evolutiva y psicológica. Siempre respondes únicamente con JSON válido, sin markdown ni texto extra.',
    '[]'::jsonb
),
-- ASTROLOGY NATAL USER (EN)
(
    'astro_natal_user_en',
    'astrology',
    'en',
    'Natal Chart Interpretation Prompt (English). Takes planets, houses and aspects data.',
    'Analyze this natal chart and provide a deep, empowering interpretation for personal evolution.

PLANETS:
{{planetsData}}

HOUSES:
{{housesData}}

ASPECTS (top 10):
{{aspectsData}}

Provide your interpretation in this EXACT JSON format (no markdown, pure JSON):
{
  "summary": "2-3 sentence mystical summary of their soul''s journey",
  "core_personality": "Deep analysis of Sun, Moon, and Ascendant combination",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "evolutionary_advice": "Guidance for soul evolution in this incarnation"
}',
    '["planetsData", "housesData", "aspectsData"]'::jsonb
),
-- ASTROLOGY NATAL USER (ES)
(
    'astro_natal_user_es',
    'astrology',
    'es',
    'Prompt de Interpretación de Carta Natal (Español). Recibe datos de planetas, casas y aspectos.',
    'Analiza esta carta natal y proporciona una interpretación profunda y empoderadora para la evolución personal.

PLANETAS:
{{planetsData}}

CASAS:
{{housesData}}

ASPECTOS (top 10):
{{aspectsData}}

Proporciona tu interpretación en este formato JSON EXACTO (sin markdown, JSON puro):
{
  "summary": "Resumen místico de 2-3 oraciones sobre el viaje del alma",
  "core_personality": "Análisis profundo de la combinación Sol, Luna y Ascendente",
  "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "challenges": ["desafío 1", "desafío 2", "desafío 3"],
  "evolutionary_advice": "Consejos para la evolución del alma en esta encarnación"
}',
    '["planetsData", "housesData", "aspectsData"]'::jsonb
),

-- DAILY HOROSCOPE SYSTEM
(
    'astro_daily_system',
    'daily',
    'multi',
    'System Prompt for Daily Horoscope. Defines the evolutionary astrologer persona.',
    'You are SOS, an evolutionary astrologer. Output valid JSON.',
    '[]'::jsonb
),
-- DAILY HOROSCOPE USER
(
    'astro_daily_user',
    'daily',
    'multi',
    'Daily Horoscope Prompt. Takes current transits and user natal context.',
    'Context: Daily Evolutionary Horoscope for {{dateStr}}.
User Identity (Sun Sign): {{calculatedSunSign}}
User Full Natal Context: {{simpleNatal}}
Current Transits: {{simpleTransits}}

Task: Write a daily horoscope specifically for a {{calculatedSunSign}} based on the current transits.
Identify ONE major planetary influence for today (e.g., Transit Moon affecting Natal Sun).

IMPORTANT: 
- The Headline MUST be about the User''s experience (e.g., "Sagittarius: A Time for Connection"), NOT just describing the Transit (do NOT say "Pisces Season" if user is Sagittarius).
- Focus on how the transits AFFECT the user''s natal energy.

Language: {{language}}

Return JSON:
{
    "headline": "Short mystical title focusing on the user (max 5 words)",
    "message": "Deep evolutionary advice for {{calculatedSunSign}} today (approx 40-60 words)",
    "power_action": "One specific small action to align with energy",
    "lucky_color": "A color string",
    "lucky_number": "A number"
}',
    '["dateStr", "calculatedSunSign", "simpleNatal", "simpleTransits", "language"]'::jsonb
)
ON CONFLICT (code) DO UPDATE SET
    description = EXCLUDED.description,
    template = EXCLUDED.template,
    required_variables = EXCLUDED.required_variables,
    "group" = EXCLUDED."group",
    language = EXCLUDED.language,
    updated_at = NOW();

-- Trigger para updated_at
DROP TRIGGER IF EXISTS prompts_updated_at ON public.system_prompts;
CREATE TRIGGER prompts_updated_at
    BEFORE UPDATE ON public.system_prompts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

COMMENT ON TABLE public.system_prompts IS 'Almacena los prompts del sistema para ser editados dinámicamente';

import { createClient } from '@/lib/supabase/server';

// =============================================
// In-Memory Prompt Cache with TTL (10 minutes)
// =============================================

interface CachedPrompt {
    template: string;
    cachedAt: number;
}

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const promptCache = new Map<string, CachedPrompt>();

/** Fallback prompts in case DB is momentarily unreachable */
const FALLBACK_PROMPTS: Record<string, string> = {
    tarot_system: 'You are a mystical tarot reader. Output only valid JSON.',
    tarot_user: `Actúa como SOS (Soul Operating System). Carta: {{selectedCard}}.
{{typeContext}}
{{positionContext}}
Contexto del usuario: {{userContext}}

IMPORTANT: Respond strictly in {{language}}.

Return a JSON object with these FOUR fields (all are required):
- "cardName": exactly "{{selectedCard}}"
- "keywords": an array of exactly 3 mystical keywords related to the card's energy and meaning (each keyword should be 1-3 words)
- "description": a deep, mystical interpretation of the card (minimum 50 words, be poetic and insightful)
- "action": a specific ritual, action or practice the user should do based on this card (minimum 15 words)

Schema for reference:
{{schemaJSON}}`,
    tarot_retry: `Actúa como SOS. Vuelve a generar la lectura para la carta {{selectedCard}} en {{language}} asegurándote de que todos los campos del JSON estén completos y sigan el formato.`,
    astro_natal_system_es: 'Eres un astrólogo evolutivo y maestro de sabiduría ancestral. Responde estrictamente en formato JSON válido.',
    astro_natal_system_en: 'You are an evolutionary astrologer and spiritual guide. Respond strictly in valid JSON format.',
    astro_natal_user_es: 'Interpreta la siguiente carta natal evolutiva.\nPlanetas: {{planetsData}}\nCasas: {{housesData}}\nAspectos: {{aspectsData}}\nResponde en JSON con: summary, core_personality, strengths, challenges, evolutionary_advice.',
    astro_natal_user_en: 'Interpret the following evolutionary natal chart.\nPlanets: {{planetsData}}\nHouses: {{housesData}}\nAspects: {{aspectsData}}\nRespond in JSON with: summary, core_personality, strengths, challenges, evolutionary_advice.',
};

/**
 * Invalidates the prompt cache. Call this after updating prompts in the admin panel.
 * @param code Optional prompt code to invalidate specifically, or omit to clear all.
 */
export function invalidatePromptCache(code?: string): void {
    if (code) {
        promptCache.delete(code);
        console.log(`[PromptCache] Invalidation for '${code}'`);
    } else {
        promptCache.clear();
        console.log('[PromptCache] Full cache cleared');
    }
}

/**
 * Retrieves a system prompt from cache or the database and interpolates variables.
 * @param code The unique code of the prompt (e.g., 'tarot_user')
 * @param variables An object containing variable names and their values
 * @returns The processed prompt string
 */
export async function getPrompt(code: string, variables: Record<string, string | number> = {}): Promise<string> {
    const now = Date.now();
    const cached = promptCache.get(code);

    let template: string;

    // 1. Check in-memory cache first (0ms latency)
    if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
        template = cached.template;
    } else {
        try {
            const supabase = await createClient();
            const { data: promptData, error } = await supabase
                .from('system_prompts')
                .select('template')
                .eq('code', code)
                .maybeSingle();

            if (error || !promptData?.template) {
                console.warn(`[PromptCache] DB fetch failed for '${code}', using fallback.`, error?.message);
                template = cached?.template || FALLBACK_PROMPTS[code] || '';
                if (!template) {
                    throw new Error(`System Prompt '${code}' not found in DB or fallbacks.`);
                }
            } else {
                template = promptData.template;
                // Store in cache
                promptCache.set(code, { template, cachedAt: now });
            }
        } catch (err) {
            console.error(`[PromptCache] Error connecting to DB for '${code}':`, err);
            template = cached?.template || FALLBACK_PROMPTS[code] || '';
            if (!template) {
                throw err;
            }
        }
    }

    // 2. Interpolate variables: replaces {{variableName}} with value
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        template = template.replace(regex, String(value));
    });

    // 3. Optional warning for unreplaced variables
    if (template.match(/{{.*?}}/)) {
        console.warn(`[PromptCache] Warning: Unreplaced variables remaining in '${code}'`);
    }

    return template;
}

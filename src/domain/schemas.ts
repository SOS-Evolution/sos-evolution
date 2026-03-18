import { z } from 'zod';

// =============================================
// AI Response Schemas (Zod validation)
// =============================================

/** Tarot reading AI response */
export const TarotAiResponseSchema = z.object({
    cardName: z.string().min(1),
    keywords: z.array(z.string()).min(1).max(10),
    description: z.string().min(20),
    action: z.string().min(10),
});
export type TarotAiResponse = z.infer<typeof TarotAiResponseSchema>;

/** Astrology natal chart interpretation AI response */
export const AstrologyInterpretationSchema = z.object({
    summary: z.string().min(10),
    core_personality: z.string().min(10),
    strengths: z.array(z.string()).min(1),
    challenges: z.array(z.string()).min(1),
    evolutionary_advice: z.string().min(10),
});
export type AstrologyInterpretation = z.infer<typeof AstrologyInterpretationSchema>;

/** Daily horoscope AI response — flexible since content varies */
export const DailyHoroscopeSchema = z.record(z.string(), z.unknown()).refine(
    (obj) => Object.keys(obj).length > 0,
    { message: 'Horoscope content cannot be empty' }
);

// =============================================
// Tarot Domain
// =============================================

export const TAROT_DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
] as const;

/** Fallback costs if DB is misconfigured */
export const READING_COSTS: Record<string, number> = {
    'daily': 20,
    'general': 20,
    'classic': 100,
};

/** Tarot AI response JSON schema definition for LLM prompt */
export const TAROT_RESPONSE_SCHEMA_JSON = JSON.stringify({
    type: "object",
    properties: {
        cardName: { type: "string", description: "Nombre exacto de la carta elegida" },
        keywords: {
            type: "array",
            items: { type: "string" },
            description: "Exactamente 3 palabras clave temáticas de la carta"
        },
        description: { type: "string", description: "Interpretación mística profunda de mínimo 50 palabras" },
        action: { type: "string", description: "Acción o ritual sugerido de mínimo 15 palabras" }
    },
    required: ["cardName", "keywords", "description", "action"]
}, null, 2);

/** Astrology interpretation JSON schema for LLM prompt */
export const ASTROLOGY_RESPONSE_SCHEMA_JSON = JSON.stringify({
    description: "Astrological natal chart interpretation",
    type: "object",
    properties: {
        summary: { type: "string", description: "Mystical and evolutionary summary (2-3 sentences)" },
        core_personality: { type: "string", description: "Analysis of the personality core (Sun, Moon, Ascendant)" },
        strengths: {
            type: "array",
            items: { type: "string" },
            description: "3 main strengths based on the chart"
        },
        challenges: {
            type: "array",
            items: { type: "string" },
            description: "3 challenges or shadows to integrate"
        },
        evolutionary_advice: { type: "string", description: "Advice for soul evolution in this incarnation" }
    },
    required: ["summary", "core_personality", "strengths", "challenges", "evolutionary_advice"]
}, null, 2);

// =============================================
// Tarot Fallback Defaults
// =============================================

export const TAROT_FALLBACK_KEYWORDS = ['Misterio', 'Transformación', 'Revelación'];

export function getTarotFallbackDescription(cardName: string): string {
    return `La carta ${cardName} se manifiesta en tu lectura como una señal del universo. Su energía te invita a reflexionar profundamente sobre tu camino actual y las fuerzas que te rodean.`;
}

export const TAROT_FALLBACK_ACTION = 'Tómate un momento de silencio hoy para meditar sobre el mensaje de esta carta. Deja que su energía te guíe.';

// =============================================
// Astrology Fallback Defaults
// =============================================

export const ASTROLOGY_FALLBACK = {
    summary: "Tu carta natal revela un camino único de evolución espiritual.",
    core_personality: "Tu esencia combina múltiples energías planetarias que definen tu camino.",
    strengths: ["Capacidad de transformación", "Intuición desarrollada", "Voluntad evolutiva"],
    challenges: ["Integración de dualidades", "Superar patrones heredados", "Aceptación del destino"],
    evolutionary_advice: "Confía en el proceso de tu evolución, cada desafío es una oportunidad de crecimiento."
};

// =============================================
// API Envelope (standard response wrapper)
// =============================================

export interface ApiEnvelope<T> {
    data: T | null;
    error: string | null;
    meta?: {
        creditsUsed?: number;
        newBalance?: number;
        [key: string]: unknown;
    };
}

export function successEnvelope<T>(data: T, meta?: ApiEnvelope<T>['meta']): ApiEnvelope<T> {
    return { data, error: null, meta };
}

export function errorEnvelope(error: string): ApiEnvelope<never> {
    return { data: null, error };
}

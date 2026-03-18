import { SupabaseClient } from '@supabase/supabase-js';
import { createAiGateway, type AiGateway } from '@/src/gateways/ai-gateway';
import { getPrompt } from '@/lib/prompts';
import {
    TarotAiResponseSchema,
    TarotAiResponse,
    AstrologyInterpretation,
    AstrologyInterpretationSchema,
    TAROT_DECK,
    READING_COSTS,
    TAROT_RESPONSE_SCHEMA_JSON,
    TAROT_FALLBACK_KEYWORDS,
    TAROT_FALLBACK_ACTION,
    getTarotFallbackDescription,
    ASTROLOGY_FALLBACK,
} from '@/src/domain/schemas';
import { DatabaseError } from '@/src/domain/errors';

// =============================================
// OracleService — AI Reading Orchestrator
// =============================================

export interface TarotReadingParams {
    question?: string;
    cardIndex?: number;
    readingTypeCode?: string;
    position?: string;
    locale?: string;
}

export interface TarotReadingResult {
    reading: TarotAiResponse;
    savedId: number | string;
    readingTypeName: string;
    cost: number;
}

export interface AstrologyInterpretationResult {
    interpretation: AstrologyInterpretation;
    savedId: string;
    cost: number;
}

export class OracleService {
    private ai: AiGateway;

    constructor(private supabase: SupabaseClient) {
        this.ai = createAiGateway();
    }

    // =============================================
    // TAROT
    // =============================================

    /**
     * Resolve reading type from DB, with fallback to 'general'.
     */
    async resolveReadingType(code: string) {
        let { data: readingType } = await this.supabase
            .from('reading_types')
            .select('*')
            .eq('code', code)
            .single();

        if (!readingType) {
            console.log(`Reading type '${code}' not found. Falling back to 'general'.`);
            const { data: generalType } = await this.supabase
                .from('reading_types')
                .select('*')
                .eq('code', 'general')
                .single();

            readingType = generalType;

            if (!readingType) {
                throw new DatabaseError('reading_types', "'general' reading type not found in DB");
            }
        }

        // Ensure valid cost
        let cost = readingType.credit_cost;
        if ((!cost || cost <= 0) && READING_COSTS[readingType.code]) {
            console.warn(`DB cost for ${readingType.code} is ${cost}. Using fallback: ${READING_COSTS[readingType.code]}`);
            cost = READING_COSTS[readingType.code];
        }

        return { readingType, cost };
    }

    /**
     * Generate a tarot reading using AI, validate with Zod, save to DB.
     */
    async generateTarotReading(userId: string, params: TarotReadingParams): Promise<TarotReadingResult> {
        const {
            question,
            cardIndex,
            readingTypeCode = 'general',
            position,
            locale = 'es',
        } = params;

        // 1. Resolve reading type
        const { readingType, cost } = await this.resolveReadingType(readingTypeCode);

        // 2. Select card
        const selectedCard = (typeof cardIndex === 'number' && cardIndex >= 0 && cardIndex < TAROT_DECK.length)
            ? TAROT_DECK[cardIndex]
            : TAROT_DECK[Math.floor(Math.random() * TAROT_DECK.length)];

        // 3. Build context
        const userContext = question
            ? `Pregunta específica del usuario: "${question}". Busca respuesta y guía sobre esto.`
            : "Busca evolución personal.";

        const typeContext = `Tipo de lectura: ${readingType.name}. ${readingType.description}`;

        let positionContext = "";
        if (position) {
            const positionDescriptions: Record<string, string> = {
                "Pasado": 'Interpreta esta carta como las energías, lecciones o patrones que vienen del pasado del consultante. ¿Qué fundamentos o bloqueos heredados influyen?',
                "Presente": 'Interpreta esta carta como la energía actual que domina la situación. ¿Qué está ocurriendo ahora y qué consciencia se necesita?',
                "Futuro": 'Interpreta esta carta como la energía hacia la que se dirige el consultante. ¿Qué potencial se está manifestando si sigue este camino?',
            };
            positionContext = `\nEsta carta representa la posición "${position}" en una tirada de Evolución Temporal.\n${positionDescriptions[position] || ''}`;
        }

        // 4. Generate with AI
        const systemPrompt = await getPrompt('tarot_system');
        const userPrompt = await getPrompt('tarot_user', {
            selectedCard,
            typeContext,
            positionContext,
            userContext,
            language: locale === 'en' ? 'English' : 'Spanish',
            schemaJSON: TAROT_RESPONSE_SCHEMA_JSON,
        });

        let rawJson = await this.ai.generateJson({ systemPrompt, userPrompt });
        let aiResponse: TarotAiResponse;

        try {
            const parsed = JSON.parse(rawJson);
            parsed.cardName = selectedCard;

            // Validate with Zod — try to parse
            const result = TarotAiResponseSchema.safeParse(parsed);

            if (result.success) {
                aiResponse = result.data;
            } else {
                console.warn('Tarot AI response failed Zod validation, attempting retry...', result.error.issues);
                // Retry with explicit prompt
                const retryPrompt = await getPrompt('tarot_retry', {
                    selectedCard,
                    language: locale === 'en' ? 'English' : 'Spanish',
                });

                const retryJson = await this.ai.generateJson({
                    systemPrompt: "You are a mystical tarot reader. Output only valid JSON. Every field must contain meaningful content.",
                    userPrompt: retryPrompt,
                    temperature: 0.8,
                });

                const retryParsed = JSON.parse(retryJson);
                retryParsed.cardName = selectedCard;
                const retryResult = TarotAiResponseSchema.safeParse(retryParsed);

                if (retryResult.success) {
                    aiResponse = retryResult.data;
                } else {
                    // Use fallbacks
                    aiResponse = this.buildTarotFallback(selectedCard, parsed);
                }
            }
        } catch {
            console.error('Failed to parse AI JSON response for tarot reading');
            aiResponse = this.buildTarotFallback(selectedCard);
        }

        // 5. Save to DB
        const { data: savedReading, error: dbError } = await this.supabase
            .from('lecturas')
            .insert([{
                card_name: aiResponse.cardName,
                keywords: aiResponse.keywords,
                description: aiResponse.description,
                action: aiResponse.action,
                user_id: userId,
                reading_type_id: readingType.id,
                question: question || null,
                position: position || null,
            }])
            .select()
            .single();

        if (dbError) {
            console.error('CRITICAL DB ERROR during reading insert:', dbError);
            throw new DatabaseError('lecturas.insert', dbError.message);
        }

        return {
            reading: aiResponse,
            savedId: savedReading.id,
            readingTypeName: readingType.name,
            cost,
        };
    }

    /**
     * Build a safe tarot response with fallback values.
     */
    private buildTarotFallback(cardName: string, partial?: Partial<TarotAiResponse>): TarotAiResponse {
        return {
            cardName,
            keywords: (Array.isArray(partial?.keywords) && partial!.keywords.length > 0)
                ? partial!.keywords
                : TAROT_FALLBACK_KEYWORDS,
            description: (partial?.description && partial.description.length >= 20)
                ? partial.description
                : getTarotFallbackDescription(cardName),
            action: (partial?.action && partial.action.length >= 10)
                ? partial.action
                : TAROT_FALLBACK_ACTION,
        };
    }

    // =============================================
    // ASTROLOGY — Natal Chart Interpretation
    // =============================================

    async generateAstrologyInterpretation(
        userId: string,
        chartData: { planets: unknown[]; houses: unknown[]; aspects?: unknown[] },
        locale: string = 'es'
    ): Promise<AstrologyInterpretationResult> {
        // 1. Resolve cost
        const { data: readingType } = await this.supabase
            .from('reading_types')
            .select('*')
            .eq('code', 'astrology_full')
            .single();

        const cost = readingType?.credit_cost || 20;

        // 2. Build prompts
        const isEn = locale.startsWith('en');
        const sysKey = isEn ? 'astro_natal_system_en' : 'astro_natal_system_es';
        const userKey = isEn ? 'astro_natal_user_en' : 'astro_natal_user_es';

        const systemPrompt = await getPrompt(sysKey);

        const planetsData = JSON.stringify(
            (chartData.planets as Array<Record<string, unknown>>).map(p => ({ name: p.name, sign: p.sign, house: p.house })),
            null, 2
        );
        const housesData = JSON.stringify(
            (chartData.houses as Array<Record<string, unknown>>).map(h => ({ house: h.house, sign: h.sign })),
            null, 2
        );
        const aspectsData = JSON.stringify(
            ((chartData.aspects || []) as Array<Record<string, unknown>>).slice(0, 10).map(a => ({
                p1: a.planet1, p2: a.planet2, type: a.type,
            })),
            null, 2
        );

        const userPrompt = await getPrompt(userKey, { planetsData, housesData, aspectsData });

        // 3. Generate with AI
        const rawJson = await this.ai.generateJson({ systemPrompt, userPrompt });
        let interpretation: AstrologyInterpretation;

        try {
            const parsed = JSON.parse(rawJson);
            const result = AstrologyInterpretationSchema.safeParse(parsed);

            if (result.success) {
                interpretation = result.data;
            } else {
                console.warn('Astrology interpretation failed Zod validation, using fallbacks');
                interpretation = {
                    summary: parsed.summary || ASTROLOGY_FALLBACK.summary,
                    core_personality: parsed.core_personality || ASTROLOGY_FALLBACK.core_personality,
                    strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
                        ? parsed.strengths : ASTROLOGY_FALLBACK.strengths,
                    challenges: Array.isArray(parsed.challenges) && parsed.challenges.length > 0
                        ? parsed.challenges : ASTROLOGY_FALLBACK.challenges,
                    evolutionary_advice: parsed.evolutionary_advice || ASTROLOGY_FALLBACK.evolutionary_advice,
                };
            }
        } catch {
            console.error('Failed to parse AI JSON for astrology interpretation');
            interpretation = ASTROLOGY_FALLBACK;
        }

        // 4. Save to DB
        const { data: saved, error: dbError } = await this.supabase
            .from('astrology_interpretations')
            .insert([{
                user_id: userId,
                summary: interpretation.summary,
                core_personality: interpretation.core_personality,
                strengths: interpretation.strengths,
                challenges: interpretation.challenges,
                evolutionary_advice: interpretation.evolutionary_advice,
                chart_snapshot: chartData,
                language: locale,
            }])
            .select()
            .single();

        if (dbError) {
            console.error('Error saving astrology interpretation:', dbError);
            throw new DatabaseError('astrology_interpretations.insert', dbError.message);
        }

        return { interpretation, savedId: saved.id, cost };
    }

    // =============================================
    // ASTROLOGY — Daily Horoscope
    // =============================================

    async generateDailyHoroscope(
        userId: string,
        natalPlanets: Array<Record<string, unknown>>,
        transitsData: Record<string, unknown>,
        calculatedSunSign: string,
        locale: string = 'es'
    ): Promise<{ content: Record<string, unknown>; savedId: string; cost: number }> {
        // 1. Resolve cost
        const { data: readingType } = await this.supabase
            .from('reading_types')
            .select('*')
            .eq('code', 'daily_scope')
            .single();

        const cost = readingType?.credit_cost || 10;

        // 2. Build prompts
        const isEn = locale === 'en';
        const dateStr = new Date().toISOString().split('T')[0];
        const suffix = isEn ? 'en' : 'es';

        const simpleNatal = natalPlanets
            .map(p => `${p.name} in ${p.sign}`)
            .join(', ');

        const zodiacNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

        const simpleTransits = Object.values(transitsData)
            .filter((p: unknown) => {
                const planet = p as Record<string, unknown>;
                return planet.name && planet.current_sign !== undefined;
            })
            .map((p: unknown) => {
                const planet = p as Record<string, unknown>;
                return `${planet.name} (Transit) in ${zodiacNames[planet.current_sign as number] || 'Unknown'}`;
            })
            .join(', ');

        const systemPrompt = await getPrompt(`astro_daily_system_${suffix}`);
        const userPrompt = await getPrompt(`astro_daily_user_${suffix}`, {
            dateStr,
            calculatedSunSign,
            simpleNatal,
            simpleTransits,
        });

        // 3. Generate with AI
        const rawJson = await this.ai.generateJson({ systemPrompt, userPrompt });
        const content = JSON.parse(rawJson);

        // 4. Save to DB
        const { data: saved, error: saveError } = await this.supabase
            .from('daily_horoscopes')
            .insert([{
                user_id: userId,
                date: dateStr,
                content,
                transits_snapshot: transitsData,
                language: locale,
            }])
            .select()
            .single();

        if (saveError) {
            console.error('Error saving horoscope:', saveError);
            throw new DatabaseError('daily_horoscopes.insert', saveError.message);
        }

        return { content, savedId: saved.id, cost };
    }
}

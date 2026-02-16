import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';

const DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
];

// Schema definition kept for reference in prompt, though Groq uses JSON mode differently
// NOTE: Removed top-level "description" to avoid AI confusing schema metadata with the response field
const schemaJSON = JSON.stringify({
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

export async function POST(req: Request) {
    try {
        // Validar que existe la API key
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'Error de configuración del servidor: GROQ_API_KEY no configurada' },
                { status: 500 }
            );
        }

        // Inicializar Groq (solo en runtime, no en build time)
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const body = await req.json().catch(() => ({}));
        const { question, cardIndex, readingTypeCode = 'general', position, locale = 'es' } = body;

        // 1. VERIFICAR USUARIO
        const supabase = await createClient();
        let { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para consultar el oráculo.' },
                { status: 401 }
            );
        }

        // 2. VALIDAR TIPO Y CRÉDITOS
        console.log("Processing reading request:", { readingTypeCode, position });

        // Fallback costs in case DB is misconfigured
        const READING_COSTS: Record<string, number> = {
            'daily': 20,
            'general': 20,
            'classic': 100
        };

        let { data: readingType } = await supabase
            .from('reading_types')
            .select('*')
            .eq('code', readingTypeCode)
            .single();

        if (!readingType) {
            console.log(`Reading type '${readingTypeCode}' not found. Falling back to 'general'.`);
            const { data: generalType } = await supabase
                .from('reading_types')
                .select('*')
                .eq('code', 'general')
                .single();

            readingType = generalType;

            // CRITICAL FIX: Ensure we have a valid reading type to avoid FK errors
            if (!readingType) {
                console.error("Critical: 'general' reading type not found in DB.");
                return NextResponse.json(
                    { error: 'Error de configuración del sistema: Tipo de lectura no encontrado.' },
                    { status: 500 }
                );
            }
        }

        // Ensure we have a valid cost
        let cost = readingType.credit_cost;
        if ((!cost || cost <= 0) && READING_COSTS[readingType.code]) {
            console.warn(`Database cost for ${readingType.code} is ${cost}. Using fallback cost: ${READING_COSTS[readingType.code]}`);
            cost = READING_COSTS[readingType.code];
        }

        console.log("Reading Type Resolved:", readingType.name, "Final Cost:", cost);

        // Verificación optimista de saldo
        if (cost > 0) {
            // Use rigorous v2 function that bypasses RLS
            const { data: balanceData, error: balanceError } = await supabase.rpc('get_user_balance_v2', { p_user_id: user.id });

            if (balanceError) {
                console.error("Critical: get_user_balance_v2 failed:", balanceError);
                return NextResponse.json({ error: 'Error verificando saldo. Por favor contacta soporte.' }, { status: 500 });
            }

            const balance = balanceData || 0;
            console.log(`User ${user.id} balance: ${balance}, Cost: ${cost}`);

            if (balance < cost) {
                return NextResponse.json({
                    error: 'Aura de Evolución insuficiente para esta lectura.',
                    required: cost,
                    balance: balance
                }, { status: 402 });
            }
        }

        // 3. IA GENERATIVA (GROQ)
        // Elegir carta
        const selectedCard = (typeof cardIndex === 'number' && cardIndex >= 0 && cardIndex < DECK.length)
            ? DECK[cardIndex]
            : DECK[Math.floor(Math.random() * DECK.length)];

        let userContext = "Busca evolución personal.";
        if (question) {
            userContext = `Pregunta específica del usuario: "${question}". Busca respuesta y guía sobre esto.`;
        }

        let typeContext = `Tipo de lectura: ${readingType.name}. ${readingType.description}`;

        // Contexto especial para tiradas de posición
        let positionContext = "";
        if (position) {
            positionContext = `
            Esta carta representa la posición "${position}" en una tirada de Evolución Temporal.
            ${position === "Pasado" ? "Interpreta esta carta como las energías, lecciones o patrones que vienen del pasado del consultante. ¿Qué fundamentos o bloqueos heredados influyen?" : ""}
            ${position === "Presente" ? "Interpreta esta carta como la energía actual que domina la situación. ¿Qué está ocurriendo ahora y qué consciencia se necesita?" : ""}
            ${position === "Futuro" ? "Interpreta esta carta como la energía hacia la que se dirige el consultante. ¿Qué potencial se está manifestando si sigue este camino?" : ""}
            `;
        }

        const prompt = `
          Actúa como SOS (Soul Operating System). Carta: ${selectedCard}.
          ${typeContext}
          ${positionContext}
          Contexto del usuario: ${userContext}
          
          IMPORTANT: Respond strictly in ${locale === 'en' ? 'English' : 'Spanish'}.
          
          Return a JSON object with these FOUR fields (all are required):
          - "cardName": exactly "${selectedCard}"
          - "keywords": an array of exactly 3 mystical keywords related to the card's energy and meaning (each keyword should be 1-3 words)
          - "description": a deep, mystical interpretation of the card (minimum 50 words, be poetic and insightful)
          - "action": a specific ritual, action or practice the user should do based on this card (minimum 15 words)
          
          Schema for reference:
          ${schemaJSON}
          
          CRITICAL: The "description" field must be a FULL mystical interpretation, NOT a label or title. It must be at least 50 words long.
          The "action" field must be a specific actionable suggestion, NOT empty or generic.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a mystical tarot reader. Output only valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const resultText = completion.choices[0]?.message?.content || "{}";

        let aiResponse;
        try {
            aiResponse = JSON.parse(resultText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.error("Raw Text:", resultText);
            return NextResponse.json({ error: 'Error procesando respuesta de la IA' }, { status: 500 });
        }

        aiResponse.cardName = selectedCard;

        // Validate response quality — if AI returned schema metadata or empty fields, log and provide fallbacks
        if (!aiResponse.description || typeof aiResponse.description !== 'string' || aiResponse.description.length < 20 || aiResponse.description.toLowerCase() === 'lectura de tarot') {
            console.warn('AI returned incomplete description, attempting retry...');
            // Quick retry with a more explicit prompt
            try {
                const retryCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "You are a mystical tarot reader. Output only valid JSON. Every field must contain meaningful content." },
                        { role: "user", content: `Interpret the tarot card "${selectedCard}" in ${locale === 'en' ? 'English' : 'Spanish'}. Return JSON: {"cardName": "${selectedCard}", "keywords": ["word1", "word2", "word3"], "description": "A deep mystical interpretation of at least 50 words", "action": "A specific ritual or action suggestion of at least 15 words"}` }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.8,
                    response_format: { type: "json_object" }
                });
                const retryText = retryCompletion.choices[0]?.message?.content || "{}";
                const retryResponse = JSON.parse(retryText);
                retryResponse.cardName = selectedCard;
                if (retryResponse.description && retryResponse.description.length >= 20) {
                    aiResponse = retryResponse;
                    console.log('Retry succeeded with valid content');
                }
            } catch (retryErr) {
                console.error('Retry also failed:', retryErr);
            }
        }

        // Final safety: ensure all fields exist with meaningful defaults
        if (!Array.isArray(aiResponse.keywords) || aiResponse.keywords.length === 0) {
            aiResponse.keywords = ['Misterio', 'Transformación', 'Revelación'];
        }
        if (!aiResponse.description || aiResponse.description.length < 20) {
            aiResponse.description = `La carta ${selectedCard} se manifiesta en tu lectura como una señal del universo. Su energía te invita a reflexionar profundamente sobre tu camino actual y las fuerzas que te rodean.`;
        }
        if (!aiResponse.action || aiResponse.action.length < 10) {
            aiResponse.action = 'Tómate un momento de silencio hoy para meditar sobre el mensaje de esta carta. Deja que su energía te guíe.';
        }

        // 4. GUARDAR EN DB
        const { data: savedReading, error: dbError } = await supabase
            .from('lecturas')
            .insert([
                {
                    card_name: aiResponse.cardName,
                    keywords: aiResponse.keywords,
                    description: aiResponse.description,
                    action: aiResponse.action,
                    user_id: user.id,
                    reading_type_id: readingType.id,
                    question: question || null,
                    position: position || null
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("CRITICAL DB ERROR during reading insert:", dbError);
            console.error("Payload attempted:", {
                user_id: user.id,
                reading_type_id: readingType.id,
                card_name: aiResponse.cardName
            });
            // FIX: If we cannot save the reading, we MUST NOT return it to the user.
            return NextResponse.json({
                error: 'Error guardando la lectura en el historial. No se han descontado créditos.',
                details: dbError.message
            }, { status: 500 });
        }

        // 5. DESCONTAR CRÉDITOS (Solo si se guardó bien)
        if (cost > 0) {
            // Use rigorous v2 function
            // FIX: savedReading.id is an Integer (legacy), but p_reference_id expects UUID.
            // We pass null for reference_id and include the ID in the description for auditability.
            const { error: spendError } = await supabase.rpc('spend_credits_v2', {
                p_user_id: user.id,
                p_amount: cost,
                p_description: `Lectura: ${readingType?.name || 'General'} (Ref: ${savedReading.id})`,
                p_reference_id: null
            });

            if (spendError) {
                console.error("CRITICAL: Error spending credits v2:", spendError);
            } else {
                console.log(`Successfully spent ${cost} credits for user ${user.id}`);
            }
        }

        // Obtener nuevo saldo para actualizar UI (v2)
        const { data: newBalance } = await supabase.rpc('get_user_balance_v2', { p_user_id: user.id });

        return NextResponse.json({
            ...aiResponse,
            id: savedReading?.id,
            creditsUsed: cost,
            newBalance: newBalance || 0
        });

    } catch (error: any) {
        console.error('Error general en /api/lectura:', error);
        console.error('Stack:', error?.stack);

        // Detectar error de cuota de Gemini (429)
        if (error?.message?.includes('429') || error?.message?.includes('quota')) {
            return NextResponse.json({
                error: 'Sobrecarga Cósmica: Se ha superado el límite de consultas gratuitas. Intenta de nuevo en un momento.'
            }, { status: 429 });
        }

        return NextResponse.json({ error: 'Error del sistema: ' + (error?.message || 'Unknown') }, { status: 500 });
    }
}
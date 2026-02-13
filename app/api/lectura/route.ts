import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
];

const schema: Schema = {
    description: "Lectura de tarot",
    type: SchemaType.OBJECT,
    properties: {
        cardName: { type: SchemaType.STRING, description: "Nombre de la carta elegida", nullable: false },
        keywords: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3 palabras clave"
        },
        description: { type: SchemaType.STRING, description: "Interpretación mística profunda", nullable: false },
        action: { type: SchemaType.STRING, description: "Acción o ritual sugerido", nullable: false }
    },
    required: ["cardName", "keywords", "description", "action"]
};

export async function POST(req: Request) {
    try {
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

        let { data: readingType } = await supabase
            .from('reading_types')
            .select('*')
            .eq('code', readingTypeCode)
            .single();

        if (!readingType) {
            console.log(`Reading type '${readingTypeCode}' not found. Falling back to 'general'.`);
            // Guardamos en la misma variable
            const { data: generalType } = await supabase
                .from('reading_types')
                .select('*')
                .eq('code', 'general')
                .single();

            readingType = generalType;

            if (!readingType) {
                console.error("Critical: 'general' reading type not found in DB.");
                return NextResponse.json({ error: 'Tipo de lectura no válido' }, { status: 400 });
            }
        }

        const cost = readingType.credit_cost;
        console.log("Reading Type Resolved:", readingType.name, "Cost:", cost);

        // Verificación optimista de saldo (para no gastar IA si no alcanza)
        if (cost > 0) {
            const { data: balance } = await supabase.rpc('get_user_balance', { user_uuid: user.id });
            if ((balance || 0) < cost) {
                return NextResponse.json({ error: 'Aura de Evolución insuficiente para esta lectura.' }, { status: 402 });
            }
        }

        // 3. IA GENERATIVA
        console.log("Generating content with Gemini...");
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        // Elegir carta
        const selectedCard = (typeof cardIndex === 'number' && cardIndex >= 0 && cardIndex < DECK.length)
            ? DECK[cardIndex]
            : DECK[Math.floor(Math.random() * DECK.length)];

        let userContext = "Busca evolución personal.";
        if (question) {
            userContext = `Pregunta específica del usuario: "${question}". Busca respuesta y guía sobre esto.`;
        }

        let typeContext = `Tipo de lectura: ${readingType.name}. ${readingType.description}`;

        // Contexto especial para tiradas de posición (Pasado/Presente/Futuro)
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
          Dame lectura JSON.
        `;

        const result = await model.generateContent(prompt);
        console.log("Gemini response received.");

        const dirtyText = result.response.text();
        const cleanText = dirtyText.replace(/```json/g, "").replace(/```/g, "").trim();

        let aiResponse;
        try {
            aiResponse = JSON.parse(cleanText);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            console.error("Raw Text:", dirtyText);
            return NextResponse.json({ error: 'Error procesando respuesta de la IA' }, { status: 500 });
        }

        aiResponse.cardName = selectedCard;

        // 4. GUARDAR EN DB
        console.log("Inserting reading into DB...", {
            card: aiResponse.cardName,
            typeId: readingType.id,
            position
        });

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
                card_name: aiResponse.cardName,
                keywords: aiResponse.keywords,
                description: aiResponse.description,
                action: aiResponse.action,
                user_id: user.id
            });
            // if insertion fails, we don't charge credits
        } else {
            console.log("Reading saved successfully. ID:", savedReading.id);
            // 5. DESCONTAR CRÉDITOS (Si se guardó bien)
            if (cost > 0) {
                console.log(`Spending ${cost} credits for user ${user.id}...`);
                const { error: spendError } = await supabase.rpc('spend_credits', {
                    p_user_id: user.id,
                    p_amount: cost,
                    p_description: `Lectura: ${readingType?.name || 'General'}`,
                    p_reference_id: savedReading.id
                });

                if (spendError) {
                    console.error("Error spending credits:", spendError);
                } else {
                    console.log("Credits deducted successfully.");
                }
            }
        }

        // Obtener nuevo saldo para actualizar UI
        const { data: newBalance } = await supabase.rpc('get_user_balance', { user_uuid: user.id });

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
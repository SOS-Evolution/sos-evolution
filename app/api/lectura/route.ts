import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server'; // <--- USAMOS EL CLIENTE DE SERVIDOR

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
        const { question, cardIndex, readingTypeCode = 'general' } = body;

        // 1. VERIFICAR USUARIO
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para consultar el oráculo.' },
                { status: 401 }
            );
        }

        // 2. VALIDAR TIPO Y CRÉDITOS
        const { data: readingType } = await supabase
            .from('reading_types')
            .select('*')
            .eq('code', readingTypeCode)
            .single();

        if (!readingType) {
            return NextResponse.json({ error: 'Tipo de lectura no válido' }, { status: 400 });
        }

        const cost = readingType.credit_cost;

        // Verificación optimista de saldo (para no gastar IA si no alcanza)
        if (cost > 0) {
            const { data: balance } = await supabase.rpc('get_user_balance', { user_uuid: user.id });
            if ((balance || 0) < cost) {
                return NextResponse.json({ error: 'Aura de Evolución insuficiente para esta lectura.' }, { status: 402 });
            }
        }

        // 3. IA GENERATIVA
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

        const prompt = `
          Actúa como SOS (Soul Operating System). Carta: ${selectedCard}.
          ${typeContext}
          Contexto del usuario: ${userContext}
          Dame lectura JSON en español.
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = JSON.parse(result.response.text());
        aiResponse.cardName = selectedCard;

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
                    question: question || null
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Error BD:", dbError);
            // Si la IA funcionó pero falló la BD, devolvemos resultado pero advertimos
            // No cobramos créditos si falla el guardado
        } else {
            // 5. DESCONTAR CRÉDITOS (Si se guardó bien)
            if (cost > 0) {
                await supabase.rpc('spend_credits', {
                    p_user_id: user.id,
                    p_amount: cost,
                    p_description: `Lectura: ${readingType.name}`,
                    p_reference_id: savedReading.id
                });
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

    } catch (error) {
        console.error('Error general:', error);
        return NextResponse.json({ error: 'Error del sistema' }, { status: 500 });
    }
}
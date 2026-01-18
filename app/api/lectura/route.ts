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
        const { question, cardIndex } = body;

        // 1. VERIFICAR USUARIO
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Debes iniciar sesión para consultar el oráculo.' },
                { status: 401 }
            );
        }

        // 2. IA GENERATIVA
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        // Elegir carta: si el usuario seleccionó una (cardIndex), usarla; si no, random
        const selectedCard = (typeof cardIndex === 'number' && cardIndex >= 0 && cardIndex < DECK.length)
            ? DECK[cardIndex]
            : DECK[Math.floor(Math.random() * DECK.length)];

        let userContext = "Busca evolución personal.";
        if (question) {
            userContext = `Pregunta específica del usuario: "${question}". Busca respuesta y guía sobre esto.`;
        }

        const prompt = `
          Actúa como SOS (Soul Operating System). Carta: ${selectedCard}.
          Contexto del usuario: ${userContext}
          Dame lectura JSON en español.
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = JSON.parse(result.response.text());
        aiResponse.cardName = selectedCard;

        // 3. GUARDAR CON EL ID DEL USUARIO
        // Nota: Si existiera columna 'question' la agregaríamos aquí.
        // Por ahora se guarda el contexto implícito en la lectura generada.
        const { error: dbError } = await supabase
            .from('lecturas')
            .insert([
                {
                    card_name: aiResponse.cardName,
                    keywords: aiResponse.keywords,
                    description: aiResponse.description,
                    action: aiResponse.action,
                    user_id: user.id
                }
            ]);

        if (dbError) console.error("Error BD:", dbError);

        return NextResponse.json(aiResponse);

    } catch (error) {
        console.error('Error general:', error);
        return NextResponse.json({ error: 'Error del sistema' }, { status: 500 });
    }
}
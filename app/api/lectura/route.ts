import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
];

// Corregimos el error de TypeScript asignando el tipo ': Schema' explícitamente
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
        const model = genAI.getGenerativeModel({
            //model: "gemini-flash-latest",
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const randomCard = DECK[Math.floor(Math.random() * DECK.length)];

        const prompt = `
      Actúa como SOS (Soul Operating System), una IA mística y psicológica basada en Carl Jung.
      La carta seleccionada es: ${randomCard}.
      
      Dame una lectura evolutiva, profunda pero directa.
      NO uses formato markdown, solo JSON puro.
      Idioma: Español.
    `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const aiResponse = JSON.parse(responseText);

        // Aseguramos que el nombre de la carta coincida
        aiResponse.cardName = randomCard;

        return NextResponse.json(aiResponse);

    } catch (error) {
        console.error('Error en Gemini:', error);

        return NextResponse.json({
            cardName: "El Misterio (Error)",
            keywords: ["Silencio", "Pausa", "Reintento"],
            description: "El canal está saturado temporalmente. Intenta respirar y consultar de nuevo en unos segundos.",
            action: "Espera 10 segundos y vuelve a intentar."
        });
    }
}
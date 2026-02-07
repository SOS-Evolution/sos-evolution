import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Schema } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const schema: Schema = {
    description: "Astrological natal chart interpretation",
    type: SchemaType.OBJECT,
    properties: {
        summary: { type: SchemaType.STRING, description: "Mystical and evolutionary summary (2-3 sentences)", nullable: false },
        core_personality: { type: SchemaType.STRING, description: "Analysis of the personality core (Sun, Moon, Ascendant)", nullable: false },
        strengths: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3 main strengths based on the chart"
        },
        challenges: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "3 challenges or shadows to integrate"
        },
        evolutionary_advice: { type: SchemaType.STRING, description: "Advice for soul evolution in this incarnation", nullable: false }
    },
    required: ["summary", "core_personality", "strengths", "challenges", "evolutionary_advice"]
};

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { chartData, locale = 'es' } = body;

        if (!chartData) {
            return NextResponse.json({ error: 'Faltan datos de la carta natal' }, { status: 400 });
        }

        // 1. VERIFICAR USUARIO
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // 2. VALIDAR TIPO Y CRÉDITOS
        const { data: readingType } = await supabase
            .from('reading_types')
            .select('*')
            .eq('code', 'astrology_full')
            .single();

        const cost = readingType?.credit_cost || 20;

        // Verificación de saldo
        const { data: balance } = await supabase.rpc('get_user_balance', { user_uuid: user.id });
        if ((balance || 0) < cost) {
            return NextResponse.json({ error: 'Aura insuficiente para esta interpretación.' }, { status: 402 });
        }

        // 3. IA GENERATIVA
        const model = genAI.getGenerativeModel({
            // Note: In some environments gemini-2.0-flash is available, using 1.5-flash for safety as seen in other routes if unsure, 
            // but the other route used gemini-2.5-flash (which might be a typo in user's code or a specific version they have access to).
            // Actually, looking back at /api/lectura/route.ts, it uses "gemini-2.5-flash". I will match that.
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const isEn = locale.startsWith('en');

        const prompt = isEn
            ? `
          Act as SOS (Soul Operating System), a mystic guide expert in evolutionary and psychological astrology.
          Analyze the following Natal Chart Data:
          
          PLANETS:
          ${JSON.stringify(chartData.planets.map((p: any) => ({ name: p.name, sign: p.sign, house: p.house })), null, 2)}
          
          HOUSES:
          ${JSON.stringify(chartData.houses.map((h: any) => ({ house: h.house, sign: h.sign })), null, 2)}
          
          ASPECTS:
          ${JSON.stringify(chartData.aspects?.slice(0, 10).map((a: any) => ({ p1: a.planet1, p2: a.planet2, type: a.type })), null, 2)}

          Purpose: Provide a deep, empowering interpretation oriented towards personal evolution. 
          Focus heavily on the combination of Sun, Moon, and Ascendant for the core.
          
          IMPORTANT: Respond strictly in English.
          Give me the interpretation in JSON format.
        `
            : `
          Actúa como SOS (Soul Operating System), un guía místico experto en astrología evolutiva y psicológica.
          Analiza la siguiente Carta Natal (Natal Chart Data):
          
          PLANETAS:
          ${JSON.stringify(chartData.planets.map((p: any) => ({ name: p.name, sign: p.sign, house: p.house })), null, 2)}
          
          CASAS:
          ${JSON.stringify(chartData.houses.map((h: any) => ({ house: h.house, sign: h.sign })), null, 2)}
          
          ASPECTS:
          ${JSON.stringify(chartData.aspects?.slice(0, 10).map((a: any) => ({ p1: a.planet1, p2: a.planet2, type: a.type })), null, 2)}

          Propósito: Brindar una interpretación profunda, empoderadora y orientada a la evolución personal. 
          Enfócate mucho en la combinación de Sol, Luna y Ascendente para el núcleo.
          
          IMPORTANT: Respond strictly in Spanish.
          Dame la interpretación en formato JSON.
        `;

        const result = await model.generateContent(prompt);
        const aiResponse = JSON.parse(result.response.text());

        // 4. GUARDAR EN DB
        const { data: savedInterpretation, error: dbError } = await supabase
            .from('astrology_interpretations')
            .insert([
                {
                    user_id: user.id,
                    summary: aiResponse.summary,
                    core_personality: aiResponse.core_personality,
                    strengths: aiResponse.strengths,
                    challenges: aiResponse.challenges,
                    evolutionary_advice: aiResponse.evolutionary_advice,
                    chart_snapshot: chartData,
                    language: locale
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error("Error BD saving astrology interpretation:", dbError);
            return NextResponse.json({ error: 'Error guardando interpretación en BD', details: dbError }, { status: 500 });
        } else {
            // 5. DESCONTAR CRÉDITOS
            await supabase.rpc('spend_credits', {
                p_user_id: user.id,
                p_amount: cost,
                p_description: `Interpretación Astral Completa`,
                p_reference_id: savedInterpretation.id
            });
        }

        const { data: newBalance } = await supabase.rpc('get_user_balance', { user_uuid: user.id });

        return NextResponse.json({
            ...aiResponse,
            id: savedInterpretation?.id,
            creditsUsed: cost,
            newBalance: newBalance || 0
        });

    } catch (error: any) {
        console.error('Error en /api/astrology/interpret:', error);
        return NextResponse.json({ error: 'Error del sistema: ' + (error?.message || 'Unknown') }, { status: 500 });
    }
}

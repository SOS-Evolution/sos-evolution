import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { createClient } from '@/lib/supabase/server';
import { getPrompt } from '@/lib/prompts';

const schemaJSON = JSON.stringify({
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

        // Verificación de saldo (con fallback si RPC falla)
        const { data: balanceData, error: balanceError } = await supabase.rpc('get_user_balance_v2', { p_user_id: user.id });

        if (balanceError) {
            console.error("Critical: get_user_balance_v2 failed:", balanceError);
            return NextResponse.json({ error: 'Error verificando saldo. Por favor contacta soporte.' }, { status: 500 });
        }

        const balance = balanceData || 0;
        console.log(`Astrology balance check for ${user.id}: ${balance}, Cost: ${cost}`);

        if (balance < cost) {
            return NextResponse.json({
                error: 'Aura insuficiente para esta interpretación.',
                currentBalance: balance,
                requiredAmount: cost
            }, { status: 402 });
        }

        // 3. IA GENERATIVA (GROQ)
        const isEn = locale.startsWith('en');
        const sysKey = isEn ? 'astro_natal_system_en' : 'astro_natal_system_es';
        const userKey = isEn ? 'astro_natal_user_en' : 'astro_natal_user_es';

        const systemPrompt = await getPrompt(sysKey);

        const planetsData = JSON.stringify(chartData.planets.map((p: any) => ({ name: p.name, sign: p.sign, house: p.house })), null, 2);
        const housesData = JSON.stringify(chartData.houses.map((h: any) => ({ house: h.house, sign: h.sign })), null, 2);
        const aspectsData = JSON.stringify(chartData.aspects?.slice(0, 10).map((a: any) => ({ p1: a.planet1, p2: a.planet2, type: a.type })), null, 2);

        const userPrompt = await getPrompt(userKey, {
            planetsData,
            housesData,
            aspectsData
        });

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        console.log("Groq API call completed.");

        const resultText = completion.choices[0]?.message?.content || "{}";
        console.log("Raw Groq response:", resultText);

        let aiResponse;
        try {
            aiResponse = JSON.parse(resultText);
            console.log("Parsed AI response:", JSON.stringify(aiResponse, null, 2));
        } catch (parseError) {
            console.error("Error parsing Groq response:", parseError);
            console.error("Raw response:", resultText);
            return NextResponse.json({ error: 'Error procesando respuesta de IA' }, { status: 500 });
        }

        // Validar y proporcionar valores por defecto si es necesario
        const validatedResponse = {
            summary: aiResponse.summary || "Tu carta natal revela un camino único de evolución espiritual.",
            core_personality: aiResponse.core_personality || "Tu esencia combina múltiples energías planetarias que definen tu camino.",
            strengths: Array.isArray(aiResponse.strengths) && aiResponse.strengths.length > 0
                ? aiResponse.strengths
                : ["Capacidad de transformación", "Intuición desarrollada", "Voluntad evolutiva"],
            challenges: Array.isArray(aiResponse.challenges) && aiResponse.challenges.length > 0
                ? aiResponse.challenges
                : ["Integración de dualidades", "Superar patrones heredados", "Aceptación del destino"],
            evolutionary_advice: aiResponse.evolutionary_advice || "Confía en el proceso de tu evolución, cada desafío es una oportunidad de crecimiento."
        };

        console.log("Validated response:", JSON.stringify(validatedResponse, null, 2));

        // 4. GUARDAR EN DB
        console.log("Saving astrology interpretation to DB...");

        const insertData = {
            user_id: user.id,
            summary: validatedResponse.summary,
            core_personality: validatedResponse.core_personality,
            strengths: validatedResponse.strengths,
            challenges: validatedResponse.challenges,
            evolutionary_advice: validatedResponse.evolutionary_advice,
            chart_snapshot: chartData,
            language: locale
        };

        console.log("Insert payload:", JSON.stringify(insertData, null, 2));

        const { data: savedInterpretation, error: dbError } = await supabase
            .from('astrology_interpretations')
            .insert([insertData])
            .select()
            .single();

        if (dbError) {
            console.error("Error saving astrology interpretation:", dbError);
            console.error("Error details:", JSON.stringify(dbError, null, 2));
            return NextResponse.json({
                error: 'Error guardando interpretación en BD',
                details: dbError.message || dbError
            }, { status: 500 });
        }

        console.log("Interpretation saved successfully, ID:", savedInterpretation.id);

        // 5. DESCONTAR CRÉDITOS
        if (cost > 0) {
            console.log(`Spending ${cost} credits for user ${user.id}...`);
            const { error: spendError } = await supabase.rpc('spend_credits_v2', {
                p_user_id: user.id,
                p_amount: cost,
                p_description: 'Interpretación Astral Completa',
                p_reference_id: savedInterpretation.id
            });

            if (spendError) {
                console.error("CRITICAL: Error spending credits v2:", spendError);
            } else {
                console.log(`Successfully spent ${cost} credits for user ${user.id}`);
            }
        }

        const { data: newBalance } = await supabase.rpc('get_user_balance_v2', { p_user_id: user.id });

        return NextResponse.json({
            ...validatedResponse,
            id: savedInterpretation?.id,
            creditsUsed: cost,
            newBalance: newBalance || 0
        });

    } catch (error: any) {
        console.error('Error en /api/astrology/interpret:', error);
        return NextResponse.json({ error: 'Error del sistema: ' + (error?.message || 'Unknown') }, { status: 500 });
    }
}

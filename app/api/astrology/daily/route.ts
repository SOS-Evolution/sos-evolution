import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchDailyTransits } from '@/lib/astrology-api';
import { getZodiacSign } from '@/lib/soul-math';
import { getPrompt } from '@/lib/prompts';
import { Groq } from 'groq-sdk';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const locale = searchParams.get('locale') || 'es';

        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        const { data: existingHoroscope } = await supabase
            .from('daily_horoscopes')
            .select('content')
            .eq('user_id', user.id)
            .eq('date', dateStr)
            .eq('language', locale)
            .single();

        if (existingHoroscope) {
            return NextResponse.json(existingHoroscope.content);
        }

        // Return null with 200 OK so client doesn't log 404 error
        return NextResponse.json(null, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { locale = 'es' } = body;

        // 1. VERIFICAR SI YA TIENE HORÓSCOPO HOY (EN ESTE IDIOMA)
        // Usamos la fecha del servidor para consistencia
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // "YYYY-MM-DD"

        const { data: existingHoroscope } = await supabase
            .from('daily_horoscopes')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', dateStr)
            .eq('language', locale)
            .single();

        if (existingHoroscope) {
            return NextResponse.json({
                alreadyExists: true,
                ...existingHoroscope.content
            });
        }

        // 2. VERIFICAR CRÉDITOS Y TIPO
        const { data: readingType } = await supabase
            .from('reading_types')
            .select('*')
            .eq('code', 'daily_scope')
            .single();

        const cost = readingType?.credit_cost || 10;

        // Check balance
        const { data: balanceData, error: balanceError } = await supabase.rpc('get_user_balance_v2', { p_user_id: user.id });
        if (balanceError || (balanceData || 0) < cost) {
            return NextResponse.json({ error: 'Aura insuficiente', required: cost, balance: balanceData || 0 }, { status: 402 });
        }

        // 3. OBTENER TRÁNSITOS (CACHÉ PRIMERO)
        let transitsData;
        const { data: cachedTransits } = await supabase
            .from('daily_transits')
            .select('planets_data')
            .eq('date', dateStr)
            .single();

        if (cachedTransits) {
            console.log("Using cached transits for", dateStr);
            transitsData = cachedTransits.planets_data;
        } else {
            console.log("Fetching fresh transits for", dateStr);
            transitsData = await fetchDailyTransits(today);

            if (transitsData) {
                // Save to cache (don't fail if duplicate insert due to race condition)
                const { error: insertError } = await supabase.from('daily_transits').insert([{
                    date: dateStr,
                    planets_data: transitsData
                }]);

                if (insertError) console.warn("Cache insert race condition ignored:", insertError);
            } else {
                return NextResponse.json({ error: 'Error obteniendo datos astrológicos' }, { status: 500 });
            }
        }

        // 4. OBTENER CARTA NATAL DEL USUARIO
        // Estrategia "Perfil Primero": Usar datos calculados del perfil si existen.
        const { data: profile } = await supabase
            .from('profiles')
            .select('astrology_chart, birth_date')
            .eq('id', user.id)
            .single();

        let userPlanets;

        // Intentar usar chart del perfil
        if (profile?.astrology_chart && (profile.astrology_chart as any).planets) {
            userPlanets = (profile.astrology_chart as any).planets;
            console.log("Using cached profile chart for daily horoscope");
        }

        // Fallback: Buscar última interpretación si no hay datos en perfil (Legacy)
        if (!userPlanets) {
            const { data: lastInterpretation } = await supabase
                .from('astrology_interpretations')
                .select('chart_snapshot')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle(); // Use maybeSingle to avoid 406 error if no rows

            if (lastInterpretation?.chart_snapshot?.planets) {
                userPlanets = lastInterpretation.chart_snapshot.planets;
                console.log("Using legacy interpretation chart for daily horoscope");
            }
        }

        if (!userPlanets) {
            // Si no hay datos en ninguna parte, bloquear.
            return NextResponse.json({
                error: 'Primero debes inicializar tu Carta Astral en la sección de Astrología (es gratis calcularla, solo entra).'
            }, { status: 400 });
        }


        // 5. GENERAR CON GROQ
        if (!process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: 'Server config error' }, { status: 500 });
        }
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const isEn = locale === 'en';

        // CALCULAR SIGNO SOLAR REAL (Source of Truth: Profile or calculated)
        let calculatedSunSign = "Aries";

        if (profile?.birth_date) {
            const [y, m, d] = profile.birth_date.split('-').map(Number);
            calculatedSunSign = getZodiacSign(d, m);
        } else {
            // Fallback if no profile date (should be caught above, but safety first)
            const sunPlanet = userPlanets.find((p: any) => p.name === "Sun");
            if (sunPlanet) calculatedSunSign = sunPlanet.sign;
        }

        // Simplificar datos para el prompt
        // Si tenemos carta completa, la usamos. Si no, usamos el Signo Solar calculado.
        const simpleNatal = userPlanets
            ? userPlanets.map((p: any) => `${p.name} in ${p.sign}`).join(', ')
            : `Sun in ${calculatedSunSign}`;

        // Transits object formatting
        const simpleTransits = Object.values(transitsData || {})
            .filter((p: any) => p.name && p.current_sign)
            .map((p: any) => `${p.name} (Transit) in ${["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][p.current_sign]}`)
            .join(', ');

        // DYNAMIC PROMPTS
        const suffix = isEn ? 'en' : 'es';
        const systemPrompt = await getPrompt(`astro_daily_system_${suffix}`);

        const userPrompt = await getPrompt(`astro_daily_user_${suffix}`, {
            dateStr,
            calculatedSunSign,
            simpleNatal,
            simpleTransits
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

        const resultText = completion.choices[0]?.message?.content || "{}";
        const content = JSON.parse(resultText);

        // 6. GUARDAR Y COBRAR
        const { data: savedHoroscope, error: saveError } = await supabase
            .from('daily_horoscopes')
            .insert([{
                user_id: user.id,
                date: dateStr,
                content: content,
                transits_snapshot: transitsData,
                language: locale
            }])
            .select()
            .single();

        if (saveError) {
            console.error("Error saving horoscope:", saveError);
            return NextResponse.json({ error: 'Error guardando horóscopo', details: saveError.message }, { status: 500 });
        }

        // Cobrar
        if (cost > 0) {
            const { error: spendError } = await supabase.rpc('spend_credits_v2', {
                p_user_id: user.id,
                p_amount: cost,
                p_description: `Horóscopo Diario ${dateStr} (Ref: ${savedHoroscope.id.toString().substring(0, 8)}...)`,
                p_reference_id: null
            });

            if (spendError) console.error("Error spending credits:", spendError);
        }

        const { data: newBalance } = await supabase.rpc('get_user_balance_v2', { p_user_id: user.id });

        return NextResponse.json({
            ...content,
            creditsUsed: cost,
            newBalance,
            firstTimeToday: true
        });

    } catch (error: any) {
        console.error("Daily Horoscope Error:", error);
        return NextResponse.json({ error: error.message || 'Error del servidor' }, { status: 500 });
    }
}

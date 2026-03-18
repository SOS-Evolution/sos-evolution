import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchDailyTransits } from '@/lib/astrology-api';
import { getZodiacSign } from '@/lib/soul-math';
import { requireAuth } from '@/src/services/auth.service';
import { BillingService } from '@/src/services/billing.service';
import { OracleService } from '@/src/services/oracle.service';
import { handleRouteError } from '@/src/utils/route-handler';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);

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
    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);
        const billing = new BillingService(supabase);
        const oracle = new OracleService(supabase);

        const body = await req.json().catch(() => ({}));
        const { locale = 'es' } = body;

        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];

        // 1. Check if already generated today
        const { data: existingHoroscope } = await supabase
            .from('daily_horoscopes')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', dateStr)
            .eq('language', locale)
            .single();

        if (existingHoroscope) {
            return NextResponse.json({ alreadyExists: true, ...existingHoroscope.content });
        }

        // 2. Check balance
        const { data: readingType } = await supabase
            .from('reading_types')
            .select('credit_cost')
            .eq('code', 'daily_scope')
            .single();
        const cost = readingType?.credit_cost || 10;
        await billing.ensureSufficientBalance(user.id, cost);

        // 3. Get transits (cache first)
        let transitsData;
        const { data: cachedTransits } = await supabase
            .from('daily_transits')
            .select('planets_data')
            .eq('date', dateStr)
            .single();

        if (cachedTransits) {
            transitsData = cachedTransits.planets_data;
        } else {
            transitsData = await fetchDailyTransits(today);
            if (transitsData) {
                await supabase.from('daily_transits').insert([{
                    date: dateStr,
                    planets_data: transitsData,
                }]);
            } else {
                return NextResponse.json({ error: 'Error obteniendo datos astrológicos' }, { status: 500 });
            }
        }

        // 4. Get natal chart data from profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('astrology_chart, birth_date')
            .eq('id', user.id)
            .single();

        let userPlanets;
        if (profile?.astrology_chart && (profile.astrology_chart as Record<string, unknown>).planets) {
            userPlanets = (profile.astrology_chart as Record<string, unknown>).planets;
        }

        if (!userPlanets) {
            const { data: lastInterpretation } = await supabase
                .from('astrology_interpretations')
                .select('chart_snapshot')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (lastInterpretation?.chart_snapshot?.planets) {
                userPlanets = lastInterpretation.chart_snapshot.planets;
            }
        }

        if (!userPlanets) {
            return NextResponse.json({
                error: 'Primero debes inicializar tu Carta Astral en la sección de Astrología (es gratis calcularla, solo entra).'
            }, { status: 400 });
        }

        // 5. Calculate sun sign
        let calculatedSunSign = "Aries";
        if (profile?.birth_date) {
            const [, m, d] = profile.birth_date.split('-').map(Number);
            calculatedSunSign = getZodiacSign(d, m);
        } else {
            const sunPlanet = (userPlanets as Array<Record<string, unknown>>).find(p => p.name === "Sun");
            if (sunPlanet) calculatedSunSign = sunPlanet.sign as string;
        }

        // 6. Generate horoscope (AI + DB save)
        const result = await oracle.generateDailyHoroscope(
            user.id,
            userPlanets as Array<Record<string, unknown>>,
            transitsData as Record<string, unknown>,
            calculatedSunSign,
            locale
        );

        // 7. Spend credits
        const newBalance = await billing.spendCredits(
            user.id,
            result.cost,
            `Horóscopo Diario ${dateStr} (Ref: ${result.savedId.toString().substring(0, 8)}...)`,
            null
        );

        return NextResponse.json({
            ...result.content,
            creditsUsed: result.cost,
            newBalance,
            firstTimeToday: true,
        });

    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

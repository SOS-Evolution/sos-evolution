import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { BillingService } from '@/src/services/billing.service';
import { OracleService } from '@/src/services/oracle.service';
import { handleRouteError } from '@/src/utils/route-handler';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { chartData, locale = 'es' } = body;

        if (!chartData) {
            return NextResponse.json({ error: 'Faltan datos de la carta natal' }, { status: 400 });
        }

        // 1. Auth + Services
        const supabase = await createClient();
        const user = await requireAuth(supabase);
        const billing = new BillingService(supabase);
        const oracle = new OracleService(supabase);

        // 2. Check balance
        const { data: readingType } = await supabase
            .from('reading_types')
            .select('credit_cost')
            .eq('code', 'astrology_full')
            .single();
        const cost = readingType?.credit_cost || 20;
        await billing.ensureSufficientBalance(user.id, cost);

        // 3. Generate interpretation (AI + DB save)
        const result = await oracle.generateAstrologyInterpretation(user.id, chartData, locale);

        // 4. Spend credits
        const newBalance = await billing.spendCredits(
            user.id,
            result.cost,
            'Interpretación Astral Completa',
            result.savedId
        );

        // 5. Return (same shape as before for frontend compat)
        return NextResponse.json({
            ...result.interpretation,
            id: result.savedId,
            creditsUsed: result.cost,
            newBalance,
        });

    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

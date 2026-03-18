import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { BillingService } from '@/src/services/billing.service';
import { handleRouteError } from '@/src/utils/route-handler';
import type { UserBalance } from '@/types';

// GET /api/credits - Obtener balance y transacciones
export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);
        const billing = new BillingService(supabase);

        const balance = await billing.getBalance(user.id);

        // Obtener parámetros de query
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit') || '10');

        // Obtener transacciones recientes
        const { data: transactions, error: txError } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (txError) {
            console.error('Error getting transactions:', txError);
            return NextResponse.json({ error: 'Error al obtener transacciones' }, { status: 500 });
        }

        const response: UserBalance = {
            balance,
            transactions: transactions || []
        };

        return NextResponse.json(response);
    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

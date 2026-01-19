import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { UserBalance } from '@/types';

// GET /api/credits - Obtener balance y transacciones
export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        // Obtener balance
        const { data: balanceData, error: balanceError } = await supabase
            .rpc('get_user_balance', { user_uuid: user.id });

        if (balanceError) {
            console.error('Error getting balance:', balanceError);
            return NextResponse.json({ error: 'Error al obtener balance' }, { status: 500 });
        }

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
            balance: balanceData || 0,
            transactions: transactions || []
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Credits GET error:', error);
        return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

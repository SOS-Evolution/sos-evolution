import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        // Llamar a la función RPC que creamos en la migración
        // Nota: Asegúrate de haber ejecutado la migración 34_missions_updates.sql
        const { data, error } = await supabase.rpc('check_daily_streak', {
            p_user_id: user.id
        });

        if (error) {
            console.error('Error checking daily streak:', error);
            // Fallback silencioso para no romper la UI, pero logueando error
            return NextResponse.json({ success: false, error: error.message });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Daily streak API error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

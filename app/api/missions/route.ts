import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { handleRouteError } from '@/src/utils/route-handler';
import type { CompleteMissionResult } from '@/types';

// GET /api/missions - Obtener misiones del usuario
export async function GET() {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);

        const { data: userMissions, error } = await supabase
            .from('user_missions')
            .select(`
                *,
                mission:missions(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error getting missions:', error);
            return NextResponse.json({ error: 'Error al obtener misiones' }, { status: 500 });
        }

        return NextResponse.json(userMissions || []);
    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

// POST /api/missions - Completar una misión manualmente
export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);

        const { missionCode } = await req.json();

        if (!missionCode) {
            return NextResponse.json({ error: 'Código de misión requerido' }, { status: 400 });
        }

        const { data, error } = await supabase.rpc('complete_mission', {
            p_user_id: user.id,
            p_mission_code: missionCode
        });

        if (error) {
            console.error('Error completing mission:', error);
            return NextResponse.json({ error: 'Error al completar misión' }, { status: 500 });
        }

        const result = data as CompleteMissionResult;

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

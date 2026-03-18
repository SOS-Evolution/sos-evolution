import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { handleRouteError } from '@/src/utils/route-handler';

export async function POST() {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);

        const { data, error } = await supabase.rpc('check_daily_streak', {
            p_user_id: user.id
        });

        if (error) {
            console.error('Error checking daily streak:', error);
            return NextResponse.json({ success: false, error: error.message });
        }

        return NextResponse.json(data);
    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase/admin-auth';

export async function GET() {
    try {
        const { supabase, error: authResponse } = await getAdminUser();
        if (authResponse) return authResponse;

        const { data: prompts, error } = await supabase
            .from('system_prompts')
            .select('*')
            .order('group', { ascending: true })
            .order('code', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(prompts);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

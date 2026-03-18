import { NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/supabase/admin-auth';

export async function GET(req: Request) {
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
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

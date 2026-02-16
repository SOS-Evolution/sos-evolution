import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const supabase = await createClient();

        // Auth check: Ensure user is admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Optional: Check if user is actually an admin using RPC or checking a role
        // For now, assuming middleware or simple auth is enough for the MVP of this admin route
        // but robustly we should check public.is_admin(user.id)

        const { data: is_admin } = await supabase.rpc('is_admin', { user_id: user.id });
        if (!is_admin) {
            return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
        }

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

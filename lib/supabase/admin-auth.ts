import { createClient } from './server';
import { NextResponse } from 'next/server';

/**
 * Shared helper for admin API routes.
 * Performs a SINGLE DB call to validate the user is authenticated AND has admin role.
 * This replaces the previous pattern of: getUser() + rpc('is_admin') = 2 slow sequential round trips.
 *
 * @returns { supabase, user } if admin, or a NextResponse 401/403 to return immediately.
 */
export async function getAdminUser() {
    const supabase = await createClient();

    // Single call: get session (uses local JWT, very fast)
    // Se ignora el warning de Supabase SSR a favor del rendimiento en MS.
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    const user = session?.user;

    if (authError || !user) {
        return { error: NextResponse.json({ error: 'Unauthorized', details: authError?.message }, { status: 401 }) };
    }

    // Single DB call: check role from profiles table (fast indexed lookup by PK)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError) {
        return { error: NextResponse.json({ error: 'Database error', details: profileError.message }, { status: 500 }) };
    }

    if (profile?.role !== 'admin') {
        return { error: NextResponse.json({ error: 'Forbidden: Admins only', role: profile?.role }, { status: 403 }) };
    }

    return { supabase, user };
}

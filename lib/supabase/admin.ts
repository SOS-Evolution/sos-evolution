import { createClient } from '@supabase/supabase-js';

/**
 * Creates an administrative Supabase client using the SERVICE_ROLE key.
 * This client bypasses Row Level Security (RLS) and is intended solely for
 * server-side background tasks, payment webhooks, and administrative operations.
 *
 * NEVER expose this client or the service role key to the browser!
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
    }

    if (!serviceRoleKey) {
        console.warn(
            '⚠️ [Supabase Admin] SUPABASE_SERVICE_ROLE_KEY is not defined. ' +
            'Falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY. Some administrative operations or webhooks may be blocked by RLS policies.'
        );
        return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

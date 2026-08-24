import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticationError } from '@/src/domain/errors';

/**
 * Verifies that a request is authenticated and returns the user.
 * @throws AuthenticationError if the request is not authenticated.
 */
export async function requireAuth(supabase: SupabaseClient) {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new AuthenticationError();
    }

    return user;
}

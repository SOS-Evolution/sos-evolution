import { SupabaseClient } from '@supabase/supabase-js';
import { AuthenticationError } from '@/src/domain/errors';

/**
 * Verifies that a request is authenticated and returns the user.
 * @throws AuthenticationError if the request is not authenticated.
 */
export async function requireAuth(supabase: SupabaseClient) {
    // PERFORMANCE: getSession() lee JWT local (0 latencia de red).
    // NOTA: Ignoramos el warning de SSR de Supabase para evitar 
    // latencias extremas y congelamientos de la UI de hasta 15 segundos.
    const { data: { session }, error } = await supabase.auth.getSession();
    const user = session?.user;

    if (error || !user) {
        throw new AuthenticationError();
    }

    return user;
}

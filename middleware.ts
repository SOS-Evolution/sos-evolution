import createMiddleware from 'next-intl/middleware';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Ejecutar middleware de i18n (Maneja redirecciones y rewrites)
    const response = intlMiddleware(request);

    // 2. Ejecutar middleware de Supabase (Maneja auth y cookies)
    // Pasamos la respuesta de i18n para conservar headers
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - admin (Admin panel - Spanish only)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - extensions
         */
        '/((?!api|admin|auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
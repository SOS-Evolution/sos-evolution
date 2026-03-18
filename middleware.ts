import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Determinar si esta ruta debe usar i18n
    // Excluimos api, admin y auth del sistema de idiomas, pero NO de supabase
    const isExcludedFromI18n =
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/auth');

    let response = NextResponse.next({ request });

    if (!isExcludedFromI18n) {
        // Ejecutar middleware de i18n (Maneja redirecciones y rewrites)
        response = intlMiddleware(request);
    }

    // 2. Ejecutar middleware de Supabase (Maneja auth y refresca cookies)
    // Es CRITICO que esto corra para /admin y /api para que se refresque el JWT,
    // de lo contrario los Server Components intentarán refrescarlo en cada request y
    // fallarán por no poder escribir cookies, causando extrema lentitud.
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        /*
         * Correr en todas las rutas excepto archivos estáticos.
         * Ya no excluimos api|admin|auth aquí para que Supabase pueda refrescar la sesión.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
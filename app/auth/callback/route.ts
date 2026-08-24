import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getSafeRedirectUrl(next: string | null, fallback = '/dashboard'): string {
    if (!next) return fallback;
    // Asegurar que comience con '/' y no con '//' o '/\' para evitar esquemas externos o URLs relativas de protocolo
    if (next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
        return next;
    }
    return fallback;
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const safeNext = getSafeRedirectUrl(searchParams.get('next'))

    // Si hay un código en la URL (viene del correo)
    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Si todo sale bien, lo mandamos al destino solicitado de forma segura
            return NextResponse.redirect(`${origin}${safeNext}`)
        }
    }

    // Si algo falla, lo devolvemos al login con error
    return NextResponse.redirect(`${origin}/login?error=Enlace invalido o expirado`)
}
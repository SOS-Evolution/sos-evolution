import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function getSafeRedirectUrl(next: string | null, fallback = '/dashboard'): string {
    if (!next) return fallback;
    // Asegurar que comience con '/' y no con '//' o '/\' para evitar esquemas externos o URLs relativas de protocolo
    if (next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')) {
        return next;
    }
    return fallback;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const safeNext = getSafeRedirectUrl(searchParams.get('next'))

    if (token_hash && type) {
        const supabase = await createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (!error) {
            return NextResponse.redirect(new URL(safeNext, request.url))
        }
    }

    // Si hay error, redirigimos al login con un mensaje claro
    return NextResponse.redirect(new URL('/login?error=Enlace invalido o expirado. Intenta registrarte de nuevo.', request.url))
}


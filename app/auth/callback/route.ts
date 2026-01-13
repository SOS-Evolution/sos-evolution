import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // Si hay un código en la URL (viene del correo)
    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Si todo sale bien, lo mandamos al Dashboard ya logueado
            return NextResponse.redirect(`${origin}/dashboard`)
        }
    }

    // Si algo falla, lo devolvemos al login con error
    return NextResponse.redirect(`${origin}/login?error=Enlace invalido o expirado`)
}
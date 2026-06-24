import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { lemonSqueezy } from '@/src/services/lemonsqueezy.service';
import { handleRouteError } from '@/src/utils/route-handler';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const user = await requireAuth(supabase);
        const { variantId, credits, amount } = await req.json();

        if (!variantId || !credits || !amount) {
            return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
        }

        // 1. Obtener email del usuario
        const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', user.id)
            .single();

        // 2. Crear checkout en Lemon Squeezy
        const email = profile?.email || user.email || '';
        if (!email) {
            return NextResponse.json({ error: 'El usuario no tiene un correo electrónico válido asociado.' }, { status: 400 });
        }

        const checkoutUrl = await lemonSqueezy.createCheckout(
            user.id,
            email,
            variantId,
            credits
        );

        if (!checkoutUrl) {
            throw new Error('No se pudo generar la URL de checkout');
        }

        // 3. Registrar pago pendiente en la base de datos
        const { error: dbError } = await supabase
            .from('payments')
            .insert({
                user_id: user.id,
                variant_id: variantId,
                amount: amount,
                credits_awarded: credits,
                status: 'pending'
            });

        if (dbError) {
            console.error('Error saving pending payment:', dbError);
            // Continuamos de todos modos ya que tenemos la URL del checkout
        }

        return NextResponse.json({ url: checkoutUrl });
    } catch (error: unknown) {
        return handleRouteError(error);
    }
}

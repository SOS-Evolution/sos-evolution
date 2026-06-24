import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { lemonSqueezy } from '@/src/services/lemonsqueezy.service';
import { BillingService } from '@/src/services/billing.service';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';

        // 1. Validar firma
        if (!lemonSqueezy.validateWebhookSignature(rawBody, signature)) {
            return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const data = payload.data;

        const supabase = await createClient(); // Nota: Aquí podrías necesitar service_role si RLS es muy estricto
        const billing = new BillingService(supabase);

        console.log(`Webhook recibido: ${eventName}`);

        if (eventName === 'order_created' || eventName === 'order_paid') {
            const attributes = data.attributes;
            const customData = payload.meta.custom_data;
            const userId = customData.user_id;
            const credits = parseInt(customData.credits);
            const orderId = data.id;
            const status = attributes.status; // 'paid', 'pending', etc.

            const variantId = (attributes.first_order_item?.variant_id ?? attributes.variant_id)?.toString() || '';

            // 2. Actualizar o insertar registro de pago
            const { error: upsertError } = await supabase
                .from('payments')
                .upsert({
                    order_id: orderId,
                    user_id: userId,
                    variant_id: variantId,
                    amount: attributes.total,
                    currency: attributes.currency,
                    status: status === 'paid' ? 'paid' : 'pending',
                    credits_awarded: credits,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'order_id' });

            if (upsertError) {
                console.error('Error upserting payment:', upsertError);
            }

            // 3. Si el pago fue exitoso, otorgar créditos
            if ((eventName === 'order_created' || eventName === 'order_paid') && status === 'paid') {
                // Usamos la función RPC add_credits definida en la migración 02
                const { error: creditError } = await supabase.rpc('add_credits', {
                    p_user_id: userId,
                    p_amount: credits,
                    p_source: 'purchase',
                    p_description: `Compra de ${credits} Aura (Orden #${orderId})`,
                    p_reference_id: null // Podrías pasar el ID de la tabla payments aquí si lo recuperas
                });

                if (creditError) {
                    console.error('Error awarding credits via webhook:', creditError);
                    return NextResponse.json({ error: 'Error al otorgar créditos' }, { status: 500 });
                }

                console.log(`Créditos otorgados satisfactoriamente: ${credits} a usuario ${userId}`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

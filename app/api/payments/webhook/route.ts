import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { lemonSqueezy } from '@/src/services/lemonsqueezy.service';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';

        // 1. Validar firma criptográfica HMAC SHA-256
        if (!lemonSqueezy.validateWebhookSignature(rawBody, signature)) {
            console.error('Webhook Error: Firma inválida');
            return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta?.event_name;
        const data = payload.data;

        if (!eventName || !data) {
            return NextResponse.json({ error: 'Payload incompleto' }, { status: 400 });
        }

        const supabase = createAdminClient();

        console.log(`[LemonSqueezy Webhook] Evento recibido: ${eventName} (ID: ${data.id})`);

        if (eventName === 'order_created' || eventName === 'order_paid') {
            const attributes = data.attributes;
            const customData = payload.meta?.custom_data || {};
            const userId = customData.user_id;
            const credits = parseInt(customData.credits, 10);
            const orderId = String(data.id);
            const status = attributes.status; // 'paid', 'pending', 'refunded', etc.
            const variantId = (attributes.first_order_item?.variant_id ?? attributes.variant_id)?.toString() || '';

            if (!userId || isNaN(credits) || credits <= 0) {
                console.warn(`[LemonSqueezy Webhook] Datos custom_data incompletos para orden #${orderId}`, customData);
                return NextResponse.json({ error: 'Faltan datos de usuario o créditos en custom_data' }, { status: 400 });
            }

            // 2. IDEMPOTENCIA: Verificar si la orden ya fue procesada y pagada previamente
            const { data: existingPayment, error: queryError } = await supabase
                .from('payments')
                .select('id, status, credits_awarded')
                .eq('order_id', orderId)
                .maybeSingle();

            if (queryError) {
                console.error('[LemonSqueezy Webhook] Error consultando estado previo de pago:', queryError);
            }

            // Si ya fue procesada como 'paid' con créditos otorgados, no duplicamos
            if (existingPayment?.status === 'paid' && existingPayment.credits_awarded > 0) {
                console.log(`[LemonSqueezy Webhook] Orden #${orderId} ya procesada y acreditada anteriormente. Omitiendo.`);
                return NextResponse.json({ received: true, alreadyProcessed: true });
            }

            // 3. Actualizar o insertar registro de pago
            const { data: savedPayment, error: upsertError } = await supabase
                .from('payments')
                .upsert({
                    order_id: orderId,
                    user_id: userId,
                    variant_id: variantId,
                    amount: attributes.total,
                    currency: attributes.currency || 'USD',
                    status: status === 'paid' ? 'paid' : 'pending',
                    credits_awarded: status === 'paid' ? credits : 0,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'order_id' })
                .select('id')
                .single();

            if (upsertError) {
                console.error('[LemonSqueezy Webhook] Error registrando pago:', upsertError);
            }

            // 4. Si el pago fue confirmado como 'paid', otorgar créditos de forma atómica
            if (status === 'paid') {
                const paymentRefId = savedPayment?.id || null;

                const { error: creditError } = await supabase.rpc('add_credits', {
                    p_user_id: userId,
                    p_amount: credits,
                    p_source: 'purchase',
                    p_description: `Compra de ${credits} Aura (Orden #${orderId})`,
                    p_reference_id: paymentRefId
                });

                if (creditError) {
                    console.error('[LemonSqueezy Webhook] Error otorgando créditos vía RPC:', creditError);
                    return NextResponse.json({ error: 'Error al otorgar créditos' }, { status: 500 });
                }

                console.log(`[LemonSqueezy Webhook] ${credits} Aura otorgados con éxito a usuario ${userId} (Orden #${orderId})`);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[LemonSqueezy Webhook] Error inesperado:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


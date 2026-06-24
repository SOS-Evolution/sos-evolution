import { lemonSqueezySetup, createCheckout, getOrder } from '@lemonsqueezy/lemonsqueezy.js';
import crypto from 'crypto';

export class LemonSqueezyService {
    private apiKey: string;
    private storeId: string;
    private webhookSecret: string;

    constructor() {
        this.apiKey = process.env.LEMONSQUEEZY_API_KEY || '';
        this.storeId = process.env.LEMONSQUEEZY_STORE_ID || '';
        this.webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        if (!this.apiKey || !this.storeId) {
            console.warn('LemonSqueezyService: Missing API Key or Store ID');
        }

        lemonSqueezySetup({
            apiKey: this.apiKey,
            onError: (error) => console.error('Lemon Squeezy Error:', error),
        });
    }

    /**
     * Crea un enlace de checkout para un usuario y variante específica.
     */
    async createCheckout(userId: string, userEmail: string, variantId: string, credits: number) {
        try {
            const checkout = await createCheckout(this.storeId, variantId, {
                checkoutData: {
                    email: userEmail,
                    custom: {
                        user_id: userId,
                        credits: credits.toString(),
                    },
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/credits/success`,
                },
            });

            if (checkout.error) {
                console.error('Lemon Squeezy API Error:', checkout.error);
                if (checkout.error.cause) {
                    console.error('Lemon Squeezy API Error Cause:', JSON.stringify(checkout.error.cause, null, 2));
                }
                throw new Error(checkout.error.message || 'Error al comunicarse con Lemon Squeezy');
            }

            return checkout.data?.data?.attributes?.url;
        } catch (error) {
            console.error('Error creating Lemon Squeezy checkout:', error);
            throw error;
        }
    }

    validateWebhookSignature(payload: string, signature: string): boolean {
        if (!this.webhookSecret || !signature) return false;

        const hmac = crypto.createHmac('sha256', this.webhookSecret);
        const digest = Buffer.from(hmac.update(payload).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(digest, signatureBuffer);
    }

    /**
     * Obtiene los detalles de una orden.
     */
    async getOrderDetails(orderId: string) {
        try {
            const order = await getOrder(orderId);
            return order.data?.data;
        } catch (error) {
            console.error('Error getting Lemon Squeezy order:', error);
            throw error;
        }
    }
}

export const lemonSqueezy = new LemonSqueezyService();

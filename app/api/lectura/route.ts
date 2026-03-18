import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { BillingService } from '@/src/services/billing.service';
import { OracleService } from '@/src/services/oracle.service';
import { handleRouteError } from '@/src/utils/route-handler';

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { question, cardIndex, cardIndices, readingTypeCode = 'general', position, positions, locale = 'es' } = body;

        // Soporte retrocompatible: Si envían `cardIndex` lo pasamos a array, si envían `cardIndices` usamos eso
        const cardsToProcess = Array.isArray(cardIndices) ? cardIndices : (typeof cardIndex === 'number' ? [cardIndex] : []);
        const positionsToProcess = Array.isArray(positions) ? positions : (position ? [position] : []);

        if (cardsToProcess.length === 0) {
            throw new Error("No cards provided for reading");
        }

        // 1. Auth + Services
        const supabase = await createClient();
        const user = await requireAuth(supabase);
        const billing = new BillingService(supabase);
        const oracle = new OracleService(supabase);

        // 2. Resolve cost & check balance. EL COSTE ES POR TODA LA LECTURA (ej: 100 para la de 3 cartas)
        const { cost, readingType } = await oracle.resolveReadingType(readingTypeCode);
        await billing.ensureSufficientBalance(user.id, cost);

        // 3. Generate readings (AI + DB save) in parallel or sequentially
        const readings = [];

        for (let i = 0; i < cardsToProcess.length; i++) {
            const currentCardIndex = cardsToProcess[i];
            const currentPosition = positionsToProcess[i] || position;

            const result = await oracle.generateTarotReading(user.id, {
                question,
                cardIndex: currentCardIndex,
                readingTypeCode,
                position: currentPosition,
                locale,
            });

            readings.push({
                ...result.reading,
                id: result.savedId,
            });
        }

        // 4. Spend credits ONCE for the entire session
        const newBalance = await billing.spendCredits(
            user.id,
            cost,
            `Lectura: ${readingType.name} (${cardsToProcess.length} cartas)`,
            null // Legacy int IDs — pass null for UUID reference
        );

        // 5. Return response with readings array
        return NextResponse.json({
            readings,
            creditsUsed: cost,
            newBalance,
        });

    } catch (error: unknown) {
        return handleRouteError(error);
    }
}
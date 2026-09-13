import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/src/services/auth.service';
import { BillingService } from '@/src/services/billing.service';
import { OracleService } from '@/src/services/oracle.service';
import { handleRouteError } from '@/src/utils/route-handler';

export const maxDuration = 60; // Vercel: permite hasta 60s (30s en Hobby)

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
        const billing = new BillingService(supabase);
        const oracle = new OracleService(supabase);

        // 2. Parallelize auth + reading type resolution — both are independent of each other
        const [user, { cost, readingType }] = await Promise.all([
            requireAuth(supabase),
            oracle.resolveReadingType(readingTypeCode),
        ]);

        // 3. Check balance AFTER we know the cost
        await billing.ensureSufficientBalance(user.id, cost);

        // 4. Generate readings (AI + DB save) in parallel for ultra-fast performance.
        // All cards from the same spread share the same spreadId.
        const spreadId = crypto.randomUUID();

        const generatedResults = await Promise.all(
            cardsToProcess.map((currentCardIndex: number, i: number) => {
                const currentPosition = positionsToProcess[i] || position;
                return oracle.generateTarotReading(user.id, {
                    question,
                    cardIndex: currentCardIndex,
                    readingTypeCode,
                    position: currentPosition,
                    locale,
                    spreadId,
                    cardOrder: i,
                    // Pass the already-resolved readingType to skip a redundant DB roundtrip per card
                    resolvedReadingType: readingType,
                });
            })
        );

        const readings = generatedResults.map(result => ({
            ...result.reading,
            id: result.savedId,
        }));

        // 5. Spend credits ONCE for the entire session
        const newBalance = await billing.spendCredits(
            user.id,
            cost,
            `Lectura: ${readingType.name} (${cardsToProcess.length} cartas)`,
            null // Legacy int IDs — pass null for UUID reference
        );

        // 6. Return response with readings array and spreadId
        return NextResponse.json({
            spreadId,
            readings,
            creditsUsed: cost,
            newBalance,
        });

    } catch (error: unknown) {
        return handleRouteError(error);
    }
}
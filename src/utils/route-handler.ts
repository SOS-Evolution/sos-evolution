import { NextResponse } from 'next/server';
import { AppError } from '@/src/domain/errors';

/**
 * Wraps an API route handler to catch domain errors and return proper HTTP responses.
 * Eliminates try/catch boilerplate from every route.
 */
export function handleRouteError(error: unknown): NextResponse {
    console.error('API Route Error:', error);

    if (error instanceof AppError) {
        const body: Record<string, unknown> = { error: error.message };
        if (error.details) {
            Object.assign(body, error.details);
        }
        return NextResponse.json(body, { status: error.statusCode });
    }

    // Unknown error
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : undefined;
    if (stack) console.error('Stack:', stack);

    // Detect Groq/AI rate limit
    if (message.includes('429') || message.includes('quota')) {
        return NextResponse.json(
            { error: 'Sobrecarga Cósmica: Se ha superado el límite de consultas. Intenta de nuevo en un momento.' },
            { status: 429 }
        );
    }

    return NextResponse.json(
        { error: 'Error del sistema: ' + message },
        { status: 500 }
    );
}

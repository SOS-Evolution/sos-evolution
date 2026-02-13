import { NextResponse } from 'next/server';

export async function GET() {
    // Endpoint temporal para diagnosticar variables de entorno
    const envVars = {
        GROQ_API_KEY_EXISTS: !!process.env.GROQ_API_KEY,
        GROQ_API_KEY_LENGTH: process.env.GROQ_API_KEY?.length || 0,
        GROQ_API_KEY_STARTS_WITH: process.env.GROQ_API_KEY?.substring(0, 10) || 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        ALL_ENV_KEYS: Object.keys(process.env).filter(key =>
            key.includes('GROQ') || key.includes('groq')
        )
    };

    return NextResponse.json(envVars);
}

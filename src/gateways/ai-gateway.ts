import { Groq } from 'groq-sdk';
import { ConfigurationError, AiProviderError } from '@/src/domain/errors';

// =============================================
// AI Gateway — Multi-provider with fallback
// =============================================

export interface AiCompletionParams {
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
    model?: string;
}

export interface AiGateway {
    generateJson(params: AiCompletionParams): Promise<string>;
}

/**
 * Creates a Groq-based AI gateway with retry logic.
 * If the primary model fails (429/5xx), it retries once with a fallback model.
 */
export function createAiGateway(): AiGateway {
    if (!process.env.GROQ_API_KEY) {
        throw new ConfigurationError('GROQ_API_KEY no configurada');
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    return {
        async generateJson(params: AiCompletionParams): Promise<string> {
            const {
                systemPrompt,
                userPrompt,
                temperature = 0.7,
                model = 'llama-3.3-70b-versatile',
            } = params;

            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt },
                    ],
                    model,
                    temperature,
                    response_format: { type: 'json_object' },
                });

                const content = completion.choices[0]?.message?.content;
                if (!content) {
                    throw new AiProviderError('Groq', 'Empty response from model');
                }
                return content;

            } catch (error: unknown) {
                // If it's already our error type, re-throw
                if (error instanceof AiProviderError || error instanceof ConfigurationError) {
                    throw error;
                }

                const message = error instanceof Error ? error.message : String(error);

                // Rate limit — retry with a smaller/different model
                if (message.includes('429') || message.includes('quota') || message.includes('rate')) {
                    console.warn('Groq rate limited, retrying with fallback model...');
                    try {
                        const retryCompletion = await groq.chat.completions.create({
                            messages: [
                                { role: 'system', content: systemPrompt },
                                { role: 'user', content: userPrompt },
                            ],
                            model: 'llama-3.1-8b-instant',
                            temperature: temperature + 0.1,
                            response_format: { type: 'json_object' },
                        });

                        const retryContent = retryCompletion.choices[0]?.message?.content;
                        if (!retryContent) {
                            throw new AiProviderError('Groq-Fallback', 'Empty response from fallback model');
                        }
                        return retryContent;
                    } catch (retryError: unknown) {
                        const retryMessage = retryError instanceof Error ? retryError.message : String(retryError);
                        throw new AiProviderError('Groq-Fallback', retryMessage);
                    }
                }

                throw new AiProviderError('Groq', message);
            }
        },
    };
}

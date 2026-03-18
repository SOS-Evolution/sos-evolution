/**
 * Domain errors for SOS Evolution.
 * These are thrown by services and caught by API route handlers
 * to generate appropriate HTTP responses.
 */

export class AppError extends Error {
    public readonly statusCode: number;
    public readonly details?: Record<string, unknown>;

    constructor(message: string, statusCode: number, details?: Record<string, unknown>) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Debes iniciar sesión para continuar.') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class InsufficientCreditsError extends AppError {
    constructor(required: number, balance: number) {
        super('Aura de Evolución insuficiente.', 402, { required, balance });
        this.name = 'InsufficientCreditsError';
    }
}

export class AiProviderError extends AppError {
    constructor(provider: string, originalError?: string) {
        super(`Error del proveedor de IA (${provider}): ${originalError || 'Unknown'}`, 502);
        this.name = 'AiProviderError';
    }
}

export class ConfigurationError extends AppError {
    constructor(detail: string) {
        super(`Error de configuración del servidor: ${detail}`, 500);
        this.name = 'ConfigurationError';
    }
}

export class DatabaseError extends AppError {
    constructor(operation: string, detail?: string) {
        super(`Error de base de datos en ${operation}${detail ? `: ${detail}` : ''}`, 500);
        this.name = 'DatabaseError';
    }
}

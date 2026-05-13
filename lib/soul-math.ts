// Map de valores de las letras (Numerología Pitagórica)
const letterValues: Record<string, number> = {
    a: 1, j: 1, s: 1,
    b: 2, k: 2, t: 2,
    c: 3, l: 3, u: 3,
    d: 4, m: 4, v: 4,
    e: 5, n: 5, w: 5, ñ: 5,
    f: 6, o: 6, x: 6,
    g: 7, p: 7, y: 7,
    h: 8, q: 8, z: 8,
    i: 9, r: 9
};

// Reduce un número a un solo dígito o número maestro (11, 22, 33)
export function reduceNumber(num: number): number {
    let result = num;
    while (result > 9 && result !== 11 && result !== 22 && result !== 33) {
        result = result
            .toString()
            .split("")
            .reduce((acc, curr) => acc + parseInt(curr), 0);
    }
    return result;
}

// Calcula el Signo Zodiacal (Retorna el nombre en inglés como llave para i18n)
export function getZodiacSign(day: number, month: number): string {
    const zodiacSigns = [
        { sign: "Capricorn", endDay: 19 },
        { sign: "Aquarius", endDay: 18 },
        { sign: "Pisces", endDay: 20 },
        { sign: "Aries", endDay: 19 },
        { sign: "Taurus", endDay: 20 },
        { sign: "Gemini", endDay: 20 },
        { sign: "Cancer", endDay: 22 },
        { sign: "Leo", endDay: 22 },
        { sign: "Virgo", endDay: 22 },
        { sign: "Libra", endDay: 22 },
        { sign: "Scorpio", endDay: 21 },
        { sign: "Sagittarius", endDay: 21 },
        { sign: "Capricorn", endDay: 31 },
    ];

    const index = month - 1;
    if (day <= zodiacSigns[index].endDay) {
        return zodiacSigns[index].sign;
    } else {
        return zodiacSigns[index + 1].sign;
    }
}

// Calcula el Número de Camino de Vida (Numerología)
export function getLifePathNumber(dateString: string): number {
    const date = new Date(dateString.includes("T") ? dateString : dateString + "T00:00:00");
    if (isNaN(date.getTime())) return 0;

    // Sumar día, mes y año por separado (método tradicional)
    const day = reduceNumber(date.getUTCDate());
    const month = reduceNumber(date.getUTCMonth() + 1);
    const year = reduceNumber(date.getUTCFullYear());

    return reduceNumber(day + month + year);
}

// Calcula el Número de Destino (Expression Number) - Nombre completo
export function getExpressionNumber(fullName: string): number {
    const cleanName = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    let sum = 0;
    for (const char of cleanName) {
        sum += letterValues[char] || 0;
    }
    return reduceNumber(sum);
}

// Calcula el Número del Deseo del Alma (Soul Urge) - Solo Vocales
export function getSoulUrgeNumber(fullName: string): number {
    const vowels = "aeiou";
    const cleanName = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    let sum = 0;
    for (const char of cleanName) {
        if (vowels.includes(char)) {
            sum += letterValues[char] || 0;
        }
    }
    return reduceNumber(sum);
}

// Calcula el Número de Personalidad - Solo Consonantes
export function getPersonalityNumber(fullName: string): number {
    const vowels = "aeiou";
    const cleanName = fullName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
    let sum = 0;
    for (const char of cleanName) {
        if (!vowels.includes(char)) {
            sum += letterValues[char] || 0;
        }
    }
    return reduceNumber(sum);
}

// Interfaz para los detalles del Camino de Vida (Ahora usada para tipado en UI)
export interface LifePathDetails {
    number: number;
    title: string;
    powerWord: string;
    essence: string;
    quote: string;
}

/**
 * Retorna el número numerológico. 
 * Las descripciones ahora se manejan vía i18n en los componentes.
 */
export function getNumerologyDetails(number: number): { number: number } {
    return { number };
}

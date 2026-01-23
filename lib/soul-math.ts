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

// Calcula el Signo Zodiacal
export function getZodiacSign(day: number, month: number): string {
    const zodiacSigns = [
        { sign: "Capricornio", endDay: 19 },
        { sign: "Acuario", endDay: 18 },
        { sign: "Piscis", endDay: 20 },
        { sign: "Aries", endDay: 19 },
        { sign: "Tauro", endDay: 20 },
        { sign: "Géminis", endDay: 20 },
        { sign: "Cáncer", endDay: 22 },
        { sign: "Leo", endDay: 22 },
        { sign: "Virgo", endDay: 22 },
        { sign: "Libra", endDay: 22 },
        { sign: "Escorpio", endDay: 21 },
        { sign: "Sagitario", endDay: 21 },
        { sign: "Capricornio", endDay: 31 },
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

// Interfaz para los detalles del Camino de Vida
export interface LifePathDetails {
    number: number;
    title: string;
    powerWord: string;
    essence: string;
    quote: string;
}

// Obtiene los detalles completos de cualquier número numerológico
export function getNumerologyDetails(number: number, type: 'camino' | 'destino' | 'alma' | 'personalidad'): LifePathDetails {
    const details: Record<number, Omit<LifePathDetails, "number">> = {
        1: {
            title: "Liderazgo e Iniciativa",
            powerWord: "INICIADOR",
            essence: "Independencia, ambición, originalidad y autosuficiencia.",
            quote: "Yo soy la causa de mi propio destino."
        },
        2: {
            title: "Armonía y Cooperación",
            powerWord: "COOPERACIÓN",
            essence: "Dualidad, diplomacia, sensibilidad y trabajo en equipo.",
            quote: "En la unión reside la verdadera fuerza."
        },
        3: {
            title: "Expresión y Creatividad",
            powerWord: "CREATIVIDAD",
            essence: "Comunicación, optimismo, alegría y autoexpresión artística.",
            quote: "La vida es un lienzo para mi expresión."
        },
        4: {
            title: "Estabilidad y Construcción",
            powerWord: "ESTRUCTURA",
            essence: "Orden, disciplina, trabajo duro y bases sólidas.",
            quote: "Construyo sobre cimientos de verdad."
        },
        5: {
            title: "Libertad y Cambio",
            powerWord: "AVENTURA",
            essence: "Versatilidad, adaptabilidad, curiosidad y búsqueda de libertad.",
            quote: "El cambio es la única constante."
        },
        6: {
            title: "Responsabilidad y Servicio",
            powerWord: "ARMONÍA",
            essence: "Amor, hogar, familia, equilibrio y cuidado de otros.",
            quote: "Sirvo al mundo a través del amor."
        },
        7: {
            title: "Sabiduría e Introspección",
            powerWord: "CONSCIENCIA",
            essence: "Análisis mental, espiritualidad, búsqueda de la verdad y soledad creadora.",
            quote: "Busco la verdad más allá de la superficie."
        },
        8: {
            title: "Poder y Manifestación",
            powerWord: "LOGRO",
            essence: "Autoridad, éxito material, justicia kármica y ambición pragmática.",
            quote: "Lo que siembro, cosecho con poder."
        },
        9: {
            title: "Idealismo y Humanidad",
            powerWord: "COMPASIÓN",
            essence: "Universalidad, cierre de ciclos, altruismo y sabiduría global.",
            quote: "Mi corazón late por la humanidad entera."
        },
        11: {
            title: "Mensajero Espiritual",
            powerWord: "ILUMINACIÓN",
            essence: "Intuición profunda, visión profética e inspiración colectiva.",
            quote: "Soy un canal de luz para el mundo."
        },
        22: {
            title: "Maestro Constructor",
            powerWord: "MANIFESTACIÓN",
            essence: "Capacidad de materializar grandes visiones para el bien común.",
            quote: "Mis sueños se convierten en realidades tangibles."
        },
        33: {
            title: "Maestro Guía",
            powerWord: "AMOR UNIVERSAL",
            essence: "Sanación a través del amor incondicional y guía espiritual elevada.",
            quote: "Elevo al mundo con la pureza de mi espíritu."
        }
    };

    return {
        number,
        ...(details[number] || {
            title: "Misterio",
            powerWord: "INCÓGNITA",
            essence: "Un sendero que requiere auto-descubrimiento profundo.",
            quote: "El universo aún está escribiendo este capítulo."
        })
    };
}

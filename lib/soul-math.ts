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

    // Ajuste de índice (Enero = 0)
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
    // Obtenemos día, mes y año como números
    // Ojo: getMonth() devuelve 0-11, sumamos 1.
    let sum = date.getUTCDate() + (date.getUTCMonth() + 1) + date.getUTCFullYear();

    // Reducir hasta que sea un solo dígito o número maestro (11, 22, 33)
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum
            .toString()
            .split("")
            .reduce((acc, curr) => acc + parseInt(curr), 0);
    }

    return sum;
}

// Interfaz para los detalles del Camino de Vida
export interface LifePathDetails {
    number: number;
    title: string;
    powerWord: string;
    essence: string;
    quote: string;
}

// Obtiene los detalles completos del Camino de Vida
export function getLifePathDetails(number: number): LifePathDetails {
    const details: Record<number, Omit<LifePathDetails, "number">> = {
        1: {
            title: "Liderazgo",
            powerWord: "INICIADOR",
            essence: "Independencia, acción, identidad, creación.",
            quote: "Vine a abrir caminos."
        },
        2: {
            title: "Cooperación",
            powerWord: "ARMONÍA",
            essence: "Sensibilidad, vínculo, diplomacia, empatía.",
            quote: "Vine a unir."
        },
        3: {
            title: "Expresión",
            powerWord: "CREATIVIDAD",
            essence: "Comunicación, arte, alegría, palabra.",
            quote: "Vine a expresar."
        },
        4: {
            title: "Construcción",
            powerWord: "ESTRUCTURA",
            essence: "Orden, disciplina, constancia, bases sólidas.",
            quote: "Vine a sostener."
        },
        5: {
            title: "Libertad",
            powerWord: "EXPANSIÓN",
            essence: "Cambio, aventura, movimiento, experiencia.",
            quote: "Vine a experimentar."
        },
        6: {
            title: "Responsabilidad",
            powerWord: "AMOR",
            essence: "Cuidado, servicio, familia, equilibrio emocional.",
            quote: "Vine a cuidar."
        },
        7: {
            title: "Sabiduría",
            powerWord: "CONSCIENCIA",
            essence: "Introspección, espiritualidad, verdad interior.",
            quote: "Vine a comprender."
        },
        8: {
            title: "Poder",
            powerWord: "MANIFESTACIÓN",
            essence: "Éxito material, liderazgo práctico, abundancia.",
            quote: "Vine a materializar."
        },
        9: {
            title: "Trascendencia",
            powerWord: "COMPASIÓN",
            essence: "Cierre de ciclos, humanidad, altruismo.",
            quote: "Vine a servir al todo."
        },
        11: {
            title: "Iluminación",
            powerWord: "INSPIRACIÓN",
            essence: "Intuición elevada, visión, canal espiritual.",
            quote: "Vine a iluminar."
        },
        22: {
            title: "Maestro Constructor",
            powerWord: "CREACIÓN",
            essence: "Materializar grandes visiones para el colectivo.",
            quote: "Vine a construir para muchos."
        },
        33: {
            title: "Maestro Sanador",
            powerWord: "SANACIÓN",
            essence: "Amor incondicional, guía espiritual, servicio.",
            quote: "Vine a elevar."
        }
    };

    return {
        number,
        ...(details[number] || {
            title: "Desconocido",
            powerWord: "MISTERIO",
            essence: "Un camino aún por descubrir.",
            quote: "El universo tiene secretos para ti."
        })
    };
}
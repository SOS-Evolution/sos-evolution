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
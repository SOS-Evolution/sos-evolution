export interface BirthDetails {
    year: number;
    month: number;
    date: number;
    hours: number;
    minutes: number;
    seconds?: number;
    latitude: number;
    longitude: number;
    timezone: number;
    settings?: {
        ayanamsha?: string; // default 'nc_lahiri' for vedic, but we are doing western
    }
}

export interface PlanetPosition {
    name: string;
    fullDegree: number;
    normDegree: number;
    speed: number;
    isRetro: boolean;
    sign: string;
    signLord?: string;
    house: number;
}

export interface HouseCusp {
    house: number;
    fullDegree: number;
    normDegree: number;
    sign: string;
}

export interface WesternChartData {
    planets: PlanetPosition[];
    houses: HouseCusp[];
    ascendant?: string;
}

const API_BASE_URL = "https://json.freeastrologyapi.com";
// Note: Some endpoints might need an API key in the future, 
// using public access header if applicable or default.

export async function getWesternChartData(details: BirthDetails): Promise<WesternChartData | null> {
    try {
        const payload = {
            year: details.year,
            month: details.month,
            date: details.date,
            hours: details.hours,
            minutes: details.minutes,
            seconds: details.seconds || 0,
            latitude: details.latitude,
            longitude: details.longitude,
            timezone: details.timezone,
            config: {
                observation_point: "topocentric",
                ayanamsha: "tropical" // Western Astrology
            }
        };

        // Fetch Planets
        const planetsRes = await fetch(`${API_BASE_URL}/planets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FREE_ASTRO_API_KEY || ''
            },
            body: JSON.stringify(payload)
        });

        if (!planetsRes.ok) {
            console.error("API Error (Planets):", await planetsRes.text());
            return null;
        }


        const planetsData = await planetsRes.json();

        // Zodiac sign mapping (0-11 index to names)
        const zodiacs = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];

        // Extract planets from the unusual structure
        // The API returns output as an array where the first element is an object with numeric keys
        const planetsObject = planetsData?.output?.[0] || {};
        const planets: PlanetPosition[] = [];

        // Iterate through numeric keys (0-12 are planets, 13 is ayanamsa)
        for (let i = 0; i <= 12; i++) {
            const planetData = planetsObject[i.toString()];
            if (planetData && planetData.name && planetData.name !== 'ayanamsa') {
                planets.push({
                    name: planetData.name,
                    fullDegree: planetData.fullDegree || 0,
                    normDegree: planetData.normDegree || 0,
                    speed: planetData.speed || 0,
                    isRetro: planetData.isRetro === "true" || planetData.isRetro === true,
                    sign: zodiacs[planetData.current_sign] || "---",
                    signLord: planetData.sign_lord,
                    house: planetData.house_number || 0
                });
            }
        }

        // Calculate houses locally using Equal House system (each house = 30°)
        // The Ascendant marks the cusp of the 1st house
        const ascendant = planets.find(p => p.name === "Ascendant");
        const houses: HouseCusp[] = [];

        if (ascendant) {
            const ascDegree = ascendant.fullDegree;

            for (let i = 0; i < 12; i++) {
                const houseDegree = (ascDegree + (i * 30)) % 360;
                const signIndex = Math.floor(houseDegree / 30);

                houses.push({
                    house: i + 1,
                    fullDegree: houseDegree,
                    normDegree: houseDegree % 30,
                    sign: zodiacs[signIndex] || "---"
                });
            }
        }

        return {
            planets,
            houses
        };

    } catch (error) {
        console.error("Astrology API Client Error:", error);
        return null;
    }
}

import { getZodiacSign } from "./soul-math";

// Helper to get dummy data for dev/visual testing if API fails
export function getMockChartData(details?: BirthDetails): WesternChartData {
    const sunSign = details ? getZodiacSign(details.date, details.month) : "Aries";

    // Un cálculo muy aproximado del ascendente basado en la hora (cada 2 horas cambia el signo)
    // El sol sale en el ascendente al amanecer (aprox 6am)
    const zodiacs = ["Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"];
    const sunIndex = zodiacs.indexOf(sunSign);
    const hour = details?.hours ?? 12;
    // Offset aproximado: a las 6am el Asc e sunIndex, a las 12pm es +3 signos, etc.
    const ascOffset = Math.floor((hour + 18) % 24 / 2); // Ajuste rústico
    const ascIndex = (sunIndex + ascOffset) % 12;
    const ascSign = zodiacs[ascIndex];

    return {
        planets: [
            { name: "Sun", fullDegree: 15, normDegree: 15, speed: 1, isRetro: false, sign: sunSign, house: 1 },
            { name: "Moon", fullDegree: 45, normDegree: 15, speed: 13, isRetro: false, sign: "Taurus", house: 2 },
            { name: "Mercury", fullDegree: 10, normDegree: 10, speed: 1.5, isRetro: true, sign: sunSign, house: 1 },
            { name: "Venus", fullDegree: 125, normDegree: 5, speed: 1.2, isRetro: false, sign: sunSign, house: 1 },
            { name: "Mars", fullDegree: 200, normDegree: 20, speed: 0.5, isRetro: false, sign: "Libra", house: 7 },
            { name: "Jupiter", fullDegree: 280, normDegree: 10, speed: 0.1, isRetro: false, sign: "Capricorn", house: 10 },
            { name: "Saturn", fullDegree: 310, normDegree: 10, speed: 0.05, isRetro: true, sign: "Aquarius", house: 11 },
        ],
        houses: Array.from({ length: 12 }, (_, i) => {
            const hIndex = (ascIndex + i) % 12;
            return {
                house: i + 1,
                fullDegree: i * 30,
                normDegree: 0,
                sign: zodiacs[hIndex]
            };
        })
    };
}

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

import { getZodiacSign } from "./soul-math";

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
    aspects: Aspect[];
}

export interface Aspect {
    planet1: string;
    planet2: string;
    type: AspectType;
    orb: number;
    angle: number;
}

export type AspectType = "Conjunction" | "Opposition" | "Trine" | "Square" | "Sextile";

const ASPECTS = [
    { name: "Conjunction", angle: 0, orb: 8 },
    { name: "Opposition", angle: 180, orb: 8 },
    { name: "Trine", angle: 120, orb: 8 },
    { name: "Square", angle: 90, orb: 8 },
    { name: "Sextile", angle: 60, orb: 6 }
] as const;

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
    const aspects: Aspect[] = [];
    // Filter out Ascendant for aspect calculation if desired, or keep it. Usually relevant.
    // We'll calculate aspects between all bodies including Ascendant.

    for (let i = 0; i < planets.length; i++) {
        for (let j = i + 1; j < planets.length; j++) {
            const p1 = planets[i];
            const p2 = planets[j];

            // Calculate absolute difference
            let diff = Math.abs(p1.fullDegree - p2.fullDegree);
            // Shortest distance on circle
            if (diff > 180) diff = 360 - diff;

            for (const aspect of ASPECTS) {
                if (Math.abs(diff - aspect.angle) <= aspect.orb) {
                    aspects.push({
                        planet1: p1.name,
                        planet2: p2.name,
                        type: aspect.name as AspectType,
                        orb: parseFloat((Math.abs(diff - aspect.angle)).toFixed(2)),
                        angle: parseFloat(diff.toFixed(2))
                    });
                }
            }
        }
    }
    return aspects;
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

        // Zodiac sign mapping (0-11 index to names - using English as base keys for i18n)
        const zodiacs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

        // Extract planets from the unusual structure
        // The API returns output as an array where the first element is an object with numeric keys
        const planetsObject = planetsData?.output?.[0] || {};
        const planets: PlanetPosition[] = [];

        // Iterate through numeric keys (0-12 are planets, 13 is ayanamsa)
        for (let i = 0; i <= 12; i++) {
            const planetData = planetsObject[i.toString()];
            if (planetData && planetData.name && planetData.name !== 'ayanamsa') {
                const fullDegree = planetData.fullDegree || 0;

                // FALLBACK: Calculate sign index locally if API index is missing or out of bounds
                let signName = "---";
                if (zodiacs[planetData.current_sign]) {
                    signName = zodiacs[planetData.current_sign];
                } else {
                    // Calculate from fullDegree (0-360)
                    // 0-30 = Aries (0), 30-60 = Taurus (1), etc.
                    const computedIndex = Math.floor(fullDegree / 30) % 12;
                    signName = zodiacs[computedIndex] || "---";
                }

                planets.push({
                    name: planetData.name,
                    fullDegree: fullDegree,
                    normDegree: planetData.normDegree || (fullDegree % 30),
                    speed: planetData.speed || 0,
                    isRetro: planetData.isRetro === "true" || planetData.isRetro === true,
                    sign: signName,
                    signLord: planetData.sign_lord,
                    house: planetData.house_number || 0
                });
            }
        }

        // FORCE CORRECTION: Ensure Sun Sign matches local Tropical calculation
        // The API sometimes returns incorrect signs for cusp dates
        const correctSunSign = getZodiacSign(details.date, details.month);
        const sunPlanet = planets.find(p => p.name === "Sun");
        if (sunPlanet) {
            sunPlanet.sign = correctSunSign;
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

        const aspects = calculateAspects(planets);

        return {
            planets,
            houses,
            aspects
        };

    } catch (error) {
        console.error("Astrology API Client Error:", error);
        return null;
    }
}

export async function fetchDailyTransits(date = new Date()): Promise<any> {
    try {
        // Format date as DD-MM-YYYY as required by some endpoints, or standard ISO
        // The endpoint 'natal_transits/daily' usually takes current time if not specified, 
        // or we might need to pass specific parameters. 
        // Based on documentation, we'll try to POST with specific date.

        const payload = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            date: date.getDate(),
            hours: 12, // Noon is a good standard for daily transits
            minutes: 0,
            seconds: 0,
            latitude: 40.7128, // Default to a neutral location (e.g. NYC/Greenwich) as transits are geocentric roughly
            longitude: -74.0060,
            timezone: 0,
            config: {
                observation_point: "geocentric", // Transits are usually geocentric
                ayanamsha: "tropical"
            }
        };

        const response = await fetch(`${API_BASE_URL}/planets`, { // Using /planets for transits as it gives raw positions
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FREE_ASTRO_API_KEY || ''
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error("Error fetching daily transits:", await response.text());
            return null;
        }

        const data = await response.json();
        // Return just the planetary positions
        return data?.output?.[0] || null;

    } catch (error) {
        console.error("Fetch Daily Transits Error:", error);
        return null;
    }
}

// Helper to get dummy data for dev/visual testing if API fails
export function getMockChartData(details?: BirthDetails): WesternChartData {
    const sunSignES = details ? getZodiacSign(details.date, details.month) : "Aries";
    const signMap: Record<string, string> = {
        "Aries": "Aries", "Tauro": "Taurus", "Géminis": "Gemini", "Cáncer": "Cancer",
        "Leo": "Leo", "Virgo": "Virgo", "Libra": "Libra", "Escorpio": "Scorpio",
        "Sagitario": "Sagittarius", "Capricornio": "Capricorn", "Acuario": "Aquarius", "Piscis": "Pisces"
    };
    const sunSign = signMap[sunSignES] || sunSignES;

    const zodiacs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const sunIndex = zodiacs.indexOf(sunSign);
    const hour = details?.hours ?? 12;
    const ascOffset = Math.floor((hour + 18) % 24 / 2);
    const ascIndex = (sunIndex + ascOffset) % 12;

    const planets: PlanetPosition[] = [
        { name: "Sun", fullDegree: 15, normDegree: 15, speed: 1, isRetro: false, sign: sunSign, house: 1 },
        { name: "Moon", fullDegree: 45, normDegree: 15, speed: 13, isRetro: false, sign: "Taurus", house: 2 },
        { name: "Mercury", fullDegree: 10, normDegree: 10, speed: 1.5, isRetro: true, sign: sunSign, house: 1 },
        { name: "Venus", fullDegree: 125, normDegree: 5, speed: 1.2, isRetro: false, sign: sunSign, house: 1 },
        { name: "Mars", fullDegree: 200, normDegree: 20, speed: 0.5, isRetro: false, sign: "Libra", house: 7 },
        { name: "Jupiter", fullDegree: 280, normDegree: 10, speed: 0.1, isRetro: false, sign: "Capricorn", house: 10 },
        { name: "Saturn", fullDegree: 310, normDegree: 10, speed: 0.05, isRetro: true, sign: "Aquarius", house: 11 },
        { name: "Uranus", fullDegree: 45, normDegree: 15, speed: 0.01, isRetro: true, sign: "Taurus", house: 2 },
        { name: "Neptune", fullDegree: 350, normDegree: 20, speed: 0.01, isRetro: false, sign: "Pisces", house: 12 },
        { name: "Pluto", fullDegree: 290, normDegree: 20, speed: 0.005, isRetro: false, sign: "Capricorn", house: 10 },
        { name: "Ascendant", fullDegree: 0, normDegree: 0, speed: 0, isRetro: false, sign: zodiacs[ascIndex], house: 1 },
    ];

    const aspects = calculateAspects(planets);

    return {
        planets,
        houses: Array.from({ length: 12 }, (_, i) => {
            const hIndex = (ascIndex + i) % 12;
            return {
                house: i + 1,
                fullDegree: i * 30,
                normDegree: 0,
                sign: zodiacs[hIndex]
            };
        }),
        aspects
    };
}

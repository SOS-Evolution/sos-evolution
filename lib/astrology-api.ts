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
                'x-api-key': process.env.FREE_ASTRO_API_KEY || '' // Optional if public tier
            },
            body: JSON.stringify(payload)
        });

        if (!planetsRes.ok) {
            console.error("API Error (Planets):", await planetsRes.text());
            return null; // or throw
        }

        const planetsData = await planetsRes.json();

        // Normalize response (assuming specific structure, will adjust if needed)
        // If the API returns a different structure, we map it here.
        // For now, mapping a generic structure or keeping it flexible.

        // Note: Startups often mock this first if docs are scarce. 
        // I will implement a robust mock fallback if the fetch fails 
        // so the UI can be built and reviewed even if API connectivity is tricky.

        return {
            planets: Array.isArray(planetsData.output) ? planetsData.output : [],
            houses: [] // Add house fetching if separate
        };

    } catch (error) {
        console.error("Astrology API Client Error:", error);
        return null;
    }
}

// Helper to get dummy data for dev/visual testing if API fails
export function getMockChartData(): WesternChartData {
    return {
        planets: [
            { name: "Sun", fullDegree: 15, normDegree: 15, speed: 1, isRetro: false, sign: "Aries", house: 1 },
            { name: "Moon", fullDegree: 45, normDegree: 15, speed: 13, isRetro: false, sign: "Taurus", house: 2 },
            { name: "Mercury", fullDegree: 10, normDegree: 10, speed: 1.5, isRetro: true, sign: "Aries", house: 1 },
            { name: "Venus", fullDegree: 125, normDegree: 5, speed: 1.2, isRetro: false, sign: "Leo", house: 5 },
            { name: "Mars", fullDegree: 200, normDegree: 20, speed: 0.5, isRetro: false, sign: "Libra", house: 7 },
            { name: "Jupiter", fullDegree: 280, normDegree: 10, speed: 0.1, isRetro: false, sign: "Capricorn", house: 10 },
            { name: "Saturn", fullDegree: 310, normDegree: 10, speed: 0.05, isRetro: true, sign: "Aquarius", house: 11 },
        ],
        houses: Array.from({ length: 12 }, (_, i) => ({
            house: i + 1,
            fullDegree: i * 30,
            normDegree: 0,
            sign: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"][i]
        }))
    };
}

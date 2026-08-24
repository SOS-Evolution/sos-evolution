import * as Astronomy from 'astronomy-engine';
import { getZodiacSign } from "./soul-math";

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
        ayanamsha?: string;
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

// ──────────────────────────────────────────────────────────────────────────
// LOCAL EPHEMERIS HELPERS (astronomy-engine - no external API)
// ──────────────────────────────────────────────────────────────────────────

const ZODIACS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

/** Get geocentric ecliptic longitude (0-360°) for a body at a given AstroTime */
function eclLon(body: Astronomy.Body, time: Astronomy.AstroTime): number {
    const vec = Astronomy.GeoVector(body, time, true);
    const ecl = Astronomy.Ecliptic(vec);
    return ((ecl.elon % 360) + 360) % 360;
}

/** Detect retrograde via daily motion sign (negative = retrograde) */
function isRetro(body: Astronomy.Body, utcDate: Date): boolean {
    const t1 = Astronomy.MakeTime(new Date(utcDate.getTime() - 86400000));
    const t2 = Astronomy.MakeTime(new Date(utcDate.getTime() + 86400000));
    let diff = eclLon(body, t2) - eclLon(body, t1);
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return diff < 0;
}

/** Moon's ascending node longitude (Rahu) - IAU 1980 formula, accurate to ~0.05° */
function rahuLongitude(time: Astronomy.AstroTime): number {
    const T = time.ut / 36525.0; // Julian centuries from J2000
    return ((125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360 + 360) % 360;
}

/** Compute Ascendant ecliptic degree from Local Sidereal Time and latitude */
function computeAscendant(time: Astronomy.AstroTime, latDeg: number, lonDeg: number): number {
    const gst = Astronomy.SiderealTime(time); // sidereal hours
    const lst = ((gst * 15 + lonDeg) % 360 + 360) % 360; // degrees
    const lstR = lst * Math.PI / 180;
    const T = time.ut / 36525;
    const eps = (23.4392911 - 0.013004167 * T) * Math.PI / 180; // obliquity
    const latR = latDeg * Math.PI / 180;
    const asc = Math.atan2(-Math.cos(lstR), Math.sin(lstR) * Math.cos(eps) + Math.tan(latR) * Math.sin(eps));
    return ((asc * 180 / Math.PI) % 360 + 360) % 360;
}

// ──────────────────────────────────────────────────────────────────────────
// PUBLIC FUNCTIONS
// ──────────────────────────────────────────────────────────────────────────

export async function getWesternChartData(details: BirthDetails): Promise<WesternChartData | null> {
    try {
        const { year, month, date: day, hours, minutes, seconds = 0, latitude, longitude, timezone } = details;

        // Convert local birth time → UTC
        const localMs = Date.UTC(year, month - 1, day, hours, minutes, seconds);
        const utcDate = new Date(localMs - timezone * 3600 * 1000);
        const time = Astronomy.MakeTime(utcDate);

        const mkPlanet = (name: string, lon: number, speed: number, retro: boolean): PlanetPosition => ({
            name,
            fullDegree: parseFloat(lon.toFixed(4)),
            normDegree: parseFloat((lon % 30).toFixed(4)),
            speed,
            isRetro: retro,
            sign: ZODIACS[Math.floor(lon / 30) % 12] || "---",
            house: 0,
        });

        const rahu = rahuLongitude(time);
        const ketu = (rahu + 180) % 360;
        const ascDeg = computeAscendant(time, latitude, longitude);

        const planetsRaw: PlanetPosition[] = [
            mkPlanet("Sun",       eclLon(Astronomy.Body.Sun,     time), 1.0,   false),
            mkPlanet("Moon",      eclLon(Astronomy.Body.Moon,    time), 13.0,  false),
            mkPlanet("Mercury",   eclLon(Astronomy.Body.Mercury, time), 1.5,   isRetro(Astronomy.Body.Mercury, utcDate)),
            mkPlanet("Venus",     eclLon(Astronomy.Body.Venus,   time), 1.2,   isRetro(Astronomy.Body.Venus,   utcDate)),
            mkPlanet("Mars",      eclLon(Astronomy.Body.Mars,    time), 0.5,   isRetro(Astronomy.Body.Mars,    utcDate)),
            mkPlanet("Jupiter",   eclLon(Astronomy.Body.Jupiter, time), 0.1,   isRetro(Astronomy.Body.Jupiter, utcDate)),
            mkPlanet("Saturn",    eclLon(Astronomy.Body.Saturn,  time), 0.05,  isRetro(Astronomy.Body.Saturn,  utcDate)),
            mkPlanet("Uranus",    eclLon(Astronomy.Body.Uranus,  time), 0.01,  isRetro(Astronomy.Body.Uranus,  utcDate)),
            mkPlanet("Neptune",   eclLon(Astronomy.Body.Neptune, time), 0.01,  isRetro(Astronomy.Body.Neptune, utcDate)),
            mkPlanet("Pluto",     eclLon(Astronomy.Body.Pluto,   time), 0.005, isRetro(Astronomy.Body.Pluto,   utcDate)),
            mkPlanet("Rahu",      rahu,                                 -0.053, true),
            mkPlanet("Ketu",      ketu,                                 -0.053, true),
            mkPlanet("Ascendant", ascDeg,                               0,     false),
        ];

        // Assign house numbers using equal house system (30° per house from Ascendant)
        const planets: PlanetPosition[] = planetsRaw.map(p => ({
            ...p,
            house: Math.floor(((p.fullDegree - ascDeg + 360) % 360) / 30) + 1,
        }));

        // Force Sun sign via local tropical algorithm (guards against floating-point edge cases)
        const sunPlanet = planets.find(p => p.name === "Sun");
        if (sunPlanet) sunPlanet.sign = getZodiacSign(day, month);

        const houses: HouseCusp[] = Array.from({ length: 12 }, (_, i) => {
            const deg = (ascDeg + i * 30) % 360;
            return { house: i + 1, fullDegree: deg, normDegree: deg % 30, sign: ZODIACS[Math.floor(deg / 30) % 12] };
        });

        return { planets, houses, aspects: calculateAspects(planets) };

    } catch (error) {
        console.error("Local Chart Calculation Error:", error);
        return null;
    }
}

/** Compute real-time planetary transits locally (no external API required) */
export async function fetchDailyTransits(date = new Date()): Promise<Record<string, unknown>> {
    try {
        const time = Astronomy.MakeTime(date);

        const mkEntry = (name: string, lon: number, retro = false) => ({
            name,
            fullDegree: parseFloat(lon.toFixed(4)),
            normDegree: parseFloat((lon % 30).toFixed(4)),
            current_sign: Math.floor(lon / 30) % 12,
            isRetro: retro,
        });

        // Moon's nodes
        const rahu = rahuLongitude(time);
        const ketu = (rahu + 180) % 360;

        return {
            "0":  mkEntry("Sun",     eclLon(Astronomy.Body.Sun,     time)),
            "1":  mkEntry("Moon",    eclLon(Astronomy.Body.Moon,    time)),
            "2":  mkEntry("Mars",    eclLon(Astronomy.Body.Mars,    time), isRetro(Astronomy.Body.Mars,    date)),
            "3":  mkEntry("Mercury", eclLon(Astronomy.Body.Mercury, time), isRetro(Astronomy.Body.Mercury, date)),
            "4":  mkEntry("Jupiter", eclLon(Astronomy.Body.Jupiter, time), isRetro(Astronomy.Body.Jupiter, date)),
            "5":  mkEntry("Venus",   eclLon(Astronomy.Body.Venus,   time), isRetro(Astronomy.Body.Venus,   date)),
            "6":  mkEntry("Saturn",  eclLon(Astronomy.Body.Saturn,  time), isRetro(Astronomy.Body.Saturn,  date)),
            "7":  mkEntry("Rahu",    rahu,  true),
            "8":  mkEntry("Ketu",    ketu,  true),
            "9":  mkEntry("Uranus",  eclLon(Astronomy.Body.Uranus,  time), isRetro(Astronomy.Body.Uranus,  date)),
            "10": mkEntry("Neptune", eclLon(Astronomy.Body.Neptune, time), isRetro(Astronomy.Body.Neptune, date)),
            "11": mkEntry("Pluto",   eclLon(Astronomy.Body.Pluto,   time), isRetro(Astronomy.Body.Pluto,   date)),
        };
    } catch (error) {
        console.error("Local Transit Calculation Error:", error);
        return getMockTransits();
    }
}

// Helper to get dummy transits for dev/visual testing if API fails
export function getMockTransits(): Record<string, unknown> {
    // Returns a structure similar to the API's output[0]
    return {
        "0": { name: "Sun", current_sign: 8, fullDegree: 255 }, // Sagitario
        "1": { name: "Moon", current_sign: 11, fullDegree: 345 }, // Piscis
        "2": { name: "Mars", current_sign: 6, fullDegree: 190 }, // Libra
        "3": { name: "Mercury", current_sign: 8, fullDegree: 245 }, // Sagitario
        "4": { name: "Jupiter", current_sign: 1, fullDegree: 45 }, // Tauro
        "5": { name: "Venus", current_sign: 7, fullDegree: 220 }, // Escorpio
        "6": { name: "Saturn", current_sign: 11, fullDegree: 335 }, // Piscis
        "7": { name: "Rahu", current_sign: 0, fullDegree: 10 },
        "8": { name: "Ketu", current_sign: 6, fullDegree: 190 },
        "9": { name: "Uranus", current_sign: 1, fullDegree: 50 },
        "10": { name: "Neptune", current_sign: 11, fullDegree: 355 },
        "11": { name: "Pluto", current_sign: 9, fullDegree: 295 }, // Capricornio
        "12": { name: "Ascendant", current_sign: 9, fullDegree: 280 }
    };
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

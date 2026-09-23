"use client";

import React from "react";

export type ZodiacSignName =
    | "Aries"
    | "Taurus"
    | "Tauro"
    | "Gemini"
    | "Géminis"
    | "Cancer"
    | "Cáncer"
    | "Leo"
    | "Virgo"
    | "Libra"
    | "Scorpio"
    | "Escorpio"
    | "Sagittarius"
    | "Sagitario"
    | "Capricorn"
    | "Capricornio"
    | "Aquarius"
    | "Acuario"
    | "Pisces"
    | "Piscis"
    | string;

export type ZodiacElement = "fire" | "earth" | "air" | "water";

export interface ZodiacMetadata {
    normalizedName: string;
    element: ZodiacElement;
    elementNameEs: string;
    elementNameEn: string;
    modality: "cardinal" | "fixed" | "mutable";
    rulingPlanet: string;
    color: string;
    glowColor: string;
    accentGradient: string;
    bgGradient: string;
    borderColor: string;
}

const ZODIAC_METADATA_MAP: Record<string, ZodiacMetadata> = {
    Aries: {
        normalizedName: "Aries",
        element: "fire",
        elementNameEs: "Fuego",
        elementNameEn: "Fire",
        modality: "cardinal",
        rulingPlanet: "Mars",
        color: "#f87171", // red-400
        glowColor: "rgba(239, 68, 68, 0.45)",
        accentGradient: "from-red-500 to-amber-500",
        bgGradient: "from-red-950/40 via-amber-950/20 to-transparent",
        borderColor: "border-red-500/30"
    },
    Taurus: {
        normalizedName: "Taurus",
        element: "earth",
        elementNameEs: "Tierra",
        elementNameEn: "Earth",
        modality: "fixed",
        rulingPlanet: "Venus",
        color: "#34d399", // emerald-400
        glowColor: "rgba(16, 185, 129, 0.45)",
        accentGradient: "from-emerald-500 to-teal-500",
        bgGradient: "from-emerald-950/40 via-teal-950/20 to-transparent",
        borderColor: "border-emerald-500/30"
    },
    Gemini: {
        normalizedName: "Gemini",
        element: "air",
        elementNameEs: "Aire",
        elementNameEn: "Air",
        modality: "mutable",
        rulingPlanet: "Mercury",
        color: "#38bdf8", // sky-400
        glowColor: "rgba(56, 189, 248, 0.45)",
        accentGradient: "from-sky-400 to-indigo-400",
        bgGradient: "from-sky-950/40 via-indigo-950/20 to-transparent",
        borderColor: "border-sky-500/30"
    },
    Cancer: {
        normalizedName: "Cancer",
        element: "water",
        elementNameEs: "Agua",
        elementNameEn: "Water",
        modality: "cardinal",
        rulingPlanet: "Moon",
        color: "#818cf8", // indigo-400
        glowColor: "rgba(129, 140, 248, 0.45)",
        accentGradient: "from-indigo-400 to-cyan-400",
        bgGradient: "from-indigo-950/40 via-cyan-950/20 to-transparent",
        borderColor: "border-indigo-500/30"
    },
    Leo: {
        normalizedName: "Leo",
        element: "fire",
        elementNameEs: "Fuego",
        elementNameEn: "Fire",
        modality: "fixed",
        rulingPlanet: "Sun",
        color: "#fbbf24", // amber-400
        glowColor: "rgba(251, 191, 36, 0.45)",
        accentGradient: "from-amber-400 to-yellow-500",
        bgGradient: "from-amber-950/40 via-yellow-950/20 to-transparent",
        borderColor: "border-amber-500/30"
    },
    Virgo: {
        normalizedName: "Virgo",
        element: "earth",
        elementNameEs: "Tierra",
        elementNameEn: "Earth",
        modality: "mutable",
        rulingPlanet: "Mercury",
        color: "#2dd4bf", // teal-400
        glowColor: "rgba(45, 212, 191, 0.45)",
        accentGradient: "from-teal-400 to-emerald-400",
        bgGradient: "from-teal-950/40 via-emerald-950/20 to-transparent",
        borderColor: "border-teal-500/30"
    },
    Libra: {
        normalizedName: "Libra",
        element: "air",
        elementNameEs: "Aire",
        elementNameEn: "Air",
        modality: "cardinal",
        rulingPlanet: "Venus",
        color: "#f472b6", // pink-400
        glowColor: "rgba(244, 114, 182, 0.45)",
        accentGradient: "from-pink-400 to-purple-400",
        bgGradient: "from-pink-950/40 via-purple-950/20 to-transparent",
        borderColor: "border-pink-500/30"
    },
    Scorpio: {
        normalizedName: "Scorpio",
        element: "water",
        elementNameEs: "Agua",
        elementNameEn: "Water",
        modality: "fixed",
        rulingPlanet: "Pluto",
        color: "#e879f9", // fuchsia-400
        glowColor: "rgba(232, 121, 249, 0.45)",
        accentGradient: "from-fuchsia-500 to-rose-500",
        bgGradient: "from-fuchsia-950/40 via-rose-950/20 to-transparent",
        borderColor: "border-fuchsia-500/30"
    },
    Sagittarius: {
        normalizedName: "Sagittarius",
        element: "fire",
        elementNameEs: "Fuego",
        elementNameEn: "Fire",
        modality: "mutable",
        rulingPlanet: "Jupiter",
        color: "#c084fc", // purple-400
        glowColor: "rgba(192, 132, 252, 0.45)",
        accentGradient: "from-purple-400 to-indigo-500",
        bgGradient: "from-purple-950/40 via-indigo-950/20 to-transparent",
        borderColor: "border-purple-500/30"
    },
    Capricorn: {
        normalizedName: "Capricorn",
        element: "earth",
        elementNameEs: "Tierra",
        elementNameEn: "Earth",
        modality: "cardinal",
        rulingPlanet: "Saturn",
        color: "#a3e635", // lime-400
        glowColor: "rgba(163, 230, 53, 0.45)",
        accentGradient: "from-lime-400 to-emerald-500",
        bgGradient: "from-lime-950/40 via-emerald-950/20 to-transparent",
        borderColor: "border-lime-500/30"
    },
    Aquarius: {
        normalizedName: "Aquarius",
        element: "air",
        elementNameEs: "Aire",
        elementNameEn: "Air",
        modality: "fixed",
        rulingPlanet: "Uranus",
        color: "#22d3ee", // cyan-400
        glowColor: "rgba(34, 211, 238, 0.45)",
        accentGradient: "from-cyan-400 to-blue-500",
        bgGradient: "from-cyan-950/40 via-blue-950/20 to-transparent",
        borderColor: "border-cyan-500/30"
    },
    Pisces: {
        normalizedName: "Pisces",
        element: "water",
        elementNameEs: "Agua",
        elementNameEn: "Water",
        modality: "mutable",
        rulingPlanet: "Neptune",
        color: "#60a5fa", // blue-400
        glowColor: "rgba(96, 165, 250, 0.45)",
        accentGradient: "from-blue-400 to-indigo-500",
        bgGradient: "from-blue-950/40 via-indigo-950/20 to-transparent",
        borderColor: "border-blue-500/30"
    }
};

// Aliases for Spanish input
const NAME_ALIASES: Record<string, string> = {
    tauro: "Taurus",
    géminis: "Gemini",
    geminis: "Gemini",
    cáncer: "Cancer",
    escorpio: "Scorpio",
    sagitario: "Sagittarius",
    capricornio: "Capricorn",
    acuario: "Aquarius",
    piscis: "Pisces"
};

export function normalizeZodiacName(name: string): string {
    if (!name) return "Aries";
    const lower = name.trim().toLowerCase();
    if (NAME_ALIASES[lower]) return NAME_ALIASES[lower];
    const match = Object.keys(ZODIAC_METADATA_MAP).find(
        (key) => key.toLowerCase() === lower
    );
    return match || "Aries";
}

export function getZodiacMetadata(name: string): ZodiacMetadata {
    const key = normalizeZodiacName(name);
    return (
        ZODIAC_METADATA_MAP[key] || {
            normalizedName: name || "Aries",
            element: "fire",
            elementNameEs: "Fuego",
            elementNameEn: "Fire",
            modality: "cardinal",
            rulingPlanet: "Mars",
            color: "#fbbf24",
            glowColor: "rgba(251, 191, 36, 0.4)",
            accentGradient: "from-amber-400 to-yellow-500",
            bgGradient: "from-amber-950/30 to-transparent",
            borderColor: "border-amber-500/30"
        }
    );
}

export const ZODIAC_COLORS: Record<string, string> = {
    Aries: "#f87171",
    Tauro: "#34d399",
    Taurus: "#34d399",
    Géminis: "#38bdf8",
    Gemini: "#38bdf8",
    Cáncer: "#818cf8",
    Cancer: "#818cf8",
    Leo: "#fbbf24",
    Virgo: "#2dd4bf",
    Libra: "#f472b6",
    Escorpio: "#e879f9",
    Scorpio: "#e879f9",
    Sagitario: "#c084fc",
    Sagittarius: "#c084fc",
    Capricornio: "#a3e635",
    Capricorn: "#a3e635",
    Acuario: "#22d3ee",
    Aquarius: "#22d3ee",
    Piscis: "#60a5fa",
    Pisces: "#60a5fa"
};

export const ZODIAC_SYMBOLS: Record<string, string> = {
    Aries: "♈",
    Tauro: "♉",
    Taurus: "♉",
    Géminis: "♊",
    Gemini: "♊",
    Cáncer: "♋",
    Cancer: "♋",
    Leo: "♌",
    Virgo: "♍",
    Libra: "♎",
    Escorpio: "♏",
    Scorpio: "♏",
    Sagitario: "♐",
    Sagittarius: "♐",
    Capricornio: "♑",
    Capricorn: "♑",
    Acuario: "♒",
    Aquarius: "♒",
    Piscis: "♓",
    Pisces: "♓"
};

/**
 * Clean, high-fidelity SVG paths for each of the 12 signs in 24x24 coordinates
 */
export function ZodiacVectorPath({ sign }: { sign: string }) {
    const norm = normalizeZodiacName(sign);

    switch (norm) {
        case "Aries":
            return (
                <path
                    d="M12 21V9m0 0C12 5.5 9 3 5.5 3 2.5 3 2 5.5 2 7.5m10 1.5C12 5.5 15 3 18.5 3 21.5 3 22 5.5 22 7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Taurus":
            return (
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <circle cx="12" cy="14" r="6" />
                    <path d="M5.5 4C7.5 7.5 9.5 8.5 12 8.5s4.5-1 6.5-4.5" />
                </g>
            );
        case "Gemini":
            return (
                <path
                    d="M4 4c5 2.5 11 2.5 16 0M4 20c5-2.5 11-2.5 16 0M9 5v14M15 5v14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Cancer":
            return (
                <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <circle cx="7" cy="8" r="3" />
                    <path d="M7 5c8-1.5 13 3 13 8.5" />
                    <circle cx="17" cy="16" r="3" />
                    <path d="M17 19c-8 1.5-13-3-13-8.5" />
                </g>
            );
        case "Leo":
            return (
                <path
                    d="M5.5 16a2.5 2.5 0 1 1 3-3c0 2-1 4-1 4s0-9 6.5-9 6 5 3.5 8.5c-1.5 2-2 4 0 6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Virgo":
            return (
                <path
                    d="M4 6v10a2 2 0 0 0 4 0V6a2 2 0 0 1 4 0v10a2 2 0 0 0 4 0V6a2 2 0 0 1 4 0v8c0 3-1 6-3.5 6s-2.5-2-1.5-4l4.5-4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Libra":
            return (
                <path
                    d="M4 19h16M4 14h5a3.5 3.5 0 1 1 6 0h5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Scorpio":
            return (
                <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <path d="M3 6v10a2 2 0 0 0 4 0V6a2 2 0 0 1 4 0v10a2 2 0 0 0 4 0V6a2 2 0 0 1 4 0v10a2 2 0 0 0 3 2h2" />
                    <path d="M17 15l4 3-4 3" />
                </g>
            );
        case "Sagittarius":
            return (
                <path
                    d="M5 19L19 5m0 0h-7m7 0v7M8.5 15.5l5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Capricorn":
            return (
                <path
                    d="M4 6v9a2 2 0 0 0 4 0V7.5a2 2 0 0 1 4 0v10c0 3 2 4.5 4 4.5s3.5-1.5 2.5-4-3-3.5-4-2.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Aquarius":
            return (
                <path
                    d="M3 9l3-3 3 3 3-3 3 3 3-3 3 3M3 17l3-3 3 3 3-3 3 3 3-3 3 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        case "Pisces":
            return (
                <path
                    d="M5 4c3.5 4.5 3.5 11.5 0 16M19 4c-3.5 4.5-3.5 11.5 0 16M3 12h18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            );
        default:
            return (
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
            );
    }
}

interface ZodiacIconProps {
    name: string;
    className?: string;
    size?: number;
    color?: string;
    variant?: "pure" | "badge" | "glow" | "chip";
    showLabel?: boolean;
    labelClassName?: string;
    locale?: string;
}

export default function ZodiacIcon({
    name,
    className = "",
    size = 24,
    color,
    variant = "pure",
    showLabel = false,
    labelClassName = "",
    locale = "es"
}: ZodiacIconProps) {
    const meta = getZodiacMetadata(name);
    const activeColor = color || meta.color;

    const iconSvg = (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={`transition-all duration-300 ${variant === "pure" ? className : ""}`}
            style={{
                color: activeColor,
                filter: `drop-shadow(0 0 ${Math.max(2, size / 6)}px ${meta.glowColor})`
            }}
            aria-label={meta.normalizedName}
        >
            <ZodiacVectorPath sign={name} />
        </svg>
    );

    if (variant === "pure" && !showLabel) {
        return iconSvg;
    }

    if (variant === "badge") {
        const badgePadding = Math.max(6, size * 0.3);
        return (
            <div
                className={`inline-flex items-center justify-center rounded-2xl border transition-all duration-300 shadow-lg ${meta.borderColor} ${className}`}
                style={{
                    padding: badgePadding,
                    background: `radial-gradient(circle at 50% 50%, ${meta.glowColor} 0%, rgba(15, 23, 42, 0.7) 100%)`,
                    boxShadow: `0 0 20px -5px ${meta.glowColor}`
                }}
                title={meta.normalizedName}
            >
                {iconSvg}
            </div>
        );
    }

    if (variant === "glow") {
        return (
            <div className={`relative inline-flex items-center justify-center group ${className}`}>
                <div
                    className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity"
                    style={{ backgroundColor: meta.color }}
                />
                <div className="relative z-10">{iconSvg}</div>
            </div>
        );
    }

    if (variant === "chip" || showLabel) {
        return (
            <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-slate-900/60 backdrop-blur-md transition-all duration-200 hover:scale-105 ${meta.borderColor} ${className}`}
                style={{
                    boxShadow: `0 2px 12px -3px ${meta.glowColor}`
                }}
            >
                {iconSvg}
                <div className="flex flex-col text-left leading-none">
                    <span className={`text-xs font-serif font-bold text-white tracking-wide ${labelClassName}`}>
                        {name}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                        {locale === "en" ? meta.elementNameEn : meta.elementNameEs}
                    </span>
                </div>
            </div>
        );
    }

    return iconSvg;
}

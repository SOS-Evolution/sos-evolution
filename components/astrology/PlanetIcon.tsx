"use client";

import React from "react";

export const PLANET_COLORS: Record<string, string> = {
    Sun: "#fbbf24", // warm solar gold
    Sol: "#fbbf24",
    Moon: "#f1f5f9", // silvery moonlight
    Luna: "#f1f5f9",
    Mercury: "#38bdf8", // quicksilver cyan
    Mercurio: "#38bdf8",
    Venus: "#f472b6", // radiant rose
    Mars: "#ef4444", // fiery crimson
    Marte: "#ef4444",
    Jupiter: "#eab308", // regal amber
    Júpiter: "#eab308",
    Saturn: "#94a3b8", // steady slate / cosmic bone
    Saturno: "#94a3b8",
    Uranus: "#22d3ee", // electric electric cyan
    Urano: "#22d3ee",
    Neptune: "#6366f1", // oceanic indigo
    Neptuno: "#6366f1",
    Pluto: "#a855f7", // mystical deep violet
    Plutón: "#a855f7",
    Chiron: "#10b981", // healing emerald
    Quirón: "#10b981",
    Lilith: "#f43f5e", // dark moon rose
    "North Node": "#3b82f6", // destiny blue
    "Nodo Norte": "#3b82f6",
    "South Node": "#ec4899", // karma magenta
    "Nodo Sur": "#ec4899",
    Rahu: "#3b82f6",
    Ketu: "#ec4899",
    Ascendant: "#f59e0b", // dawn gold
    Ascendente: "#f59e0b",
    Earth: "#10b981",
    Tierra: "#10b981"
};

const PLANET_GLYPHS: Record<string, React.ReactNode> = {
    Sun: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </g>
    ),
    Sol: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </g>
    ),
    Moon: (
        <path
            d="M13 3.5a8.5 8.5 0 1 0 7.5 12.5 8 8 0 0 1-7.5-12.5Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    Luna: (
        <path
            d="M13 3.5a8.5 8.5 0 1 0 7.5 12.5 8 8 0 0 1-7.5-12.5Z"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    Mercury: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {/* Horns / crescent */}
            <path d="M8 3.5a4 4 0 0 0 8 0" />
            {/* Head */}
            <circle cx="12" cy="9.5" r="3.5" />
            {/* Cross */}
            <path d="M12 13v7.5M9 17h6" />
        </g>
    ),
    Mercurio: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3.5a4 4 0 0 0 8 0" />
            <circle cx="12" cy="9.5" r="3.5" />
            <path d="M12 13v7.5M9 17h6" />
        </g>
    ),
    Venus: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8.5" r="5" />
            <path d="M12 13.5v7.5M8.5 17.5h7" />
        </g>
    ),
    Mars: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9.5" cy="14.5" r="5" />
            <path d="M13.5 10.5L20 4m0 0h-5m5 0v5" />
        </g>
    ),
    Marte: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9.5" cy="14.5" r="5" />
            <path d="M13.5 10.5L20 4m0 0h-5m5 0v5" />
        </g>
    ),
    Jupiter: (
        <path
            d="M8.5 5.5v13M5.5 11h9.5c2.5 0 4-1.5 4-3.5s-1.5-3.5-4-3.5c-4 0-5.5 4-5.5 7"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    Júpiter: (
        <path
            d="M8.5 5.5v13M5.5 11h9.5c2.5 0 4-1.5 4-3.5s-1.5-3.5-4-3.5c-4 0-5.5 4-5.5 7"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    Saturn: (
        <path
            d="M7.5 4v11c0 2 1.5 3 3.5 3s3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5h-5.5M5.5 7.5h6"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    Saturno: (
        <path
            d="M7.5 4v11c0 2 1.5 3 3.5 3s3.5-1.5 3.5-3.5-1.5-3.5-3.5-3.5h-5.5M5.5 7.5h6"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    ),
    Uranus: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="17" r="3.2" />
            <path d="M12 13.8V4M7 4h10M7 4v7M17 4v7" />
        </g>
    ),
    Urano: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="17" r="3.2" />
            <path d="M12 13.8V4M7 4h10M7 4v7M17 4v7" />
        </g>
    ),
    Neptune: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5V3.5M7 6c0 4.5 2.5 7 5 7s5-2.5 5-7M9 17.5h6" />
        </g>
    ),
    Neptuno: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20.5V3.5M7 6c0 4.5 2.5 7 5 7s5-2.5 5-7M9 17.5h6" />
        </g>
    ),
    Pluto: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 8a5 5 0 0 0 10 0" />
            <circle cx="12" cy="7" r="2.5" />
            <path d="M12 13v7.5M8.5 17.5h7" />
        </g>
    ),
    Plutón: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 8a5 5 0 0 0 10 0" />
            <circle cx="12" cy="7" r="2.5" />
            <path d="M12 13v7.5M8.5 17.5h7" />
        </g>
    ),
    Chiron: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="16" r="4" />
            <path d="M12 12V4M12 7l4-3M12 10l4-3" />
        </g>
    ),
    Quirón: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="16" r="4" />
            <path d="M12 12V4M12 7l4-3M12 10l4-3" />
        </g>
    ),
    Lilith: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 4a6 6 0 1 0 0 10 5.5 5.5 0 0 1 0-10Z" />
            <path d="M12 14v7M9 17.5h6" />
        </g>
    ),
    "North Node": (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="16" r="2.5" />
            <circle cx="17" cy="16" r="2.5" />
            <path d="M7 13.5C7 8 17 8 17 13.5" />
        </g>
    ),
    "Nodo Norte": (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="16" r="2.5" />
            <circle cx="17" cy="16" r="2.5" />
            <path d="M7 13.5C7 8 17 8 17 13.5" />
        </g>
    ),
    "South Node": (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="8" r="2.5" />
            <circle cx="17" cy="8" r="2.5" />
            <path d="M7 10.5C7 16 17 16 17 10.5" />
        </g>
    ),
    "Nodo Sur": (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="8" r="2.5" />
            <circle cx="17" cy="8" r="2.5" />
            <path d="M7 10.5C7 16 17 16 17 10.5" />
        </g>
    ),
    Rahu: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="16" r="2.5" />
            <circle cx="17" cy="16" r="2.5" />
            <path d="M7 13.5C7 8 17 8 17 13.5" />
        </g>
    ),
    Ketu: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="8" r="2.5" />
            <circle cx="17" cy="8" r="2.5" />
            <path d="M7 10.5C7 16 17 16 17 10.5" />
        </g>
    ),
    Ascendant: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16M5 11l7-7 7 7" />
            <path d="M8 18h8" />
        </g>
    ),
    Ascendente: (
        <g stroke="currentColor" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v16M5 11l7-7 7 7" />
            <path d="M8 18h8" />
        </g>
    )
};

interface PlanetIconProps {
    name: string;
    className?: string;
    size?: number;
    color?: string;
}

export default function PlanetIcon({ name, className = "", size = 24, color }: PlanetIconProps) {
    const glyph = PLANET_GLYPHS[name];
    const iconColor = color || PLANET_COLORS[name] || "currentColor";

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={`transition-colors duration-200 ${className}`}
            style={{ color: iconColor }}
            aria-label={name}
        >
            {glyph || (
                <g stroke="currentColor" fill="none" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="7" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </g>
            )}
        </svg>
    );
}

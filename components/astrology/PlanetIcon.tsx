"use client";

import React from "react";

export const PLANET_COLORS: Record<string, string> = {
    "Sun": "#facc15", "Moon": "#f1f5f9", "Mercury": "#94a3b8", "Venus": "#f472b6",
    "Mars": "#ef4444", "Jupiter": "#fbbf24", "Saturn": "#94a3b8", "Uranus": "#22d3ee",
    "Neptune": "#6366f1", "Pluto": "#7f1d1d"
};

const PLANET_GLYPHS: Record<string, React.ReactNode> = {
    "Sun": (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="0.5" fill="currentColor" />
        </g>
    ),
    "Moon": (
        <path d="M12 3a9 9 0 1 0 9 9 9.75 9.75 0 0 1-9-9Z" stroke="currentColor" fill="none" strokeWidth="1.5" />
    ),
    "Mercury": (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
            <circle cx="12" cy="11" r="4" />
            <path d="M12 15v4m-2-2h4M9 3a5 5 0 0 1 6 0" />
        </g>
    ),
    "Venus": (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
            <circle cx="12" cy="9" r="5" />
            <path d="M12 14v6m-3-3h6" />
        </g>
    ),
    "Mars": (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
            <circle cx="9" cy="15" r="5" />
            <path d="M13 11l6-6m0 0h-4m4 0v4" />
        </g>
    ),
    "Jupiter": (
        <path d="M12 3v12M7 10h10M9 15c0 3 2 4 4 4" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    ),
    "Saturn": (
        <path d="M8 3v14c0 3 2 4 5 4M6 10h6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    ),
    "Uranus": (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
            <circle cx="12" cy="17" r="3" />
            <path d="M12 14V4M8 4h8M8 4v6M16 4v6" />
        </g>
    ),
    "Neptune": (
        <path d="M12 21V3M8 6c0 4 2 6 4 6s4-2 4-6M9 21h6" stroke="currentColor" fill="none" strokeWidth="1.5" strokeLinecap="round" />
    ),
    "Pluto": (
        <g stroke="currentColor" fill="none" strokeWidth="1.5">
            <path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 13v5M8 18h8" />
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
            className={className}
            style={{ color: iconColor }}
        >
            {glyph || (
                <circle cx="12" cy="12" r="8" stroke="currentColor" fill="none" strokeWidth="2" />
            )}
        </svg>
    );
}

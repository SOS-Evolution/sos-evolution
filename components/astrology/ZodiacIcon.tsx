"use client";

import React from "react";

interface ZodiacIconProps {
    name: string;
    className?: string;
    size?: number;
    color?: string;
}

export const ZODIAC_COLORS: Record<string, string> = {
    "Aries": "#ef4444",
    "Tauro": "#f59e0b",
    "Géminis": "#10b981",
    "Cáncer": "#3b82f6",
    "Leo": "#fbbf24",
    "Virgo": "#059669",
    "Libra": "#ec4899",
    "Escorpio": "#991b1b",
    "Sagitario": "#a855f7",
    "Capricornio": "#64748b",
    "Acuario": "#2563eb",
    "Piscis": "#6366f1",
    // Versiones en inglés por si acaso
    "Taurus": "#f59e0b",
    "Gemini": "#10b981",
    "Cancer": "#3b82f6",
    "Scorpio": "#991b1b",
    "Sagittarius": "#a855f7",
    "Capricorn": "#64748b",
    "Aquarius": "#2563eb",
    "Pisces": "#6366f1",
};

export const ZODIAC_SYMBOLS: Record<string, string> = {
    "Aries": "♈",
    "Tauro": "♉",
    "Géminis": "♊",
    "Cáncer": "♋",
    "Leo": "♌",
    "Virgo": "♍",
    "Libra": "♎",
    "Escorpio": "♏",
    "Sagitario": "♐",
    "Capricornio": "♑",
    "Acuario": "♒",
    "Piscis": "♓",
    "Taurus": "♉",
    "Gemini": "♊",
    "Cancer": "♋",
    "Scorpio": "♏",
    "Sagittarius": "♐",
    "Capricorn": "♑",
    "Aquarius": "♒",
    "Pisces": "♓",
};

export default function ZodiacIcon({ name, className = "", size = 24, color }: ZodiacIconProps) {
    const symbol = ZODIAC_SYMBOLS[name] || "?";
    const iconColor = color || ZODIAC_COLORS[name] || "currentColor";

    return (
        <span
            className={`inline-flex items-center justify-center font-bold ${className}`}
            style={{
                fontSize: size,
                color: iconColor,
                textShadow: `0 0 ${size / 2}px ${iconColor}40`
            }}
            title={name}
        >
            {symbol}
        </span>
    );
}

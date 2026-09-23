"use client";

import React from "react";

export interface NumberVibrationMeta {
    number: number;
    title: string;
    keyword: string;
    geometry: string;
    color: string;
    glowColor: string;
    gradient: string;
    borderColor: string;
    isMaster?: boolean;
}

export const NUMBER_METADATA: Record<number, NumberVibrationMeta> = {
    1: {
        number: 1,
        title: "El Iniciador",
        keyword: "Independencia & Origen",
        geometry: "Mónada (Círculo & Punto)",
        color: "#fbbf24", // gold
        glowColor: "rgba(251, 191, 36, 0.45)",
        gradient: "from-amber-400 to-yellow-500",
        borderColor: "border-amber-400/40"
    },
    2: {
        number: 2,
        title: "El Diplomático",
        keyword: "Dualidad & Armonía",
        geometry: "Vesica Piscis (Unión)",
        color: "#818cf8", // indigo
        glowColor: "rgba(129, 140, 248, 0.45)",
        gradient: "from-indigo-400 to-cyan-400",
        borderColor: "border-indigo-400/40"
    },
    3: {
        number: 3,
        title: "El Creador",
        keyword: "Expresión & Alegría",
        geometry: "Triángulo Sagrado (Trinidad)",
        color: "#f59e0b", // warm amber
        glowColor: "rgba(245, 158, 11, 0.45)",
        gradient: "from-amber-500 to-rose-400",
        borderColor: "border-amber-500/40"
    },
    4: {
        number: 4,
        title: "El Constructor",
        keyword: "Estructura & Raíz",
        geometry: "Cuadrado de la Tierra",
        color: "#10b981", // emerald
        glowColor: "rgba(16, 185, 129, 0.45)",
        gradient: "from-emerald-400 to-teal-500",
        borderColor: "border-emerald-400/40"
    },
    5: {
        number: 5,
        title: "El Aventurero",
        keyword: "Libertad & Movimiento",
        geometry: "Pentagrama (Quintaesencia)",
        color: "#06b6d4", // cyan
        glowColor: "rgba(6, 182, 212, 0.45)",
        gradient: "from-cyan-400 to-sky-500",
        borderColor: "border-cyan-400/40"
    },
    6: {
        number: 6,
        title: "El Guardián",
        keyword: "Amor, Hogar & Servicio",
        geometry: "Hexagrama (Equilibrio)",
        color: "#ec4899", // pink
        glowColor: "rgba(236, 72, 153, 0.45)",
        gradient: "from-pink-400 to-rose-500",
        borderColor: "border-pink-400/40"
    },
    7: {
        number: 7,
        title: "El Sabio Místico",
        keyword: "Introspección & Verdad",
        geometry: "Espiral Heptagonal",
        color: "#a855f7", // purple
        glowColor: "rgba(168, 85, 247, 0.45)",
        gradient: "from-purple-400 to-violet-500",
        borderColor: "border-purple-400/40"
    },
    8: {
        number: 8,
        title: "El Manifestador",
        keyword: "Poder & Abundancia",
        geometry: "Infinito Vertical (Lemniscata)",
        color: "#eab308", // regal gold
        glowColor: "rgba(234, 179, 8, 0.45)",
        gradient: "from-amber-400 to-yellow-600",
        borderColor: "border-amber-400/40"
    },
    9: {
        number: 9,
        title: "El Humanitario",
        keyword: "Universalidad & Cierre",
        geometry: "Eneagrama (Totalidad)",
        color: "#3b82f6", // sapphire blue
        glowColor: "rgba(59, 130, 246, 0.45)",
        gradient: "from-blue-400 to-indigo-500",
        borderColor: "border-blue-400/40"
    },
    11: {
        number: 11,
        title: "El Iluminador",
        keyword: "Canal Espiritual Maestro",
        geometry: "Portal 11:11 (Pilares de Luz)",
        color: "#fef08a", // radiant star
        glowColor: "rgba(254, 240, 138, 0.55)",
        gradient: "from-yellow-200 via-amber-300 to-white",
        borderColor: "border-yellow-300/60",
        isMaster: true
    },
    22: {
        number: 22,
        title: "El Maestro Constructor",
        keyword: "Materialización de Utopías",
        geometry: "Cubo Sagrado / Doble Cuadrado",
        color: "#34d399", // bright emerald
        glowColor: "rgba(52, 211, 153, 0.55)",
        gradient: "from-emerald-300 via-teal-400 to-amber-300",
        borderColor: "border-emerald-300/60",
        isMaster: true
    },
    33: {
        number: 33,
        title: "El Maestro Guía",
        keyword: "Amor Crístico Universal",
        geometry: "Estrella de David Solar",
        color: "#c084fc", // lavender star
        glowColor: "rgba(192, 132, 252, 0.55)",
        gradient: "from-purple-300 via-pink-400 to-amber-200",
        borderColor: "border-purple-300/60",
        isMaster: true
    }
};

export function getNumberMetadata(num: number): NumberVibrationMeta {
    return (
        NUMBER_METADATA[num] || {
            number: num,
            title: `Frecuencia ${num}`,
            keyword: "Resonancia Sagrada",
            geometry: "Matriz Matemática",
            color: "#a855f7",
            glowColor: "rgba(168, 85, 247, 0.4)",
            gradient: "from-purple-400 to-indigo-500",
            borderColor: "border-purple-400/30"
        }
    );
}

/**
 * Sacred Geometry Vector Glyphs for each Number
 */
function SacredGeometrySvg({ num, size }: { num: number; size: number }) {
    switch (num) {
        case 1:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" strokeDasharray="3 3" opacity="0.6" />
                    <circle cx="12" cy="12" r="5" strokeWidth="2" />
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
            );
        case 2:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="9" cy="12" r="6" />
                    <circle cx="15" cy="12" r="6" />
                    <line x1="12" y1="6" x2="12" y2="18" strokeDasharray="2 2" opacity="0.5" />
                </svg>
            );
        case 3:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="12,3 21,19 3,19" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="2" fill="currentColor" opacity="0.8" />
                </svg>
            );
        case 4:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="4" y="4" width="16" height="16" rx="2" strokeLinejoin="round" />
                    <line x1="12" y1="4" x2="12" y2="20" opacity="0.4" />
                    <line x1="4" y1="12" x2="20" y2="12" opacity="0.4" />
                </svg>
            );
        case 5:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <polygon points="12,2 15,8.5 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,8.5" strokeLinejoin="round" />
                </svg>
            );
        case 6:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12,2 21,17 3,17" strokeLinejoin="round" />
                    <polygon points="12,22 21,7 3,7" strokeLinejoin="round" />
                </svg>
            );
        case 7:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="9" opacity="0.4" />
                    <path d="M12 3a9 9 0 0 1 9 9 7 7 0 0 1-7 7 5 5 0 0 1-5-5 3 3 0 0 1 3-3 1 1 0 0 1 1 1" strokeLinecap="round" />
                </svg>
            );
        case 8:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="7.5" r="4.5" />
                    <circle cx="12" cy="16.5" r="4.5" />
                </svg>
            );
        case 9:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <polygon points="12,3 19.8,7.5 19.8,16.5 12,21 4.2,16.5 4.2,7.5" opacity="0.6" />
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.3" />
                </svg>
            );
        case 11:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="3" x2="8" y2="21" strokeLinecap="round" />
                    <line x1="16" y1="3" x2="16" y2="21" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3" strokeDasharray="2 2" opacity="0.7" />
                </svg>
            );
        case 22:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12,2 21,7 12,12 3,7" />
                    <polygon points="12,12 21,7 21,17 12,22" />
                    <polygon points="12,12 3,7 3,17 12,22" />
                </svg>
            );
        case 33:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12,2 21,17 3,17" />
                    <polygon points="12,22 21,7 3,7" />
                    <circle cx="12" cy="12" r="7" strokeDasharray="3 3" opacity="0.8" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
            );
        default:
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                </svg>
            );
    }
}

interface NumerologyGlyphProps {
    number: number;
    size?: number;
    variant?: "badge" | "pure" | "orb" | "chip";
    className?: string;
    color?: string;
}

export default function NumerologyGlyph({
    number,
    size = 32,
    variant = "badge",
    className = "",
    color
}: NumerologyGlyphProps) {
    const meta = getNumberMetadata(number);
    const activeColor = color || meta.color;

    if (variant === "pure") {
        return (
            <div
                className={`inline-flex items-center justify-center font-mono font-black ${className}`}
                style={{
                    color: activeColor,
                    fontSize: size,
                    textShadow: `0 0 12px ${meta.glowColor}`
                }}
            >
                {number}
            </div>
        );
    }

    if (variant === "orb") {
        return (
            <div
                className={`relative inline-flex items-center justify-center rounded-full transition-transform hover:scale-110 duration-300 ${className}`}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: `${meta.color}15`,
                    border: `1.5px solid ${meta.color}60`,
                    boxShadow: `0 0 16px -2px ${meta.glowColor}`
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-25">
                    <SacredGeometrySvg num={number} size={Math.round(size * 0.7)} />
                </div>
                <span
                    className="relative z-10 font-mono font-bold"
                    style={{
                        color: activeColor,
                        fontSize: Math.round(size * 0.45)
                    }}
                >
                    {number}
                </span>
            </div>
        );
    }

    if (variant === "chip") {
        return (
            <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-slate-900/80 backdrop-blur-md transition-all duration-200 hover:scale-105 ${meta.borderColor} ${className}`}
                style={{
                    boxShadow: `0 2px 14px -4px ${meta.glowColor}`
                }}
            >
                <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                    style={{
                        backgroundColor: `${meta.color}20`,
                        color: activeColor
                    }}
                >
                    {number}
                </div>
                <div className="flex flex-col text-left leading-none">
                    <span className="text-xs font-serif font-bold text-white tracking-wide">
                        {meta.title}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium mt-0.5">
                        {meta.keyword}
                    </span>
                </div>
            </div>
        );
    }

    // Default "badge"
    return (
        <div
            className={`relative inline-flex items-center justify-center rounded-2xl border transition-all duration-300 group overflow-hidden ${meta.borderColor} ${className}`}
            style={{
                width: size,
                height: size,
                background: `radial-gradient(circle at 50% 50%, ${meta.glowColor} 0%, rgba(15, 23, 42, 0.8) 100%)`,
                boxShadow: `0 0 20px -4px ${meta.glowColor}`
            }}
            title={`${meta.title} • ${meta.geometry}`}
        >
            {/* Sacred Geometry Watermark in Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-35 transition-opacity text-white">
                <SacredGeometrySvg num={number} size={Math.round(size * 0.75)} />
            </div>

            {/* Number Text */}
            <span
                className="relative z-10 font-mono font-black tracking-tighter"
                style={{
                    color: activeColor,
                    fontSize: Math.round(size * 0.42),
                    filter: `drop-shadow(0 0 8px ${meta.glowColor})`
                }}
            >
                {number}
            </span>

            {meta.isMaster && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
            )}
        </div>
    );
}

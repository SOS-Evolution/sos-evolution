"use client";

import { motion } from "framer-motion";
import { PlanetPosition, HouseCusp } from "@/lib/astrology-api";

import PlanetIcon, { PLANET_COLORS } from "./PlanetIcon";

interface AstrologyWheelProps {
    planets: PlanetPosition[];
    houses: HouseCusp[];
    size?: number;
}

const ZODIAC_SIGNS = [
    { name: "Aries", symbol: "♈", color: "#ef4444" },
    { name: "Tauro", symbol: "♉", color: "#f59e0b" },
    { name: "Géminis", symbol: "♊", color: "#10b981" },
    { name: "Cáncer", symbol: "♋", color: "#3b82f6" },
    { name: "Leo", symbol: "♌", color: "#fbbf24" },
    { name: "Virgo", symbol: "♍", color: "#059669" },
    { name: "Libra", symbol: "♎", color: "#ec4899" },
    { name: "Escorpio", symbol: "♏", color: "#991b1b" },
    { name: "Sagitario", symbol: "♐", color: "#a855f7" },
    { name: "Capricornio", symbol: "♑", color: "#64748b" },
    { name: "Acuario", symbol: "♒", color: "#2563eb" },
    { name: "Piscis", symbol: "♓", color: "#6366f1" },
];

import { useState, useEffect } from "react";

export default function AstrologyWheel({ planets, houses, size = 500 }: AstrologyWheelProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const radius = size / 2;
    const center = radius;
    const innerRadius = radius * 0.75;
    const midRadius = radius * 0.88;

    if (!mounted) return <div style={{ width: size, height: size }} />;

    return (
        <div className="relative flex items-center justify-center select-none" style={{ width: size, height: size }}>
            {/* Background Glows */}
            <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-[100px]" />
            <div className="absolute inset-20 bg-purple-500/5 rounded-full blur-[60px] animate-pulse" />

            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* 1. Zodiac Segments */}
                {ZODIAC_SIGNS.map((sign, i) => {
                    const startAngle = i * 30;
                    const endAngle = (i + 1) * 30;

                    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
                        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                        return {
                            x: Number((centerX + (radius * Math.cos(angleInRadians))).toFixed(3)),
                            y: Number((centerY + (radius * Math.sin(angleInRadians))).toFixed(3))
                        };
                    };

                    const start = polarToCartesian(center, center, radius, startAngle);
                    const end = polarToCartesian(center, center, radius, endAngle);
                    const startInner = polarToCartesian(center, center, innerRadius, startAngle);
                    const endInner = polarToCartesian(center, center, innerRadius, endAngle);

                    const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y} L ${endInner.x} ${endInner.y} A ${innerRadius} ${innerRadius} 0 0 0 ${startInner.x} ${startInner.y} Z`;

                    return (
                        <g key={sign.name} className="group">
                            <path
                                d={d}
                                fill="rgba(15, 23, 42, 0.4)"
                                stroke="rgba(99, 102, 241, 0.4)"
                                strokeWidth="1.5"
                                className="transition-all group-hover:fill-indigo-500/10 cursor-pointer"
                            />
                            <text
                                x={polarToCartesian(center, center, midRadius, startAngle + 15).x}
                                y={polarToCartesian(center, center, midRadius, startAngle + 15).y}
                                fill="white"
                                fontSize="26"
                                fontWeight="bold"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                            >
                                {sign.symbol}
                            </text>
                        </g>
                    );
                })}

                {/* 2. Concentric Rings */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="2.5" />
                <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="rgba(99, 102, 241, 0.7)" strokeWidth="1.5" />
                <circle cx={center} cy={center} r={innerRadius - 40} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                {/* 3. Planets */}
                {planets.map((planet, idx) => {
                    const angle = planet.fullDegree;
                    const angleInRadians = (angle - 90) * Math.PI / 180.0;
                    const pRadius = innerRadius - 20;
                    const x = Number((center + (pRadius * Math.cos(angleInRadians))).toFixed(3));
                    const y = Number((center + (pRadius * Math.sin(angleInRadians))).toFixed(3));
                    const pColor = PLANET_COLORS[planet.name] || "#ffffff";

                    return (
                        <motion.g
                            key={`${planet.name}-${idx}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 + (idx * 0.05), type: "spring" }}
                        >
                            <line
                                x1={center} y1={center} x2={x} y2={y}
                                stroke={pColor}
                                strokeOpacity="0.7"
                                strokeWidth="3"
                                strokeDasharray="6 4"
                            />

                            <g className="cursor-help transition-transform hover:scale-110">
                                {/* Enhanced Glow */}
                                <circle cx={x} cy={y} r="20" fill={pColor} className="opacity-30 blur-[6px]" />
                                <circle cx={x} cy={y} r="16" fill="rgba(15, 23, 42, 0.95)" stroke={pColor} strokeWidth="2.5" />

                                {/* Custom SVG Glyph - Centered and Enlarged */}
                                <g transform={`translate(${x - 14}, ${y - 14})`}>
                                    <PlanetIcon name={planet.name} size={28} />
                                </g>

                                <title>{planet.name} en {planet.sign} ({planet.normDegree.toFixed(1)}°)</title>
                            </g>
                        </motion.g>
                    );
                })}

                {/* 4. Houses */}
                {houses.map((house) => {
                    const angle = house.fullDegree;
                    const angleInRadians = (angle - 90) * Math.PI / 180.0;
                    const x1 = Number((center + (innerRadius * Math.cos(angleInRadians))).toFixed(3));
                    const y1 = Number((center + (innerRadius * Math.sin(angleInRadians))).toFixed(3));
                    const x2 = Number((center + ((innerRadius - 60) * Math.cos(angleInRadians))).toFixed(3));
                    const y2 = Number((center + ((innerRadius - 60) * Math.sin(angleInRadians))).toFixed(3));

                    return (
                        <line
                            key={`house-${house.house}`}
                            x1={x1} y1={y1} x2={x2} y2={y2}
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Core */}
                <circle cx={center} cy={center} r="15" fill="white" className="animate-pulse opacity-10" />
                <circle cx={center} cy={center} r="5" fill="white" className="filter drop-shadow-[0_0_10px_white]" />
            </svg>

            {/* Glass Overlay Centered */}
            <div
                className="absolute rounded-full border border-white/20 bg-slate-950/70 backdrop-blur-[6px] shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]"
                style={{
                    width: (innerRadius - 60) * 2,
                    height: (innerRadius - 60) * 2,
                    zIndex: 5
                }}
            />
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
}

export function CelestialFrame({ className }: FrameProps) {
    return (
        <div className={cn("pointer-events-none select-none", className)}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-xl"
            >
                <defs>
                    <linearGradient id="celestial-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bf953f" />
                        <stop offset="25%" stopColor="#fcf6ba" />
                        <stop offset="50%" stopColor="#b38728" />
                        <stop offset="75%" stopColor="#fbf5b7" />
                        <stop offset="100%" stopColor="#aa771c" />
                    </linearGradient>
                </defs>

                {/* Borde exterior fino rectangular */}
                <rect
                    x="10"
                    y="10"
                    width="280"
                    height="430"
                    rx="2"
                    stroke="url(#celestial-gold)"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                />

                {/* Arco Superior Principal */}
                <path
                    d="M20 70 V30 Q20 20 30 20 H270 Q280 20 280 30 V70"
                    stroke="url(#celestial-gold)"
                    strokeWidth="1.5"
                    fill="none"
                />

                {/* Elemento central superior */}
                <path
                    d="M150 12 L150 28 M142 18 Q150 15 158 18 M135 22 Q150 18 165 22"
                    stroke="url(#celestial-gold)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* Esquina Superior Izquierda: Sol y Luna */}
                <g transform="translate(30, 35)">
                    <circle cx="0" cy="0" r="8" stroke="url(#celestial-gold)" strokeWidth="1" />
                    <path d="M0 -12 V-10 M0 10 V12 M-12 0 H-10 M10 0 H12 M-8 -8 L-7 -7 M7 7 L8 8 M-8 8 L-7 7 M7 -7 L8 -8" stroke="url(#celestial-gold)" strokeWidth="1" />
                    <path d="M2 -5 A 5 5 0 0 1 2 5 A 4 4 0 0 0 2 -5" fill="url(#celestial-gold)" />
                    <circle cx="-15" cy="-15" r="1.5" fill="url(#celestial-gold)" />
                    <circle cx="15" cy="-15" r="1" fill="url(#celestial-gold)" />
                    <circle cx="-15" cy="15" r="1" fill="url(#celestial-gold)" />
                </g>
                <path d="M20 70 Q20 40 50 30" stroke="url(#celestial-gold)" strokeWidth="1.5" fill="none" />

                {/* Esquina Superior Derecha: Luna y Estrellas */}
                <g transform="translate(260, 35)">
                    <path d="M5 -8 A 10 10 0 1 0 5 12 A 8 8 0 1 1 5 -8" fill="url(#celestial-gold)" />
                    <circle cx="-10" cy="-5" r="1.2" fill="url(#celestial-gold)" />
                    <circle cx="-15" cy="5" r="0.8" fill="url(#celestial-gold)" />
                    <circle cx="-5" cy="15" r="1.1" fill="url(#celestial-gold)" />
                </g>
                <path d="M280 70 Q280 40 250 30" stroke="url(#celestial-gold)" strokeWidth="1.5" fill="none" />

                {/* Bordes laterales con detalles */}
                <path d="M20 70 V380 M280 70 V380" stroke="url(#celestial-gold)" strokeWidth="1" strokeDasharray="150 10 10 10" />
                <circle cx="20" cy="225" r="2.5" fill="url(#celestial-gold)" />
                <circle cx="280" cy="225" r="2.5" fill="url(#celestial-gold)" />

                {/* Esquinas Inferiores: Filigrana */}
                <g transform="translate(20, 430)">
                    <path d="M0 -50 Q0 -20 30 -20" stroke="url(#celestial-gold)" strokeWidth="1.5" fill="none" />
                    <path d="M10 -10 Q25 -10 30 -25" stroke="url(#celestial-gold)" strokeWidth="1" fill="none" />
                    <path d="M5 -30 Q15 -35 20 -20" stroke="url(#celestial-gold)" strokeWidth="1" fill="none" />
                    <circle cx="0" cy="-55" r="2" fill="url(#celestial-gold)" />
                </g>

                <g transform="translate(280, 430) scale(-1, 1)">
                    <path d="M0 -50 Q0 -20 30 -20" stroke="url(#celestial-gold)" strokeWidth="1.5" fill="none" />
                    <path d="M10 -10 Q25 -10 30 -25" stroke="url(#celestial-gold)" strokeWidth="1" fill="none" />
                    <path d="M5 -30 Q15 -35 20 -20" stroke="url(#celestial-gold)" strokeWidth="1" fill="none" />
                    <circle cx="0" cy="-55" r="2" fill="url(#celestial-gold)" />
                </g>

                {/* Detalle central inferior */}
                <path
                    d="M130 430 H170 M150 425 V440 M140 435 L160 435"
                    stroke="url(#celestial-gold)"
                    strokeWidth="1"
                    fill="none"
                />
                <path
                    d="M150 422 Q150 415 145 415 M150 422 Q150 415 155 415"
                    stroke="url(#celestial-gold)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* Línea base */}
                <path d="M50 430 H130 M170 430 H250" stroke="url(#celestial-gold)" strokeWidth="1.5" />

            </svg>
        </div>
    );
}

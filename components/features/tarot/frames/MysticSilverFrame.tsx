"use client";

import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
}

export function MysticSilverFrame({ className }: FrameProps) {
    return (
        <div className={cn("pointer-events-none select-none", className)}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-lg"
            >
                <defs>
                    <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#708090" />
                        <stop offset="25%" stopColor="#C0C0C0" />
                        <stop offset="50%" stopColor="#E0E0E0" />
                        <stop offset="75%" stopColor="#DCDCDC" />
                        <stop offset="100%" stopColor="#778899" />
                    </linearGradient>
                </defs>

                {/* Borde Principal */}
                <rect
                    x="4"
                    y="4"
                    width="292"
                    height="442"
                    rx="12"
                    ry="12"
                    stroke="url(#silver-gradient)"
                    strokeWidth="2"
                    strokeDasharray="10 5"
                />

                {/* Borde Doble Fino */}
                <rect
                    x="8"
                    y="8"
                    width="284"
                    height="434"
                    rx="8"
                    ry="8"
                    stroke="url(#silver-gradient)"
                    strokeWidth="0.5"
                    strokeOpacity="0.4"
                />

                {/* Lunas en las esquinas */}
                {/* Sup Izq */}
                <path d="M 30 30 A 10 10 0 1 0 30 50 A 8 8 0 1 1 30 30" fill="url(#silver-gradient)" transform="translate(-10, -10)" />
                {/* Sup Der */}
                <path d="M 270 30 A 10 10 0 1 1 270 50 A 8 8 0 1 0 270 30" fill="url(#silver-gradient)" transform="translate(10, -10)" />
                {/* Inf Izq */}
                <path d="M 30 420 A 10 10 0 1 0 30 400 A 8 8 0 1 1 30 420" fill="url(#silver-gradient)" transform="translate(-10, 10)" />
                {/* Inf Der */}
                <path d="M 270 420 A 10 10 0 1 1 270 400 A 8 8 0 1 0 270 420" fill="url(#silver-gradient)" transform="translate(10, 10)" />

                {/* Estrellas */}
                <path d="M 150 20 L 152 25 L 157 25 L 153 28 L 154 33 L 150 30 L 146 33 L 147 28 L 143 25 L 148 25 Z" fill="url(#silver-gradient)" className="animate-pulse" />
                <path d="M 150 430 L 152 425 L 157 425 L 153 422 L 154 417 L 150 420 L 146 417 L 147 422 L 143 425 L 148 425 Z" fill="url(#silver-gradient)" className="animate-pulse" />

                {/* Líneas ornamentales laterales */}
                <path d="M 20 225 H 40 M 260 225 H 280" stroke="url(#silver-gradient)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

            </svg>
        </div>
    );
}

"use client";

import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
}

export function GoldenClassicFrame({ className }: FrameProps) {
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
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#bf953f" />
                        <stop offset="25%" stopColor="#fcf6ba" />
                        <stop offset="50%" stopColor="#b38728" />
                        <stop offset="75%" stopColor="#fbf5b7" />
                        <stop offset="100%" stopColor="#aa771c" />
                    </linearGradient>
                </defs>

                <rect
                    x="2"
                    y="2"
                    width="296"
                    height="446"
                    rx="12"
                    ry="12"
                    stroke="url(#gold-gradient)"
                    strokeWidth="3"
                />

                <rect
                    x="2"
                    y="2"
                    width="296"
                    height="446"
                    rx="12"
                    ry="12"
                    stroke="url(#gold-gradient)"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                    className="animate-pulse"
                />

                {/* Esquina Superior Izquierda */}
                <path d="M15 15 H50 M15 15 V50 M15 15 L35 35" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="15" cy="15" r="3" fill="url(#gold-gradient)" />
                <path d="M15 50 Q 15 70 30 70 M 50 15 Q 70 15 70 30" stroke="url(#gold-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                {/* Esquina Superior Derecha */}
                <path d="M285 15 H250 M285 15 V50 M285 15 L265 35" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="285" cy="15" r="3" fill="url(#gold-gradient)" />
                <path d="M285 50 Q 285 70 270 70 M 250 15 Q 230 15 230 30" stroke="url(#gold-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                {/* Esquina Inferior Izquierda */}
                <path d="M15 435 H50 M15 435 V400 M15 435 L35 415" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="15" cy="435" r="3" fill="url(#gold-gradient)" />
                <path d="M15 400 Q 15 380 30 380 M 50 435 Q 70 435 70 420" stroke="url(#gold-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                {/* Esquina Inferior Derecha */}
                <path d="M285 435 H250 M285 435 V400 M285 435 L265 415" stroke="url(#gold-gradient)" strokeWidth="2" strokeLinecap="round" />
                <circle cx="285" cy="435" r="3" fill="url(#gold-gradient)" />
                <path d="M285 400 Q 285 380 270 380 M 250 435 Q 230 435 230 420" stroke="url(#gold-gradient)" strokeWidth="1.5" fill="none" strokeLinecap="round" />

                <path d="M 2 225 L 8 220 L 8 230 Z" fill="url(#gold-gradient)" stroke="none" />
                <path d="M 298 225 L 292 220 L 292 230 Z" fill="url(#gold-gradient)" stroke="none" />
            </svg>
        </div>
    );
}

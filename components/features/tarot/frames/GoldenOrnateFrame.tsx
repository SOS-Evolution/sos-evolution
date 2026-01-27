"use client";

import { cn } from "@/lib/utils";

interface FrameProps {
    className?: string;
}

export function GoldenOrnateFrame({ className }: FrameProps) {
    return (
        <div className={cn("pointer-events-none select-none", className)}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 450"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-full drop-shadow-2xl"
            >
                <defs>
                    <linearGradient id="ornate-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8A6E2F" />
                        <stop offset="25%" stopColor="#F5E4A9" />
                        <stop offset="50%" stopColor="#D4AF37" />
                        <stop offset="75%" stopColor="#FFF9E3" />
                        <stop offset="100%" stopColor="#A67C00" />
                    </linearGradient>

                    <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Doble Borde Exterior Robusto */}
                <rect
                    x="4"
                    y="4"
                    width="292"
                    height="442"
                    rx="14"
                    ry="14"
                    stroke="url(#ornate-gold)"
                    strokeWidth="5"
                />

                <rect
                    x="10"
                    y="10"
                    width="280"
                    height="430"
                    rx="10"
                    ry="10"
                    stroke="url(#ornate-gold)"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                />

                {/* Esquina Superior Izquierda: Filigrana Densa */}
                <g transform="translate(4, 4)">
                    <path
                        d="M0 80 Q0 30 30 30 Q60 30 60 0"
                        stroke="url(#ornate-gold)"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 70 Q10 40 40 40 Q70 40 70 10"
                        stroke="url(#ornate-gold)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.5"
                    />
                    <circle cx="0" cy="0" r="12" fill="url(#ornate-gold)" />
                    <circle cx="0" cy="0" r="6" fill="#1a1a1a" />
                    <circle cx="0" cy="0" r="3" fill="url(#ornate-gold)" className="animate-pulse" />
                </g>

                {/* Esquina Superior Derecha: Filigrana Densa */}
                <g transform="translate(296, 4) scale(-1, 1)">
                    <path
                        d="M0 80 Q0 30 30 30 Q60 30 60 0"
                        stroke="url(#ornate-gold)"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 70 Q10 40 40 40 Q70 40 70 10"
                        stroke="url(#ornate-gold)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.5"
                    />
                    <circle cx="0" cy="0" r="12" fill="url(#ornate-gold)" />
                    <circle cx="0" cy="0" r="6" fill="#1a1a1a" />
                    <circle cx="0" cy="0" r="3" fill="url(#ornate-gold)" className="animate-pulse" />
                </g>

                {/* Esquina Inferior Izquierda: Filigrana Densa */}
                <g transform="translate(4, 446) scale(1, -1)">
                    <path
                        d="M0 80 Q0 30 30 30 Q60 30 60 0"
                        stroke="url(#ornate-gold)"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 70 Q10 40 40 40 Q70 40 70 10"
                        stroke="url(#ornate-gold)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.5"
                    />
                    <circle cx="0" cy="0" r="12" fill="url(#ornate-gold)" />
                    <circle cx="0" cy="0" r="6" fill="#1a1a1a" />
                    <circle cx="0" cy="0" r="3" fill="url(#ornate-gold)" className="animate-pulse" />
                </g>

                {/* Esquina Inferior Derecha: Filigrana Densa */}
                <g transform="translate(296, 446) scale(-1, -1)">
                    <path
                        d="M0 80 Q0 30 30 30 Q60 30 60 0"
                        stroke="url(#ornate-gold)"
                        strokeWidth="3.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                    <path
                        d="M10 70 Q10 40 40 40 Q70 40 70 10"
                        stroke="url(#ornate-gold)"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.5"
                    />
                    <circle cx="0" cy="0" r="12" fill="url(#ornate-gold)" />
                    <circle cx="0" cy="0" r="6" fill="#1a1a1a" />
                    <circle cx="0" cy="0" r="3" fill="url(#ornate-gold)" className="animate-pulse" />
                </g>

                {/* Emblemas Centrales de Borde */}
                <g transform="translate(150, 4)">
                    <path d="M-20 0 Q0 25 20 0" stroke="url(#ornate-gold)" strokeWidth="3" fill="none" />
                    <path d="M-15 10 H15" stroke="url(#ornate-gold)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="4" fill="url(#ornate-gold)" />
                </g>
                <g transform="translate(150, 446) scale(1, -1)">
                    <path d="M-20 0 Q0 25 20 0" stroke="url(#ornate-gold)" strokeWidth="3" fill="none" />
                    <path d="M-15 10 H15" stroke="url(#ornate-gold)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="4" fill="url(#ornate-gold)" />
                </g>

                {/* Decoración Lateral Media */}
                <path d="M4 225 L12 215 V235 Z" fill="url(#ornate-gold)" />
                <path d="M296 225 L288 215 V235 Z" fill="url(#ornate-gold)" />

                <rect x="0" y="210" width="8" height="30" fill="url(#ornate-gold)" stroke="none" transform="translate(0, 0)" opacity="0.4" />
                <rect x="292" y="210" width="8" height="30" fill="url(#ornate-gold)" stroke="none" opacity="0.4" />

            </svg>
        </div>
    );
}

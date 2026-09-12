"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StarBorderProps {
    className?: string;
    variant?: "gold" | "purple" | "cyan";
    showStar?: boolean;
}

export default function StarBorder({
    className,
    variant = "gold",
    showStar = true
}: StarBorderProps) {
    const colorClasses = {
        gold: {
            line: "from-transparent via-amber-400/40 to-transparent",
            star: "text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]",
            glow: "bg-amber-400/20"
        },
        purple: {
            line: "from-transparent via-purple-500/40 to-transparent",
            star: "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]",
            glow: "bg-purple-500/20"
        },
        cyan: {
            line: "from-transparent via-cyan-400/40 to-transparent",
            star: "text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]",
            glow: "bg-cyan-400/20"
        }
    }[variant];

    return (
        <div className={cn("relative flex items-center justify-center w-full my-4", className)}>
            {/* Left gradient line */}
            <div className={cn("flex-1 h-[1px] bg-gradient-to-r", colorClasses.line)} />

            {/* Central Celestial Star Ornament */}
            {showStar && (
                <div className="relative mx-3 flex items-center justify-center">
                    <div className={cn("absolute w-6 h-6 rounded-full blur-sm", colorClasses.glow)} />
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className={cn("w-4 h-4 relative z-10 transition-transform duration-700 hover:rotate-90", colorClasses.star)}
                    >
                        {/* 4-point celestial star with soft rays */}
                        <path d="M12 0L14.2 8.8L23 11L14.2 13.2L12 22L9.8 13.2L1 11L9.8 8.8L12 0Z" />
                        <circle cx="12" cy="11" r="1.5" fill="#ffffff" />
                    </svg>
                </div>
            )}

            {/* Right gradient line */}
            <div className={cn("flex-1 h-[1px] bg-gradient-to-l", colorClasses.line)} />
        </div>
    );
}

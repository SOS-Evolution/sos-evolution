"use client";



interface GlowingBorderCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

export default function GlowingBorderCard({
    children,
    className = "",
    glowColor = "purple",
}: GlowingBorderCardProps) {
    const glowColors: Record<string, string> = {
        purple: "from-purple-500 via-indigo-500 to-purple-500",
        cyan: "from-cyan-500 via-teal-500 to-cyan-500",
        gold: "from-amber-500 via-yellow-400 to-amber-500",
    };

    return (
        <div className={`relative group ${className}`}>
            {/* Animated gradient border */}
            <div
                className={`absolute -inset-[1px] bg-gradient-to-r ${glowColors[glowColor]} rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-shift`}
            />
            <div
                className={`absolute -inset-[1px] bg-gradient-to-r ${glowColors[glowColor]} rounded-2xl opacity-20 group-hover:opacity-40 transition-all duration-500`}
            />
            {/* Content */}
            <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                {children}
            </div>
        </div>
    );
}

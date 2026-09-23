"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { LifePathDetails } from "@/lib/soul-math";
import { useTranslations } from "next-intl";
import NumerologyGlyph, { getNumberMetadata } from "./NumerologyGlyph";

interface NumerologyCardProps {
    title: string;
    details: LifePathDetails;
    icon: LucideIcon;
    delay?: number;
    color?: "purple" | "indigo" | "cyan" | "violet" | "amber" | "emerald";
    subtitle?: string;
}

const colorMap = {
    purple: "from-purple-500/15 via-purple-950/25 to-black/60 border-purple-500/30 text-purple-200",
    indigo: "from-indigo-500/15 via-indigo-950/25 to-black/60 border-indigo-500/30 text-indigo-200",
    cyan: "from-cyan-500/15 via-cyan-950/25 to-black/60 border-cyan-500/30 text-cyan-200",
    violet: "from-violet-500/15 via-violet-950/25 to-black/60 border-violet-500/30 text-violet-200",
    amber: "from-amber-500/15 via-amber-950/25 to-black/60 border-amber-500/30 text-amber-200",
    emerald: "from-emerald-500/15 via-emerald-950/25 to-black/60 border-emerald-500/30 text-emerald-200"
};

const glowMap = {
    purple: "hover:shadow-purple-500/20 hover:border-purple-400/50",
    indigo: "hover:shadow-indigo-500/20 hover:border-indigo-400/50",
    cyan: "hover:shadow-cyan-500/20 hover:border-cyan-400/50",
    violet: "hover:shadow-violet-500/20 hover:border-violet-400/50",
    amber: "hover:shadow-amber-500/20 hover:border-amber-400/50",
    emerald: "hover:shadow-emerald-500/20 hover:border-emerald-400/50"
};

export default function NumerologyCard({
    title,
    details,
    icon: Icon,
    delay = 0,
    color = "purple",
    subtitle
}: NumerologyCardProps) {
    const t = useTranslations("NumerologyPage");
    const meta = getNumberMetadata(details.number);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`group relative rounded-3xl overflow-hidden border p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 shadow-xl ${colorMap[color]} ${glowMap[color]} hover:scale-[1.02] flex flex-col justify-between`}
        >
            {/* Ambient Background Glow */}
            <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ backgroundColor: meta.color }}
            />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white shadow-inner">
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">
                                {title}
                            </span>
                            {subtitle && (
                                <span className="text-[10px] text-slate-500 font-medium">
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    </div>

                    <NumerologyGlyph number={details.number} size={50} variant="badge" />
                </div>

                {/* Body Details */}
                <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-serif font-bold text-white tracking-wide">
                            {details.title}
                        </h3>
                        {meta.isMaster && (
                            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40">
                                Maestro
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-slate-200 uppercase tracking-wider">
                            {t("essence_label", { word: details.powerWord })}
                        </span>
                        <span className="text-[10px] text-slate-400">
                            {meta.geometry}
                        </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-white/20 pl-2.5 my-2">
                        &quot;{details.quote}&quot;
                    </p>

                    <p className="text-xs text-slate-400 border-t border-white/5 pt-2.5 leading-relaxed">
                        {details.essence}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { LifePathDetails } from "@/lib/soul-math";
import { useTranslations } from 'next-intl';

interface NumerologyCardProps {
    title: string;
    details: LifePathDetails;
    icon: LucideIcon;
    delay?: number;
    color?: "purple" | "indigo" | "cyan" | "violet";
}

const colorMap = {
    purple: "from-purple-500/20 to-purple-900/40 border-purple-500/30 text-purple-200",
    indigo: "from-indigo-500/20 to-indigo-900/40 border-indigo-500/30 text-indigo-200",
    cyan: "from-cyan-500/20 to-cyan-900/40 border-cyan-500/30 text-cyan-200",
    violet: "from-violet-500/20 to-violet-900/40 border-violet-500/30 text-violet-200",
};

const glowMap = {
    purple: "group-hover:shadow-purple-500/20",
    indigo: "group-hover:shadow-indigo-500/20",
    cyan: "group-hover:shadow-cyan-500/20",
    violet: "group-hover:shadow-violet-500/20",
};

export default function NumerologyCard({ title, details, icon: Icon, delay = 0, color = "purple" }: NumerologyCardProps) {
    const t = useTranslations('NumerologyPage');
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={`group relative glass rounded-3xl overflow-hidden border p-6 hover:scale-[1.02] transition-all duration-300 shadow-xl ${glowMap[color]}`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-50 z-0`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${color === 'purple' ? 'text-purple-400' : color === 'indigo' ? 'text-indigo-400' : color === 'cyan' ? 'text-cyan-400' : 'text-violet-400'}`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs uppercase tracking-widest text-slate-500 mb-1">{title}</span>
                        <div className="text-4xl font-black font-mono">{details.number}</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white">{details.title}</h3>

                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 border border-white/10 uppercase tracking-tighter`}>
                            {t('essence_label', { word: details.powerWord })}
                        </span>
                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed italic">
                        "{details.quote}"
                    </p>

                    <p className="text-xs text-slate-500 border-t border-white/5 pt-3 leading-snug">
                        {details.essence}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

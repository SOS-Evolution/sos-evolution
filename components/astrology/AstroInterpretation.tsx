"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Shield, Target, Quote, Disc, Compass } from "lucide-react";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { useTranslations } from "next-intl";

interface AstroInterpretationProps {
    data: {
        summary: string;
        core_personality: string;
        strengths: string[];
        challenges: string[];
        evolutionary_advice: string;
    };
    locale?: string;
}

export default function AstroInterpretation({ data, locale = 'es' }: AstroInterpretationProps) {
    const t = useTranslations('AstrologyPage.interpretation');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
        >
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                    <Sparkles className="w-3 h-3" />
                    {t('ai_soul_interpretation')}
                </div>
                <h2 className="text-3xl font-serif text-white">{t('title')}</h2>
            </div>

            {/* Summary Card */}
            <GlowingBorderCard glowColor="purple" className="relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-24 h-24 text-white" />
                </div>
                <div className="p-8 relative z-10">
                    <h3 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {t('summary_title')}
                    </h3>
                    <p className="text-xl font-serif text-slate-100 leading-relaxed italic">
                        "{data.summary}"
                    </p>
                </div>
            </GlowingBorderCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Core Personality */}
                <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-900/40">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-indigo-500" />
                        {t('core_title')}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        {data.core_personality}
                    </p>
                </div>

                {/* Soul Advice */}
                <div className="glass p-6 rounded-3xl border border-white/5 bg-indigo-950/20">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                        {t('advice_title')}
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm">
                        {data.evolutionary_advice}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="space-y-4">
                    <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-xs px-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {t('strengths_title')}
                    </h3>
                    {data.strengths.map((strength, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-100 text-sm"
                        >
                            {strength}
                        </motion.div>
                    ))}
                </div>

                {/* Challenges */}
                <div className="space-y-4">
                    <h3 className="text-orange-400 font-bold uppercase tracking-widest text-xs px-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        {t('challenges_title')}
                    </h3>
                    {data.challenges.map((challenge, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 text-orange-100 text-sm"
                        >
                            {challenge}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

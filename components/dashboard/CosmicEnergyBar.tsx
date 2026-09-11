"use client";

import { Link } from "@/i18n/routing";
import { Sparkles, Flame, Trophy, Coins, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import CardStats from "@/components/dashboard/CardStats";
import type { CardStat } from "@/types";

interface CosmicEnergyBarProps {
    balance: number | null;
    stats: CardStat | null;
}

export default function CosmicEnergyBar({ balance, stats }: CosmicEnergyBarProps) {
    const t = useTranslations("Dashboard.energy");
    const td = useTranslations("Dashboard");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. RESERVA DE AURA */}
            <Link href="/purchase" className="block group h-full">
                <Card className="h-full bg-gradient-to-br from-[#1e1136]/90 via-[#150a26]/90 to-[#0c0517]/95 border border-purple-500/25 hover:border-purple-400/50 p-5 relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.3)] flex flex-col justify-between">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-600/20 transition-colors" />

                    <div>
                        <div className="flex items-center justify-between text-purple-300/90 text-xs font-semibold uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                                {t("aura_title")}
                            </span>
                            <span className="text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded-full border border-purple-500/30">
                                Energía Vital
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                                {balance !== null ? balance : "---"}
                            </span>
                            <span className="text-xs font-semibold text-amber-300 tracking-wide uppercase">
                                Aura
                            </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                            {t("aura_desc")}
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-300 font-semibold group-hover:text-amber-200 transition-colors">
                        <span className="flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5" />
                            {t("recharge_button")}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Card>
            </Link>

            {/* 2. RACHA CÓSMICA */}
            <div className="h-full">
                <Card className="h-full bg-gradient-to-br from-[#24131b]/90 via-[#180d15]/90 to-[#0e060d]/95 border border-rose-500/20 hover:border-rose-500/40 p-5 relative overflow-hidden transition-all duration-300 flex flex-col justify-between group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-rose-500/20 transition-colors" />

                    <div>
                        <div className="flex items-center justify-between text-rose-300/90 text-xs font-semibold uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5">
                                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                {t("streak_title")}
                            </span>
                            <span className="text-[10px] bg-rose-500/20 text-rose-200 px-2 py-0.5 rounded-full border border-rose-500/30">
                                Diario
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(244,63,94,0.3)]">
                                3
                            </span>
                            <span className="text-xs font-semibold text-rose-300 tracking-wide uppercase">
                                Días Seguidos
                            </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                            {t("streak_desc", { days: 3 })}
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-rose-300 font-medium">
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-rose-400" />
                            {t("streak_active")}
                        </span>
                        <span className="text-[10px] text-slate-400">+10 AURA hoy</span>
                    </div>
                </Card>
            </div>

            {/* 3. MISIONES EVOLUTIVAS */}
            <Link href="/missions" className="block group h-full">
                <Card className="h-full bg-gradient-to-br from-[#241c10]/90 via-[#18120a]/90 to-[#0e0a05]/95 border border-amber-500/25 hover:border-amber-400/50 p-5 relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01] group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.25)] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-colors" />

                    <div>
                        <div className="flex items-center justify-between text-amber-300/90 text-xs font-semibold uppercase tracking-wider mb-2">
                            <span className="flex items-center gap-1.5">
                                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                                {t("missions_title")}
                            </span>
                            <span className="text-[10px] bg-yellow-500/20 text-yellow-200 px-2 py-0.5 rounded-full border border-yellow-500/30">
                                Recompensas
                            </span>
                        </div>

                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                                {td("missions")}
                            </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                            {t("missions_desc")}
                        </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-amber-300 font-semibold group-hover:text-amber-200 transition-colors">
                        <span className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            {t("missions_cta")}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Card>
            </Link>

            {/* 4. AFINIDAD ARCANA / ARCANO GUARDIÁN */}
            <div className="h-full">
                <CardStats stats={stats} className="h-full min-h-[160px]" />
            </div>
        </div>
    );
}

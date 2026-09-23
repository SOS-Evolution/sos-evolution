"use client";

import { useMemo } from "react";
import { Sparkles, Moon, Sun, Edit3, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { getZodiacSign, reduceNumber } from "@/lib/soul-math";
import type { Profile } from "@/types";
import ZodiacIcon from "@/components/astrology/ZodiacIcon";

interface CelestialHeroProps {
    profile: Profile | null;
    fullName?: string;
    onEditProfile?: () => void;
    onQuickOracle?: () => void;
}

export default function CelestialHero({
    profile,
    fullName,
    onEditProfile,
    onQuickOracle
}: CelestialHeroProps) {
    const t = useTranslations("Dashboard.hero");
    const tz = useTranslations("Zodiac");
    const tn = useTranslations("Numerology");

    // Dynamic current day calculations
    const todayData = useMemo(() => {
        const now = new Date();
        const d = now.getDate();
        const m = now.getMonth() + 1;
        const y = now.getFullYear();

        const currentSeason = getZodiacSign(d, m);
        const dayVibration = reduceNumber(d + m + y);

        return {
            season: currentSeason,
            vibration: dayVibration,
            dateStr: now.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric"
            })
        };
    }, []);

    // User's natal coordinates
    let userZodiac = "---";
    let lifePathNum = 0;
    let lifePathWord = "---";

    if (profile?.birth_date) {
        const [, m, d] = profile.birth_date.split("-").map(Number);
        userZodiac = getZodiacSign(d, m);

        // Life Path
        const [year, month, day] = profile.birth_date.split("-").map(Number);
        lifePathNum = reduceNumber(
            reduceNumber(day) + reduceNumber(month) + reduceNumber(year)
        );
        if (lifePathNum > 0) {
            try {
                lifePathWord = tn(`${lifePathNum}.powerWord`);
            } catch {
                lifePathWord = `Camino ${lifePathNum}`;
            }
        }
    }

    const displayName =
        fullName ||
        profile?.full_name ||
        t("cosmic_seeker");

    const isProfileComplete = Boolean(
        profile?.birth_date && profile?.birth_place && profile?.gender
    );

    return (
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#1b102e]/90 via-[#130b22]/95 to-[#0b0514]/90 p-6 md:p-8 backdrop-blur-2xl shadow-[0_15px_40px_-15px_rgba(147,51,234,0.25)] group">
            {/* Background Ornaments */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl pointer-events-none group-hover:bg-purple-600/15 transition-all duration-700" />
            <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none group-hover:bg-amber-500/15 transition-all duration-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06),transparent_70%)] pointer-events-none" />

            {/* Constellation filigree border overlay */}
            <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
                {/* TOP ROW: Live Celestial Transit Ticker */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 text-xs">
                    <div className="flex items-center gap-2 text-amber-300/90 font-medium tracking-wide">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        <Sun className="w-3.5 h-3.5 text-amber-400 ml-1" />
                        <span>
                            {t("ticker_season", { sign: tz(todayData.season) })}
                        </span>
                        <span className="text-white/20">•</span>
                        <Moon className="w-3.5 h-3.5 text-purple-300" />
                        <span className="text-purple-200">
                            {t("ticker_transit")}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-slate-400 capitalize">
                            {todayData.dateStr}
                        </span>
                    </div>

                    {/* Profile Quick Toggle */}
                    {onEditProfile && (
                        <button
                            onClick={onEditProfile}
                            className="flex items-center gap-1.5 text-xs text-purple-300/80 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-purple-500/20"
                        >
                            <Edit3 className="w-3 h-3 text-amber-400" />
                            <span>
                                {isProfileComplete ? t("edit_profile") : t("complete_profile")}
                            </span>
                        </button>
                    )}
                </div>

                {/* MIDDLE ROW: Main Welcome & Identity Badges */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 border border-amber-400/20 text-[11px] font-semibold tracking-widest uppercase text-amber-300">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>{t("subtitle")}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-wide leading-tight drop-shadow-[0_2px_15px_rgba(217,119,6,0.2)]">
                            {t("greeting", { name: displayName })}
                        </h1>

                        {/* Power Badges / Natal Archetype Tokens */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            {userZodiac !== "---" && (
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-purple-200 shadow-sm hover:border-purple-400/50 transition-colors">
                                    <ZodiacIcon name={userZodiac} size={16} />
                                    <span className="font-semibold text-white">
                                        {tz(userZodiac)}
                                    </span>
                                </div>
                            )}

                            {lifePathNum > 0 && (
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-950/70 to-slate-950/80 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-200 shadow-sm hover:border-amber-400/50 transition-colors">
                                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-serif text-[10px] font-bold border border-amber-500/40">
                                        {lifePathNum}
                                    </span>
                                    <span>
                                        <strong className="text-white mr-1">
                                            Camino {lifePathNum}
                                        </strong>
                                        <span className="text-amber-300/80">
                                            ({lifePathWord})
                                        </span>
                                    </span>
                                </div>
                            )}

                            <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Coordenadas Sincronizadas</span>
                            </div>
                        </div>
                    </div>

                    {/* ACTION CTA: Quick Daily Divination */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:self-center">
                        <Link href={{ pathname: "/tarot", query: { mode: "daily" } }} className="w-full sm:w-auto">
                            <Button
                                onClick={onQuickOracle}
                                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 font-bold px-6 py-6 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] group flex items-center justify-center gap-3 text-sm tracking-wide uppercase border border-amber-200/50"
                            >
                                <Sparkles className="w-4 h-4 text-amber-950 group-hover:rotate-12 transition-transform" />
                                <span>{t("daily_advice_cta")}</span>
                                <ArrowRight className="w-4 h-4 text-amber-950 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

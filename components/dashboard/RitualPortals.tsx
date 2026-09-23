"use client";

import { Link } from "@/i18n/routing";
import {
    Sparkles,
    Layers,
    Compass,
    Hash,
    BookOpen,
    ArrowRight,
    Lock,
    Wand2,
    Star,
    Moon,
    HelpCircle,
    ChevronRight,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { useTranslations } from "next-intl";
import ZodiacIcon, { getZodiacMetadata } from "@/components/astrology/ZodiacIcon";

const ALL_ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

interface RitualPortalsProps {
    unlockedFeatures: string[];
    readingCosts: Record<string, number>;
    onUnlockClick: (feature: string) => void;
    onSelectSpread?: (mode: "daily" | "classic" | "cross" | "question") => void;
    userZodiac?: string;
    lifePathNum?: number;
}

export default function RitualPortals({
    unlockedFeatures,
    readingCosts,
    onUnlockClick,
    onSelectSpread,
    userZodiac = "---",
    lifePathNum = 0
}: RitualPortalsProps) {
    const t = useTranslations("Dashboard.rituals");
    const tz = useTranslations("Zodiac");

    const isAstrologyUnlocked = unlockedFeatures.includes("astrology");
    const isNumerologyUnlocked = unlockedFeatures.includes("numerology");

    const tarotSpreads = [
        {
            id: "daily",
            mode: "daily" as const,
            title: t("spread_daily_title"),
            description: t("spread_daily_desc"),
            tag: t("spread_daily_tag"),
            cost: readingCosts["daily"] ?? 20,
            icon: Moon,
            accentColor: "from-amber-500/20 to-purple-500/20",
            borderColor: "hover:border-amber-400/50",
            haloColor: "rgba(245, 158, 11, 0.25)",
            badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/30"
        },
        {
            id: "classic",
            mode: "classic" as const,
            title: t("spread_classic_title"),
            description: t("spread_classic_desc"),
            tag: t("spread_classic_tag"),
            cost: readingCosts["classic"] ?? 100,
            icon: Layers,
            accentColor: "from-purple-500/20 to-indigo-500/20",
            borderColor: "hover:border-purple-400/50",
            haloColor: "rgba(168, 85, 247, 0.25)",
            badgeBg: "bg-purple-500/20 text-purple-200 border-purple-400/30"
        },
        {
            id: "cross",
            mode: "cross" as const,
            title: t("spread_cross_title"),
            description: t("spread_cross_desc"),
            tag: t("spread_cross_tag"),
            cost: readingCosts["cross"] ?? 150,
            icon: Star,
            accentColor: "from-rose-500/20 to-purple-500/20",
            borderColor: "hover:border-rose-400/50",
            haloColor: "rgba(244, 63, 94, 0.25)",
            badgeBg: "bg-rose-500/20 text-rose-300 border-rose-400/30"
        },
        {
            id: "question",
            mode: "question" as const,
            title: t("spread_oracle_title"),
            description: t("spread_oracle_desc"),
            tag: t("spread_oracle_tag"),
            cost: readingCosts["general"] ?? 20,
            icon: HelpCircle,
            accentColor: "from-cyan-500/20 to-blue-500/20",
            borderColor: "hover:border-cyan-400/50",
            haloColor: "rgba(6, 182, 212, 0.25)",
            badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30"
        }
    ];

    return (
        <div className="space-y-10">
            {/* ============================================================ */}
            {/* SECCIÓN 1: EL ORÁCULO DEL TAROT SAGRADO (ESTÉTICA TAROTOO) */}
            {/* ============================================================ */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{t("tarot_title")}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                            {t("tarot_subtitle")}
                        </h2>
                    </div>
                    <Link
                        href="/tarot"
                        className="text-xs font-semibold text-purple-300 hover:text-white flex items-center gap-1 group transition-colors self-start sm:self-auto"
                    >
                        <span>Ver todas las tiradas</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Grid de 4 Tiradas Rituales Interactivas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {tarotSpreads.map((spread) => {
                        const Icon = spread.icon;
                        return (
                            <Link
                                key={spread.id}
                                href={{ pathname: "/tarot", query: { mode: spread.mode } }}
                                onClick={() => onSelectSpread?.(spread.mode)}
                                className="block group h-full"
                            >
                                <div
                                    className={`relative h-full rounded-2xl border border-white/10 bg-gradient-to-b from-[#190e2b]/95 to-[#0e0719]/95 p-6 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_15px_35px_-10px_rgba(217,119,6,0.3)] ${spread.borderColor} flex flex-col justify-between overflow-hidden`}
                                >
                                    {/* Ambient Glow on Hover */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all duration-500" />

                                    {/* Top: Tag + Aura Cost */}
                                    <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
                                        <span
                                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${spread.badgeBg}`}
                                        >
                                            {spread.tag}
                                        </span>
                                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                            <Sparkles className="w-3 h-3 text-yellow-400" />
                                            <span>{spread.cost}</span>
                                        </div>
                                    </div>

                                    {/* Center: Icon + Title + Description */}
                                    <div className="relative z-10 space-y-2 flex-grow">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-amber-300 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-200 transition-colors pt-2">
                                            {spread.title}
                                        </h3>

                                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                            {spread.description}
                                        </p>
                                    </div>

                                    {/* Bottom: Action Trigger */}
                                    <div className="relative z-10 mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-purple-300 group-hover:text-amber-300 transition-colors">
                                        <span>Consultar Ahora</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ============================================================ */}
            {/* SECCIÓN 2: ASTROLOGÍA & NUMEROLOGÍA (BÓVEDA CELESTE) */}
            {/* ============================================================ */}
            <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Sincronicidad Arquetípica</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                        Bóveda Astrológica & Matriz Numerológica
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* BÓVEDA ASTROLÓGICA */}
                    <GlowingBorderCard
                        className="h-full"
                        glowColor={isAstrologyUnlocked ? "purple" : "purple"}
                    >
                        <div className="p-6 md:p-8 flex flex-col justify-between h-full min-h-[300px] relative overflow-hidden group">
                            {/* Ambient background celestial nebula */}
                            <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-purple-600/10 blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition-all duration-700" />
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />

                            <div className="relative z-10">
                                {/* Header Info */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {userZodiac !== "---" ? (
                                            <ZodiacIcon
                                                name={userZodiac}
                                                variant="badge"
                                                size={24}
                                                className="shadow-lg shadow-purple-900/40"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-purple-900/40">
                                                <Compass className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xl font-serif font-bold text-white tracking-wide">
                                                    {t("astrology_title")}
                                                </h3>
                                                {userZodiac !== "---" && (
                                                    <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                                        {getZodiacMetadata(userZodiac).elementNameEs}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-purple-300/80 mt-0.5">
                                                {userZodiac !== "---"
                                                    ? `Signo Solar en ${tz(userZodiac)} • Mapa de Nacimiento`
                                                    : t("astrology_subtitle")}
                                            </p>
                                        </div>
                                    </div>

                                    {isAstrologyUnlocked ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-medium">
                                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                                            Por Desvelar
                                        </span>
                                    )}
                                </div>

                                {/* Zodiac Signs Orbit Strip */}
                                <div className="my-4 py-2 px-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm">
                                    <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
                                        {ALL_ZODIAC_SIGNS.map((sign) => {
                                            const isUserSign = userZodiac !== "---" && (userZodiac.toLowerCase() === sign.toLowerCase() || tz(userZodiac).toLowerCase() === sign.toLowerCase());
                                            return (
                                                <div
                                                    key={sign}
                                                    title={`${tz(sign)} (${getZodiacMetadata(sign).elementNameEs})`}
                                                    className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 cursor-pointer ${
                                                        isUserSign
                                                            ? "bg-purple-600/30 border border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.35)] scale-110"
                                                            : "hover:bg-white/10 opacity-70 hover:opacity-100 hover:scale-105"
                                                    }`}
                                                >
                                                    <ZodiacIcon name={sign} size={16} />
                                                    {isUserSign && (
                                                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                                    {t("astrology_chart_desc")}
                                </p>

                                {/* Badges de Módulos Astrológicos */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] mb-6">
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                        <div className="text-indigo-400 font-serif text-sm mb-0.5">☸</div>
                                        <span className="block font-bold text-white">Carta Natal</span>
                                        <span className="text-slate-400 text-[10px]">Rueda 360°</span>
                                    </div>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                        <div className="text-amber-400 font-serif text-sm mb-0.5">☉</div>
                                        <span className="block font-bold text-white">Planetas</span>
                                        <span className="text-slate-400 text-[10px]">10+ Cuerpos</span>
                                    </div>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                        <div className="text-emerald-400 font-serif text-sm mb-0.5">🏛️</div>
                                        <span className="block font-bold text-white">12 Casas</span>
                                        <span className="text-slate-400 text-[10px]">Cúspides</span>
                                    </div>
                                    <div className="bg-white/5 hover:bg-white/10 transition-colors p-2.5 rounded-xl border border-white/5 flex flex-col items-center justify-center">
                                        <div className="text-purple-400 font-serif text-sm mb-0.5">☌</div>
                                        <span className="block font-bold text-white">Aspectos</span>
                                        <span className="text-slate-400 text-[10px]">Geometría</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Entrada o Desbloqueo */}
                            <div className="pt-2 relative z-10">
                                {isAstrologyUnlocked ? (
                                    <Link href="/astrology" className="block w-full">
                                        <Button className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-purple-900/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 group">
                                            <span>Explorar Bóveda Astrológica</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        onClick={() => onUnlockClick("astrology")}
                                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 font-bold py-5 rounded-xl shadow-lg shadow-amber-900/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                                    >
                                        <Wand2 className="w-4 h-4" />
                                        <span>Desvelar Bóveda ({readingCosts["unlock_astrology"] ?? 50} AURA)</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </GlowingBorderCard>

                    {/* MATRIZ NUMEROLÓGICA */}
                    <GlowingBorderCard
                        className="h-full"
                        glowColor={isNumerologyUnlocked ? "gold" : "cyan"}
                    >
                        <div className="p-6 md:p-8 flex flex-col justify-between h-full min-h-[260px] relative">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-900/40">
                                            <Hash className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-white">
                                                {t("numerology_title")}
                                            </h3>
                                            <p className="text-xs text-amber-300/80">
                                                {lifePathNum > 0
                                                    ? `Camino de Vida ${lifePathNum}`
                                                    : t("numerology_subtitle")}
                                            </p>
                                        </div>
                                    </div>

                                    {isNumerologyUnlocked ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-medium">
                                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                                            Por Desvelar
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                    {t("numerology_lifepath_desc")}
                                </p>

                                {/* Badges de Números Sagrados */}
                                <div className="grid grid-cols-3 gap-2 text-center text-[11px] mb-6">
                                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                        <span className="block font-bold text-white">Camino Vida</span>
                                        <span className="text-amber-300 text-xs font-serif font-bold">
                                            {lifePathNum > 0 ? lifePathNum : "—"}
                                        </span>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                        <span className="block font-bold text-white">Deseo Alma</span>
                                        <span className="text-slate-400 text-[10px]">Vocales</span>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                                        <span className="block font-bold text-white">Año Personal</span>
                                        <span className="text-slate-400 text-[10px]">Ciclo 2026</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Entrada o Desbloqueo */}
                            <div className="pt-2">
                                {isNumerologyUnlocked ? (
                                    <Link href="/numerology" className="block w-full">
                                        <Button className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold py-5 rounded-xl shadow-lg shadow-amber-900/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2">
                                            <span>Consultar Matriz Numérica</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        onClick={() => onUnlockClick("numerology")}
                                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 font-bold py-5 rounded-xl shadow-lg shadow-amber-900/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                                    >
                                        <Wand2 className="w-4 h-4" />
                                        <span>Desvelar Matriz ({readingCosts["unlock_numerology"] ?? 50} AURA)</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </GlowingBorderCard>
                </div>
            </div>

            {/* ============================================================ */}
            {/* SECCIÓN 3: DIARIO DEL ALMA & REGISTRO AKÁSHICO */}
            {/* ============================================================ */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#170e28]/80 via-[#10091d]/90 to-[#170e28]/80 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-950 to-purple-900 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-xl group-hover:scale-105 transition-transform">
                        <BookOpen className="w-8 h-8 text-amber-300" />
                    </div>
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400 font-semibold">
                            <Sparkles className="w-3 h-3" />
                            <span>{t("journal_title")}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                            {t("journal_subtitle")}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                            {t("journal_desc")}
                        </p>
                    </div>
                </div>

                <Link href="/historial" className="w-full md:w-auto shrink-0">
                    <Button className="w-full md:w-auto bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-6 py-6 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                        <span>{t("journal_button")}</span>
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

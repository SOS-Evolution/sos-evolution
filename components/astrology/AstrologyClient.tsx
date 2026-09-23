"use client";

import { useState, useEffect, useMemo } from "react";
import AnimatedSection from "@/components/landing/AnimatedSection";
import {
    ArrowLeft,
    Star,
    Disc,
    MapPin,
    Calendar,
    Compass,
    Sparkles,
    Wand2,
    Loader2,
    Layers,
    BookOpen
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { WesternChartData, Aspect } from "@/lib/astrology-api";
import AstrologyWheel from "@/components/astrology/AstrologyWheel";
import PlanetIcon from "@/components/astrology/PlanetIcon";
import ZodiacIcon, { getZodiacMetadata } from "@/components/astrology/ZodiacIcon";
import AstroInterpretation from "@/components/astrology/AstroInterpretation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Profile } from "@/types";
import InsufficientAuraModal from "@/components/dashboard/InsufficientAuraModal";
import AuraActionButton from "@/components/ui/AuraActionButton";
import DailyHoroscopeCard from "@/components/astrology/DailyHoroscopeCard";

interface InterpretationData {
    summary: string;
    core_personality: string;
    strengths: string[];
    challenges: string[];
    evolutionary_advice: string;
}

interface AstrologyTranslations {
    title_natal: string;
    chart_title: string;
    location_unknown: string;
    setup_button: string;
    sun: string;
    moon: string;
    asc: string;
    planets_title: string;
    aspects_title: string;
    houses_title: string;
    house_label: string;
    cusp_label: string;
    no_data_title: string;
    no_data_description: string;
    complete_profile_button: string;
    planets: Record<string, string>;
    aspects: Record<string, string>;
}

interface AstrologyClientProps {
    profile: Profile | null;
    initialChartData: WesternChartData | null;
    initialInterpretation: InterpretationData | null;
    t: AstrologyTranslations;
    tz: Record<string, string>;
    locale: string;
}

const HOUSE_DOMAINS = [
    { house: 1, roman: "I", title: "Identidad & Vitalidad", theme: "El Yo / Ascendente" },
    { house: 2, roman: "II", title: "Recursos & Finanzas", theme: "Valor Personal y Sustento" },
    { house: 3, roman: "III", title: "Mente & Comunicación", theme: "Entorno e Intelecto" },
    { house: 4, roman: "IV", title: "Hogar, Raíces & Familia", theme: "Fondo del Cielo / Origen" },
    { house: 5, roman: "V", title: "Creación & Autoexpresión", theme: "Placer, Hijos y Romance" },
    { house: 6, roman: "VI", title: "Salud, Trabajo & Rutina", theme: "Servicio y Bienestar" },
    { house: 7, roman: "VII", title: "Pareja & Alianzas", theme: "El Descendente / Relaciones" },
    { house: 8, roman: "VIII", title: "Transformación & Misterio", theme: "Transmutación y Regeneración" },
    { house: 9, roman: "IX", title: "Filosofía & Sabiduría", theme: "Expansión, Viajes y Fe" },
    { house: 10, roman: "X", title: "Vocación, Estatus & Destino", theme: "Medio Cielo / Éxito Público" },
    { house: 11, roman: "XI", title: "Comunidad, Redes & Sueños", theme: "Amistades e Ideales" },
    { house: 12, roman: "XII", title: "Inconsciente & Trascendencia", theme: "Espiritualidad y Karma" }
];

const ASPECT_DETAILS: Record<string, { symbol: string; harmony: "harmonious" | "dynamic" | "neutral"; color: string; badgeClass: string }> = {
    Conjunction: {
        symbol: "☌",
        harmony: "neutral",
        color: "#a855f7",
        badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/20"
    },
    Opposition: {
        symbol: "☍",
        harmony: "dynamic",
        color: "#ef4444",
        badgeClass: "bg-red-500/10 text-red-300 border-red-500/20"
    },
    Trine: {
        symbol: "△",
        harmony: "harmonious",
        color: "#10b981",
        badgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
    },
    Square: {
        symbol: "□",
        harmony: "dynamic",
        color: "#f59e0b",
        badgeClass: "bg-amber-500/10 text-amber-300 border-amber-500/20"
    },
    Sextile: {
        symbol: "⚹",
        harmony: "harmonious",
        color: "#38bdf8",
        badgeClass: "bg-sky-500/10 text-sky-300 border-sky-500/20"
    }
};

function formatDegree(degree: number): string {
    const deg = Math.floor(degree);
    const min = Math.round((degree - deg) * 60);
    return `${deg}° ${min.toString().padStart(2, "0")}'`;
}

type TabKey = "overview" | "planets" | "houses" | "aspects" | "soul" | "all";

export default function AstrologyClient({
    profile,
    initialChartData,
    initialInterpretation,
    t,
    tz,
    locale
}: AstrologyClientProps) {
    const [interpretation, setInterpretation] = useState<InterpretationData | null>(initialInterpretation);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [auraCost, setAuraCost] = useState<number>(20);
    const [insufficientAuraModalOpen, setInsufficientAuraModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>("overview");
    const [aspectFilter, setAspectFilter] = useState<"all" | "harmonious" | "dynamic" | "conjunction">("all");

    const t_interp = useTranslations("AstrologyPage.interpretation");

    useEffect(() => {
        setInterpretation(initialInterpretation);
    }, [initialInterpretation]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const creditsRes = await fetch("/api/credits");
                if (creditsRes.ok) {
                    const creditsData = await creditsRes.json();
                    setBalance(creditsData.balance ?? 0);
                }

                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: readingTypes } = await supabase
                        .from("reading_types")
                        .select("credit_cost")
                        .eq("code", "astrology_full")
                        .single();

                    if (readingTypes) {
                        setAuraCost(readingTypes.credit_cost);
                    }
                }
            } catch (err) {
                console.error("Error fetching initial data:", err);
            }
        };
        fetchInitialData();
    }, []);

    const handleInterpret = async () => {
        if (!initialChartData) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/astrology/interpret", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chartData: initialChartData, locale })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 402) {
                    setInsufficientAuraModalOpen(true);
                } else {
                    toast.error(data.error || "Error");
                }
                return;
            }

            setInterpretation(data);
            setBalance(data.newBalance);
            toast.success(t_interp("interpretation_generated"));

            setActiveTab("soul");
            setTimeout(() => {
                document.getElementById("astro-interpretation")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } catch (error) {
            console.error(error);
            toast.error(t_interp("error_oracle"));
        } finally {
            setIsLoading(false);
        }
    };

    // Extract The Big Three (Sol, Luna, Ascendente)
    const sunPlanet = initialChartData?.planets.find((p) => p.name === "Sun" || p.name === "Sol");
    const moonPlanet = initialChartData?.planets.find(
        (p) => p.name === "Moon" || p.name === "Luna" || p.name === "moon"
    );
    const ascPlanet = initialChartData?.planets.find(
        (p) => p.name === "Ascendant" || p.name === "Ascendente"
    );

    const sunMeta = sunPlanet ? getZodiacMetadata(sunPlanet.sign) : null;
    const moonMeta = moonPlanet ? getZodiacMetadata(moonPlanet.sign) : null;
    const ascMeta = ascPlanet ? getZodiacMetadata(ascPlanet.sign) : null;

    // Filtered aspects
    const filteredAspects = useMemo(() => {
        if (!initialChartData?.aspects) return [];
        if (aspectFilter === "all") return initialChartData.aspects;
        if (aspectFilter === "conjunction") {
            return initialChartData.aspects.filter((a: Aspect) => a.type === "Conjunction");
        }
        if (aspectFilter === "harmonious") {
            return initialChartData.aspects.filter((a: Aspect) => a.type === "Trine" || a.type === "Sextile");
        }
        if (aspectFilter === "dynamic") {
            return initialChartData.aspects.filter((a: Aspect) => a.type === "Square" || a.type === "Opposition");
        }
        return initialChartData.aspects;
    }, [initialChartData?.aspects, aspectFilter]);

    return (
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
            {/* Header */}
            <AnimatedSection>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button
                                variant="ghost"
                                className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass hover:bg-white/10"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold uppercase tracking-widest text-purple-300">
                                    <Sparkles className="w-3 h-3 text-purple-400" />
                                    {t.title_natal}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                                {t.chart_title.replace("{name}", profile?.full_name || "Ti")}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs sm:text-sm mt-1.5">
                                <span className="flex items-center gap-1 text-slate-300">
                                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                                    {profile?.birth_place || t.location_unknown}
                                </span>
                                <span className="opacity-30">•</span>
                                <span className="flex items-center gap-1 text-slate-300">
                                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                    {profile?.birth_date}{" "}
                                    {profile?.birth_time ? profile.birth_time.split(":").slice(0, 2).join(":") : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {!initialChartData && (
                        <Link href="/dashboard">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                                {t.setup_button}
                            </Button>
                        </Link>
                    )}
                </div>
            </AnimatedSection>

            {initialChartData ? (
                <div className="space-y-10">
                    {/* ============================================================ */}
                    {/* LA GRAN TRÍADA CÓSMICA (THE BIG THREE HERO) */}
                    {/* ============================================================ */}
                    <AnimatedSection delay={0.05}>
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#160e29]/90 via-[#0d071b]/95 to-[#080312]/90 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl">
                            {/* Celestial glows */}
                            <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-amber-400 font-serif text-lg">☉ ☽ ⇡</span>
                                        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-300">
                                            La Gran Tríada Cósmica
                                        </h2>
                                    </div>
                                    <span className="text-[11px] text-slate-400 italic hidden sm:inline">
                                        Pilares de tu identidad astral
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* 1. SOL */}
                                    <div className="relative rounded-2xl p-4 bg-gradient-to-b from-amber-500/10 via-amber-950/20 to-black/40 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-300 group shadow-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-500/40">
                                                    <PlanetIcon name="Sun" size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                                                        {t.sun}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">Esencia Vital</span>
                                                </div>
                                            </div>
                                            {sunMeta && (
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30">
                                                    {sunMeta.elementNameEs}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div>
                                                <div className="text-2xl font-serif font-bold text-white tracking-wide">
                                                    {sunPlanet ? tz[sunPlanet.sign] || sunPlanet.sign : "--"}
                                                </div>
                                                <div className="text-xs text-amber-200/80 font-mono mt-0.5">
                                                    {sunPlanet ? formatDegree(sunPlanet.normDegree) : "--"}
                                                    {sunPlanet?.house && ` • Casa ${sunPlanet.house}`}
                                                </div>
                                            </div>
                                            {sunPlanet && (
                                                <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 group-hover:scale-110 transition-transform">
                                                    <ZodiacIcon name={sunPlanet.sign} size={36} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 2. LUNA */}
                                    <div className="relative rounded-2xl p-4 bg-gradient-to-b from-indigo-500/10 via-indigo-950/20 to-black/40 border border-indigo-500/30 hover:border-indigo-400/60 transition-all duration-300 group shadow-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/40">
                                                    <PlanetIcon name="Moon" size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                                                        {t.moon}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">Mundo Emocional</span>
                                                </div>
                                            </div>
                                            {moonMeta && (
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                                                    {moonMeta.elementNameEs}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div>
                                                <div className="text-2xl font-serif font-bold text-white tracking-wide">
                                                    {moonPlanet ? tz[moonPlanet.sign] || moonPlanet.sign : "--"}
                                                </div>
                                                <div className="text-xs text-indigo-200/80 font-mono mt-0.5">
                                                    {moonPlanet ? formatDegree(moonPlanet.normDegree) : "--"}
                                                    {moonPlanet?.house && ` • Casa ${moonPlanet.house}`}
                                                </div>
                                            </div>
                                            {moonPlanet && (
                                                <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                                                    <ZodiacIcon name={moonPlanet.sign} size={36} />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 3. ASCENDENTE */}
                                    <div className="relative rounded-2xl p-4 bg-gradient-to-b from-purple-500/10 via-purple-950/20 to-black/40 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 group shadow-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/40">
                                                    <PlanetIcon name="Ascendant" size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                                                        {t.asc}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">Camino del Alma</span>
                                                </div>
                                            </div>
                                            {ascMeta && (
                                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30">
                                                    {ascMeta.elementNameEs}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div>
                                                <div className="text-2xl font-serif font-bold text-white tracking-wide">
                                                    {ascPlanet ? tz[ascPlanet.sign] || ascPlanet.sign : "--"}
                                                </div>
                                                <div className="text-xs text-purple-200/80 font-mono mt-0.5">
                                                    {ascPlanet ? formatDegree(ascPlanet.normDegree) : "--"}
                                                    {" • Cúspide Casa I"}
                                                </div>
                                            </div>
                                            {ascPlanet && (
                                                <div className="p-2 rounded-2xl bg-purple-500/10 border border-purple-500/30 group-hover:scale-110 transition-transform">
                                                    <ZodiacIcon name={ascPlanet.sign} size={36} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>

                    {/* ============================================================ */}
                    {/* NAVIGATION TABS BAR */}
                    {/* ============================================================ */}
                    <div className="sticky top-4 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                activeTab === "overview"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Visión General & Rueda</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("planets")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                activeTab === "planets"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Disc className="w-3.5 h-3.5" />
                            <span>Planetas ({initialChartData.planets.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("houses")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                activeTab === "houses"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>12 Casas Astrales</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("aspects")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                activeTab === "aspects"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Aspectos ({initialChartData.aspects?.length || 0})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("soul")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                activeTab === "soul"
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                            <span>Interpretación IA</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("all")}
                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                activeTab === "all"
                                    ? "bg-white/15 text-white"
                                    : "text-slate-500 hover:text-slate-300"
                            }`}
                        >
                            <span>Ver Todo</span>
                        </button>
                    </div>

                    {/* ============================================================ */}
                    {/* TAB 1: VISIÓN GENERAL (RUEDA + HORÓSCOPO + IA ACTION) */}
                    {/* ============================================================ */}
                    {(activeTab === "overview" || activeTab === "all") && (
                        <div className="space-y-8">
                            <AnimatedSection delay={0.1}>
                                <div className="flex flex-col items-center gap-8 py-4">
                                    {/* Daily Horoscope */}
                                    <div className="w-full max-w-2xl">
                                        <DailyHoroscopeCard userSign={sunPlanet?.sign || "Aries"} />
                                    </div>

                                    {/* Wheel */}
                                    <div className="p-4 sm:p-6 rounded-3xl bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col items-center">
                                        <AstrologyWheel
                                            planets={initialChartData.planets}
                                            houses={initialChartData.houses}
                                            size={420}
                                        />
                                    </div>

                                    {!interpretation && (
                                        <div className="text-center space-y-3">
                                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                                Desvela la lectura canalizada de tu mapa con inteligencia cuántica y
                                                arquetipos de evolución.
                                            </p>
                                            <AuraActionButton
                                                onClick={handleInterpret}
                                                loading={isLoading}
                                                cost={auraCost}
                                                label={t_interp("generate_button")}
                                                icon={<Wand2 className="w-5 h-5 text-amber-400" />}
                                            />
                                        </div>
                                    )}
                                </div>
                            </AnimatedSection>
                        </div>
                    )}

                    {/* ============================================================ */}
                    {/* TAB: INTERPRETACIÓN DEL ALMA (IA) */}
                    {/* ============================================================ */}
                    {(activeTab === "soul" || activeTab === "all" || interpretation) && interpretation && (
                        <AnimatedSection delay={0.1}>
                            <div id="astro-interpretation" className="space-y-6">
                                <AstroInterpretation data={interpretation} />
                                <div className="flex justify-center mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={handleInterpret}
                                        disabled={isLoading}
                                        className="text-xs text-slate-300 border-white/10 hover:border-indigo-500/40 glass hover:bg-white/5 py-5 px-6 rounded-xl"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                                        ) : (
                                            <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-400" />
                                        )}
                                        {t_interp("regenerate_button")} ({t_interp("aura_cost_badge", { cost: auraCost })})
                                    </Button>
                                </div>
                            </div>
                        </AnimatedSection>
                    )}

                    {/* ============================================================ */}
                    {/* TAB 2: PLANETAS & POSICIONES */}
                    {/* ============================================================ */}
                    {(activeTab === "planets" || activeTab === "all") && (
                        <AnimatedSection delay={0.15}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
                                        <Disc className="w-5 h-5 text-indigo-400" />
                                        <span>{t.planets_title}</span>
                                    </h2>
                                    <span className="text-xs text-slate-400">
                                        {initialChartData.planets.length} Cuerpos Registrados
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {initialChartData.planets.map((planet, i) => {
                                        const meta = getZodiacMetadata(planet.sign);
                                        return (
                                            <GlowingBorderCard
                                                key={`${planet.name}-${i}`}
                                                glowColor={meta.element === "fire" ? "gold" : meta.element === "earth" ? "cyan" : "purple"}
                                                className="h-full group"
                                            >
                                                <div className="p-4 flex items-center justify-between h-full relative">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="w-13 h-13 rounded-2xl bg-slate-900/80 flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                                                            <PlanetIcon name={planet.name} size={32} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-white text-base">
                                                                    {t.planets[planet.name] || planet.name}
                                                                </span>
                                                                {planet.isRetro && (
                                                                    <span
                                                                        title="Planeta Retrógrado"
                                                                        className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                                    >
                                                                        ℞
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-slate-400 mt-0.5">
                                                                {t.house_label.replace("{number}", planet.house.toString())}
                                                                {" • "}
                                                                <span className="text-slate-500">
                                                                    {HOUSE_DOMAINS.find((h) => h.house === planet.house)?.theme || ""}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex items-center gap-2.5">
                                                        <div>
                                                            <div className="font-serif text-base font-semibold text-slate-100 flex items-center justify-end gap-1">
                                                                <span>{tz[planet.sign] || planet.sign}</span>
                                                            </div>
                                                            <div className="text-xs text-slate-400 font-mono">
                                                                {formatDegree(planet.normDegree ?? 0)}
                                                            </div>
                                                        </div>
                                                        <div className="p-1.5 rounded-xl bg-slate-900/60 border border-white/10 group-hover:scale-110 transition-transform">
                                                            <ZodiacIcon name={planet.sign} size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </GlowingBorderCard>
                                        );
                                    })}
                                </div>
                            </div>
                        </AnimatedSection>
                    )}

                    {/* ============================================================ */}
                    {/* TAB 3: 12 CASAS ASTRALES */}
                    {/* ============================================================ */}
                    {(activeTab === "houses" || activeTab === "all") && (
                        <AnimatedSection delay={0.2}>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
                                        <Compass className="w-5 h-5 text-indigo-400" />
                                        <span>{t.houses_title}</span>
                                    </h2>
                                    <span className="text-xs text-slate-400">
                                        Cúspides & Dominios de Destino
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                                    {initialChartData.houses.map((house) => {
                                        const houseInfo = HOUSE_DOMAINS.find((h) => h.house === house.house);
                                        const meta = getZodiacMetadata(house.sign);

                                        return (
                                            <GlowingBorderCard
                                                key={house.house}
                                                glowColor={meta.element === "fire" ? "gold" : meta.element === "water" ? "purple" : "cyan"}
                                                className="h-full group"
                                            >
                                                <div className="p-3.5 flex flex-col items-center text-center space-y-2.5">
                                                    <div className="flex items-center justify-between w-full text-[10px] text-slate-400 border-b border-white/5 pb-1.5 font-mono">
                                                        <span className="font-bold text-indigo-400">{houseInfo?.roman}</span>
                                                        <span>Casa {house.house}</span>
                                                    </div>

                                                    <div className="relative my-1">
                                                        <div
                                                            className="absolute inset-0 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ backgroundColor: meta.glowColor }}
                                                        />
                                                        <ZodiacIcon
                                                            name={house.sign}
                                                            size={32}
                                                            className="relative z-10 transition-transform group-hover:scale-110"
                                                        />
                                                    </div>

                                                    <div>
                                                        <div className="font-serif text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                                                            {tz[house.sign] || house.sign}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                            {t.cusp_label.replace("{degree}", house.fullDegree.toFixed(1))}
                                                        </div>
                                                    </div>

                                                    <div className="w-full pt-1.5 border-t border-white/5">
                                                        <span className="text-[10px] text-slate-300 font-medium line-clamp-1">
                                                            {houseInfo?.title.split("&")[0] || ""}
                                                        </span>
                                                        <span className="text-[9px] text-slate-500 line-clamp-1">
                                                            {houseInfo?.theme}
                                                        </span>
                                                    </div>
                                                </div>
                                            </GlowingBorderCard>
                                        );
                                    })}
                                </div>
                            </div>
                        </AnimatedSection>
                    )}

                    {/* ============================================================ */}
                    {/* TAB 4: ASPECTOS PLANETARIOS */}
                    {/* ============================================================ */}
                    {(activeTab === "aspects" || activeTab === "all") && (
                        <AnimatedSection delay={0.25}>
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2.5">
                                            <Sparkles className="w-5 h-5 text-indigo-400" />
                                            <span>{t.aspects_title}</span>
                                        </h2>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Geometría sagrada entre planetas y sus orbes de resonancia.
                                        </p>
                                    </div>

                                    {/* Aspect Filter Pills */}
                                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-white/10 self-start">
                                        <button
                                            onClick={() => setAspectFilter("all")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                aspectFilter === "all" ? "bg-white/15 text-white" : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            Todos
                                        </button>
                                        <button
                                            onClick={() => setAspectFilter("harmonious")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                                aspectFilter === "harmonious"
                                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <span>△ Armónicos</span>
                                        </button>
                                        <button
                                            onClick={() => setAspectFilter("dynamic")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                                aspectFilter === "dynamic"
                                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <span>□ Dinámicos</span>
                                        </button>
                                        <button
                                            onClick={() => setAspectFilter("conjunction")}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                                                aspectFilter === "conjunction"
                                                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                    : "text-slate-400 hover:text-white"
                                            }`}
                                        >
                                            <span>☌ Conjunciones</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {filteredAspects.map((aspect: Aspect, i: number) => {
                                        const details = ASPECT_DETAILS[aspect.type] || {
                                            symbol: "✦",
                                            harmony: "neutral",
                                            color: "#a855f7",
                                            badgeClass: "bg-purple-500/10 text-purple-300 border-purple-500/20"
                                        };

                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-900/80 transition-all group shadow-sm"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                                                            <PlanetIcon name={aspect.planet1} size={16} />
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-200">
                                                            {t.planets[aspect.planet1] || aspect.planet1}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                                                        style={{
                                                            color: details.color,
                                                            backgroundColor: `${details.color}15`,
                                                            border: `1px solid ${details.color}35`
                                                        }}
                                                        title={t.aspects[aspect.type] || aspect.type}
                                                    >
                                                        {details.symbol}
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                                                            <PlanetIcon name={aspect.planet2} size={16} />
                                                        </div>
                                                        <span className="text-xs font-semibold text-slate-200">
                                                            {t.planets[aspect.planet2] || aspect.planet2}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right">
                                                    <div
                                                        className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${details.badgeClass}`}
                                                    >
                                                        {t.aspects[aspect.type] || aspect.type}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500 font-mono mt-1">
                                                        {aspect.orb.toFixed(2)}° orb
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </AnimatedSection>
                    )}
                </div>
            ) : (
                <AnimatedSection delay={0.1}>
                    <div className="glass p-12 text-center rounded-3xl border border-dashed border-slate-700 max-w-xl mx-auto">
                        <Star className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif text-slate-200 mb-2">{t.no_data_title}</h2>
                        <p className="text-slate-400 mb-6">{t.no_data_description}</p>
                        <Link href="/dashboard/profile">
                            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl">
                                {t.complete_profile_button}
                            </Button>
                        </Link>
                    </div>
                </AnimatedSection>
            )}

            <InsufficientAuraModal
                isOpen={insufficientAuraModalOpen}
                onClose={() => setInsufficientAuraModalOpen(false)}
                requiredAmount={auraCost}
                currentBalance={balance || 0}
            />
        </main>
    );
}

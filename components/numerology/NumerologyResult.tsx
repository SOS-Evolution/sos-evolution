"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import {
    getLifePathNumber,
    getExpressionNumber,
    getSoulUrgeNumber,
    getPersonalityNumber,
    getPersonalYearNumber,
    getPythagoreanLetterMap,
    PythagoreanLetterItem
} from "@/lib/soul-math";
import NumerologyCard from "./NumerologyCard";
import NumerologyGlyph, { getNumberMetadata } from "./NumerologyGlyph";
import {
    User,
    Calendar,
    Sparkles,
    Heart,
    Shield,
    Map,
    Search,
    BrainCircuit,
    Hash,
    Layers,
    Clock,
    BookOpen,
    RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedSection from "../landing/AnimatedSection";
import { useTranslations } from "next-intl";

interface NumerologyNumbers {
    number: number;
    title: string;
    powerWord: string;
    essence: string;
    quote: string;
}

interface NumerologyResultData {
    lifePath: NumerologyNumbers;
    expression: NumerologyNumbers;
    soulUrge: NumerologyNumbers;
    personality: NumerologyNumbers;
    personalYear: NumerologyNumbers;
    letterMap: {
        words: { word: string; letters: PythagoreanLetterItem[] }[];
        vowelsSum: number;
        consonantsSum: number;
        totalSum: number;
    };
    currentYear: number;
}

interface NumerologyResultProps {
    initialProfile?: {
        full_name: string | null;
        birth_date: string | null;
    } | null;
}

const PYTHAGOREAN_TABLE = [
    { value: 1, letters: ["A", "J", "S"] },
    { value: 2, letters: ["B", "K", "T"] },
    { value: 3, letters: ["C", "L", "U"] },
    { value: 4, letters: ["D", "M", "V"] },
    { value: 5, letters: ["E", "N", "W", "Ñ"] },
    { value: 6, letters: ["F", "O", "X"] },
    { value: 7, letters: ["G", "P", "Y"] },
    { value: 8, letters: ["H", "Q", "Z"] },
    { value: 9, letters: ["I", "R"] }
];

type NumerologyTab = "matrix" | "breakdown" | "year" | "synthesis";

export default function NumerologyResult({ initialProfile }: NumerologyResultProps) {
    const t = useTranslations("NumerologyPage");
    const tn = useTranslations("Numerology");
    const [name, setName] = useState(initialProfile?.full_name || "");
    const [birthDate, setBirthDate] = useState(initialProfile?.birth_date || "");
    const [results, setResults] = useState<NumerologyResultData | null>(null);
    const [isLoading, setIsLoading] = useState(!initialProfile);
    const [activeTab, setActiveTab] = useState<NumerologyTab>("matrix");
    const [isRecalculating, setIsRecalculating] = useState(false);

    const calculateResults = useCallback(
        (n: string, d: string) => {
            if (!n || !d) return;

            const lpNum = getLifePathNumber(d);
            const exNum = getExpressionNumber(n);
            const suNum = getSoulUrgeNumber(n);
            const peNum = getPersonalityNumber(n);
            const currentYear = new Date().getFullYear();
            const pyNum = getPersonalYearNumber(d, currentYear);
            const lMap = getPythagoreanLetterMap(n);

            // Helper to get localized details
            const getLocalizedDetails = (num: number): NumerologyNumbers => {
                try {
                    return {
                        number: num,
                        title: tn(`${num}.title`),
                        powerWord: tn(`${num}.powerWord`),
                        essence: tn(`${num}.essence`),
                        quote: tn(`${num}.quote`)
                    };
                } catch {
                    return {
                        number: num,
                        title: `Frecuencia ${num}`,
                        powerWord: "VIBRACIÓN",
                        essence: "Energía arquetípica en evolución.",
                        quote: "La matemática sagrada del universo."
                    };
                }
            };

            setResults({
                lifePath: getLocalizedDetails(lpNum),
                expression: getLocalizedDetails(exNum),
                soulUrge: getLocalizedDetails(suNum),
                personality: getLocalizedDetails(peNum),
                personalYear: getLocalizedDetails(pyNum),
                letterMap: lMap,
                currentYear
            });
            setIsRecalculating(false);
        },
        [tn]
    );

    useEffect(() => {
        if (initialProfile?.full_name && initialProfile?.birth_date) {
            calculateResults(initialProfile.full_name, initialProfile.birth_date);
            setIsLoading(false);
            return;
        }

        async function loadProfile() {
            const {
                data: { user }
            } = await supabase.auth.getUser();
            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("full_name, birth_date")
                    .eq("id", user.id)
                    .single();

                if (profile) {
                    if (profile.full_name) setName(profile.full_name);
                    if (profile.birth_date) setBirthDate(profile.birth_date);

                    if (profile.full_name && profile.birth_date) {
                        calculateResults(profile.full_name, profile.birth_date);
                    }
                }
            }
            setIsLoading(false);
        }
        loadProfile();
    }, [initialProfile, calculateResults]);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        calculateResults(name, birthDate);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Input Form Modal/Section when no results or when recalculating */}
            {(!results || isRecalculating) && (
                <AnimatedSection>
                    <div className="rounded-[2.5rem] border border-amber-500/30 bg-gradient-to-br from-[#1c122b]/95 via-[#120a1f]/95 to-[#0a0512]/95 p-6 md:p-12 max-w-2xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-2xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 blur-3xl rounded-full -ml-20 -mb-20 pointer-events-none" />

                        <div className="text-center mb-8 relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-900/30">
                                <BrainCircuit className="w-7 h-7" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                                {t("input_title")}
                            </h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto">{t("input_desc")}</p>
                        </div>

                        <form onSubmit={handleCalculate} className="space-y-5 relative z-10">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold ml-1">
                                    {t("fullname_label")}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t("fullname_placeholder")}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold ml-1">
                                    {t("birthdate_label")}
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm"
                                        style={{ colorScheme: "dark" }}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                {results && isRecalculating && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsRecalculating(false)}
                                        className="w-1/3 border-white/10 text-slate-300 hover:bg-white/5 h-14 rounded-2xl"
                                    >
                                        Cancelar
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-slate-950 hover:from-amber-400 hover:to-yellow-400 h-14 rounded-2xl font-bold text-base shadow-lg shadow-amber-900/30 group"
                                >
                                    <span>{t("calculate_button")}</span>
                                    <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                                </Button>
                            </div>
                        </form>
                    </div>
                </AnimatedSection>
            )}

            {/* Results Display */}
            <AnimatePresence>
                {results && !isRecalculating && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                        {/* ============================================================ */}
                        {/* HERO HEADER: SACRED NUMEROLOGY MATRIX */}
                        {/* ============================================================ */}
                        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1c122e]/90 via-[#10071d]/95 to-[#080312]/90 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                            <div className="absolute top-0 right-1/3 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Firma Numérica Sagrada</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                                        {t("results_title")}
                                    </h2>
                                    <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
                                        {t("results_desc")}
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsRecalculating(true)}
                                        className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl flex items-center gap-2 text-xs py-5 px-4"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                                        <span>{t("recalculate")}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* ============================================================ */}
                        {/* NAVIGATION TABS */}
                        {/* ============================================================ */}
                        <div className="sticky top-4 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab("matrix")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                    activeTab === "matrix"
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-900/40 font-bold"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Layers className="w-3.5 h-3.5" />
                                <span>Matriz Central (4 Pilares)</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("year")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                    activeTab === "year"
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-900/40 font-bold"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Año Personal {results.currentYear}</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("breakdown")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                    activeTab === "breakdown"
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-900/40 font-bold"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <Hash className="w-3.5 h-3.5" />
                                <span>Decodificación de Letras</span>
                            </button>

                            <button
                                onClick={() => setActiveTab("synthesis")}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                                    activeTab === "synthesis"
                                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-900/40 font-bold"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Síntesis Evolutiva</span>
                            </button>
                        </div>

                        {/* ============================================================ */}
                        {/* TAB 1: MATRIZ CENTRAL (4 PILARES) */}
                        {/* ============================================================ */}
                        {activeTab === "matrix" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    <NumerologyCard
                                        title={t("card_lifepath")}
                                        subtitle="Misión Terrenal de Nacimiento"
                                        details={results.lifePath}
                                        icon={Map}
                                        color="amber"
                                        delay={0.05}
                                    />
                                    <NumerologyCard
                                        title={t("card_destiny")}
                                        subtitle="Talentos del Nombre Completo"
                                        details={results.expression}
                                        icon={Sparkles}
                                        color="indigo"
                                        delay={0.1}
                                    />
                                    <NumerologyCard
                                        title={t("card_soul")}
                                        subtitle="Anhelo Oculto (Vocales)"
                                        details={results.soulUrge}
                                        icon={Heart}
                                        color="cyan"
                                        delay={0.15}
                                    />
                                    <NumerologyCard
                                        title={t("card_personality")}
                                        subtitle="Máscara Exterior (Consonantes)"
                                        details={results.personality}
                                        icon={Shield}
                                        color="violet"
                                        delay={0.2}
                                    />
                                </div>

                                {/* Banner Destacado: Año Personal Actual */}
                                <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 group">
                                    <div className="flex items-center gap-5">
                                        <NumerologyGlyph
                                            number={results.personalYear.number}
                                            variant="badge"
                                            size={64}
                                            className="shadow-xl shadow-amber-900/30 group-hover:scale-105 transition-transform"
                                        />
                                        <div className="space-y-1">
                                            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-300 font-bold">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Ciclo Activo: Año Personal {results.currentYear}</span>
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                                                {results.personalYear.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                                                {results.personalYear.essence}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => setActiveTab("year")}
                                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl px-5 py-5 text-xs font-semibold whitespace-nowrap"
                                    >
                                        <span>Ver Lección del Año</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 2: AÑO PERSONAL DETALLADO */}
                        {/* ============================================================ */}
                        {activeTab === "year" && (
                            <AnimatedSection delay={0.1}>
                                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-10 backdrop-blur-xl relative overflow-hidden space-y-8">
                                    <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/10 pb-8">
                                        <NumerologyGlyph
                                            number={results.personalYear.number}
                                            variant="badge"
                                            size={80}
                                            className="shadow-2xl shadow-amber-900/40"
                                        />
                                        <div className="space-y-2 text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest">
                                                <span>Ciclo de 9 Años</span>
                                                <span>•</span>
                                                <span>Año {results.currentYear}</span>
                                            </div>
                                            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                                                Año Personal {results.personalYear.number}: {results.personalYear.title}
                                            </h3>
                                            <p className="text-base text-amber-200/90 font-serif italic">
                                                &quot;{results.personalYear.quote}&quot;
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Frecuencia y Enfoque del Año
                                            </h4>
                                            <p className="text-sm text-slate-300 leading-relaxed">
                                                {results.personalYear.essence}
                                            </p>
                                            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                                                Tu Año Personal se calcula reduciendo el día y mes de tu nacimiento junto al año {results.currentYear}. Representa la atmósfera energética y los desafíos que el universo te presenta durante estos doce meses.
                                            </p>
                                        </div>

                                        <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                                                <Layers className="w-4 h-4" />
                                                Palabra de Poder del Ciclo
                                            </h4>
                                            <div className="inline-block px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 text-lg font-mono font-bold tracking-wider">
                                                {results.personalYear.powerWord}
                                            </div>
                                            <p className="text-xs text-slate-400 leading-relaxed pt-2">
                                                {getNumberMetadata(results.personalYear.number).geometry}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 3: DECODIFICACIÓN PITAGÓRICA DEL NOMBRE */}
                        {/* ============================================================ */}
                        {activeTab === "breakdown" && (
                            <AnimatedSection delay={0.1}>
                                <div className="space-y-8">
                                    {/* Tabla Pitagórica de Referencia */}
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl space-y-4">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 flex items-center gap-2">
                                                <Hash className="w-4 h-4 text-indigo-400" />
                                                Tabla Pitagórica de Conversión Sagrada
                                            </h3>
                                            <span className="text-xs text-slate-500">1 al 9</span>
                                        </div>

                                        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                                            {PYTHAGOREAN_TABLE.map((col) => (
                                                <div
                                                    key={col.value}
                                                    className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-center flex flex-col items-center justify-center group hover:bg-white/10 transition-colors"
                                                >
                                                    <div className="text-lg font-mono font-bold text-amber-300 mb-1">
                                                        {col.value}
                                                    </div>
                                                    <div className="text-[11px] font-semibold text-slate-400">
                                                        {col.letters.join(", ")}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Desglose del Nombre del Usuario */}
                                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                                            <div>
                                                <h3 className="text-lg font-serif font-bold text-white">
                                                    Análisis Matemático de: &quot;{name}&quot;
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Vocales (Deseo del Alma en Cian) vs Consonantes (Personalidad en Violeta)
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 text-xs">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                                                    <span className="text-slate-300">Vocales ({results.letterMap.vowelsSum} ➔ #{results.soulUrge.number})</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-3 h-3 rounded-full bg-purple-400" />
                                                    <span className="text-slate-300">Consonantes ({results.letterMap.consonantsSum} ➔ #{results.personality.number})</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Words Breakdown */}
                                        <div className="flex flex-wrap items-center gap-6 py-4">
                                            {results.letterMap.words.map((w, wIdx) => (
                                                <div key={wIdx} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-black/40 border border-white/5">
                                                    <div className="text-[10px] text-slate-500 font-mono text-center mb-0.5">
                                                        Palabra {wIdx + 1}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {w.letters.map((item, lIdx) => (
                                                            <div
                                                                key={lIdx}
                                                                className={`flex flex-col items-center justify-center w-9 h-12 rounded-xl border transition-all ${
                                                                    item.isVowel
                                                                        ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-200 shadow-sm"
                                                                        : "bg-purple-500/10 border-purple-400/40 text-purple-200 shadow-sm"
                                                                }`}
                                                            >
                                                                <span className="text-sm font-bold uppercase">
                                                                    {item.char}
                                                                </span>
                                                                <span className="text-[10px] font-mono opacity-80">
                                                                    {item.value}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Sum Equations */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
                                            <div className="p-3 rounded-xl bg-white/5">
                                                <span className="text-slate-400 block mb-1">Total Vocales:</span>
                                                <span className="text-cyan-300 font-bold text-sm">
                                                    Suma {results.letterMap.vowelsSum} ➔ Deseo del Alma #{results.soulUrge.number}
                                                </span>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white/5">
                                                <span className="text-slate-400 block mb-1">Total Consonantes:</span>
                                                <span className="text-purple-300 font-bold text-sm">
                                                    Suma {results.letterMap.consonantsSum} ➔ Personalidad #{results.personality.number}
                                                </span>
                                            </div>
                                            <div className="p-3 rounded-xl bg-white/5">
                                                <span className="text-slate-400 block mb-1">Total General (Nombre):</span>
                                                <span className="text-amber-300 font-bold text-sm">
                                                    Suma {results.letterMap.totalSum} ➔ Destino #{results.expression.number}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        )}

                        {/* ============================================================ */}
                        {/* TAB 4: SÍNTESIS EVOLUTIVA */}
                        {/* ============================================================ */}
                        {activeTab === "synthesis" && (
                            <AnimatedSection delay={0.1}>
                                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-10 backdrop-blur-xl relative overflow-hidden space-y-6">
                                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-white">
                                                {t("interpretation_title")}
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                Integración de tus cuatro códigos vibracionales
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6 text-slate-300 text-sm">
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 leading-relaxed">
                                                {t.rich("interpretation_lifepath", {
                                                    number: results.lifePath.number,
                                                    strong: (chunks) => <strong className="text-amber-300">{chunks}</strong>
                                                })}
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 leading-relaxed">
                                                {t.rich("interpretation_destiny", {
                                                    number: results.expression.number,
                                                    strong: (chunks) => <strong className="text-indigo-300">{chunks}</strong>
                                                })}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 leading-relaxed">
                                                {t.rich("interpretation_soul", {
                                                    number: results.soulUrge.number,
                                                    strong: (chunks) => <strong className="text-cyan-300">{chunks}</strong>
                                                })}
                                            </div>
                                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 leading-relaxed">
                                                {t.rich("interpretation_personality", {
                                                    number: results.personality.number,
                                                    strong: (chunks) => <strong className="text-purple-300">{chunks}</strong>
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 text-center">
                                        <p className="text-slate-400 text-sm font-serif italic">
                                            {t("footer_quote")}
                                        </p>
                                    </div>
                                </div>
                            </AnimatedSection>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

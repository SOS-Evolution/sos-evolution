"use client";

import { useState, useMemo } from "react";
import {
    BookOpen,
    Sparkles,
    Calendar,
    ArrowRight,
    Search,
    Clock,
    Zap,
    MessageCircleQuestion,
    ChevronRight,
    Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { SoulJournalEntry, SoulJournalCard } from "@/types";
import { DECK } from "@/components/features/tarot/TarotCard";

interface SoulJournalClientProps {
    initialEntries: SoulJournalEntry[];
}

export default function SoulJournalClient({ initialEntries }: SoulJournalClientProps) {
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [inspectedCard, setInspectedCard] = useState<{
        card: SoulJournalCard;
        typeName: string;
        date: string;
    } | null>(null);

    // 1. Cálculos de estadísticas para la cabecera
    const stats = useMemo(() => {
        const totalSpreads = initialEntries.length;
        let totalCardsCount = 0;
        const cardFrequency: Record<string, number> = {};

        for (const entry of initialEntries) {
            totalCardsCount += entry.cards.length;
            for (const c of entry.cards) {
                if (c.cardName) {
                    cardFrequency[c.cardName] = (cardFrequency[c.cardName] || 0) + 1;
                }
            }
        }

        let topCardName = "Ninguno aún";
        let topCardCount = 0;
        for (const [name, count] of Object.entries(cardFrequency)) {
            if (count > topCardCount) {
                topCardCount = count;
                topCardName = name;
            }
        }

        const lastDate = initialEntries[0]?.createdAt
            ? new Date(initialEntries[0].createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short"
            })
            : "Hoy";

        return {
            totalSpreads,
            totalCardsCount,
            topCardName,
            topCardCount,
            lastDate,
        };
    }, [initialEntries]);

    // 2. Filtrado dinámico
    const filteredEntries = useMemo(() => {
        return initialEntries.filter(entry => {
            const query = search.toLowerCase().trim();

            const matchesSearch =
                !query ||
                entry.cards.some(c =>
                    c.cardName.toLowerCase().includes(query) ||
                    c.description.toLowerCase().includes(query) ||
                    c.keywords.some(k => k.toLowerCase().includes(query)) ||
                    (c.position && c.position.toLowerCase().includes(query))
                ) ||
                (entry.question && entry.question.toLowerCase().includes(query)) ||
                entry.readingTypeName.toLowerCase().includes(query);

            const count = entry.cards.length;
            const matchesType =
                filterType === "all" ||
                (filterType === "1" && count === 1) ||
                (filterType === "3" && count === 3) ||
                (filterType === "5" && count === 5);

            return matchesSearch && matchesType;
        });
    }, [initialEntries, search, filterType]);

    // Formateador de fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Resuelve la ruta de imagen del arcano
    const getCardImage = (cardName: string) => {
        const idx = DECK.indexOf(cardName);
        return idx >= 0 ? `/assets/tarot/arcano-${idx}.jpg` : "/assets/tarot/arcano-0.jpg";
    };

    // Color del badge según número de cartas
    const getSpreadBadgeStyle = (cardsCount: number) => {
        if (cardsCount >= 5) {
            return {
                bg: "bg-emerald-500/20",
                text: "text-emerald-300",
                border: "border-emerald-500/30",
                icon: "✨",
                label: "Cruz Guía Evolutiva"
            };
        }
        if (cardsCount === 3) {
            return {
                bg: "bg-amber-500/20",
                text: "text-amber-300",
                border: "border-amber-500/30",
                icon: "⏳",
                label: "Evolución Temporal"
            };
        }
        return {
            bg: "bg-purple-500/20",
            text: "text-purple-300",
            border: "border-purple-500/30",
            icon: "🔮",
            label: "Oráculo / Consulta"
        };
    };

    return (
        <div className="min-h-screen text-slate-100 pb-24 relative overflow-hidden">
            {/* Fondos Cósmicos */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-purple-900/15 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/15 rounded-full blur-[100px] animate-float-delayed" />
            </div>

            <main className="max-w-5xl mx-auto p-4 md:p-6 relative z-10 space-y-10">

                {/* 1. HEADER */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-8 pt-4 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-purple-600/25 rounded-2xl border border-purple-500/30 shadow-lg shadow-purple-950/50">
                                <BookOpen className="w-7 h-7 text-purple-400" />
                            </div>
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-wide">
                                Diario del <span className="text-gradient-purple">Alma</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm md:text-base max-w-xl">
                            Tu registro akásico de evolución espiritual. Cada tirada es una sincronicidad en tu camino.
                        </p>
                    </div>

                    <Link href="/tarot">
                        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-900/40 px-6 py-6 rounded-2xl font-bold group border border-white/10 transition-all hover:scale-105">
                            Nueva Consulta
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* 2. RESUMEN DE TU VIAJE EVOLUTIVO */}
                {initialEntries.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-purple-400" />
                                Tiradas Registradas
                            </span>
                            <span className="text-2xl md:text-3xl font-bold font-serif text-white">
                                {stats.totalSpreads}
                            </span>
                        </div>

                        <div className="bg-slate-900/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                Cartas Reveladas
                            </span>
                            <span className="text-2xl md:text-3xl font-bold font-serif text-indigo-300">
                                {stats.totalCardsCount}
                            </span>
                        </div>

                        <div className="bg-slate-900/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                Arcano Más Frecuente
                            </span>
                            <span className="text-sm md:text-base font-bold font-serif text-amber-300 truncate block">
                                {stats.topCardName}
                            </span>
                            {stats.topCardCount > 0 && (
                                <span className="text-[10px] text-slate-500">
                                    {stats.topCardCount} apariciones
                                </span>
                            )}
                        </div>

                        <div className="bg-slate-900/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                Última Sincronía
                            </span>
                            <span className="text-sm md:text-base font-bold font-serif text-emerald-300">
                                {stats.lastDate}
                            </span>
                        </div>
                    </div>
                )}

                {/* 3. BARRA DE FILTROS Y BÚSQUEDA */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-950/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por carta, pregunta o palabra clave..."
                            className="pl-10 bg-slate-900/80 border-white/10 text-white placeholder:text-slate-500 text-sm h-11 rounded-xl focus:border-purple-500"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        {[
                            { id: "all", label: "Todas" },
                            { id: "3", label: "⏳ Evolución (3)" },
                            { id: "5", label: "✨ Cruz Guía (5)" },
                            { id: "1", label: "🔮 Consultas (1)" },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setFilterType(tab.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                    filterType === tab.id
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40 border border-purple-400/40"
                                        : "bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. LISTA DE ENTRADAS DEL DIARIO (TIRADAS UNIFICADAS) */}
                {filteredEntries.length === 0 ? (
                    <div className="text-center py-20 px-6 rounded-3xl bg-slate-900/30 border border-white/10 backdrop-blur-md">
                        <Sparkles className="w-16 h-16 text-purple-400/40 mx-auto mb-4" />
                        <h3 className="text-2xl text-white font-serif mb-2">
                            {initialEntries.length === 0 ? "Tu diario está esperando su primera inscripción" : "No hay consultas que coincidan"}
                        </h3>
                        <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm leading-relaxed">
                            {initialEntries.length === 0
                                ? "Aún no has realizado ninguna consulta al oráculo. Comienza tu viaje evolutivo ahora."
                                : "Prueba modificando los términos de búsqueda o el filtro de tiradas."
                            }
                        </p>
                        <Link href="/tarot">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-5 rounded-xl font-bold shadow-lg shadow-purple-900/40">
                                Iniciar lectura de Tarot
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredEntries.map((entry, entryIdx) => {
                            const badge = getSpreadBadgeStyle(entry.cards.length);

                            return (
                                <motion.div
                                    key={entry.spreadId || entryIdx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: entryIdx * 0.05 }}
                                >
                                    <GlowingBorderCard className="overflow-hidden" glowColor={entry.cards.length >= 5 ? "emerald" : entry.cards.length === 3 ? "amber" : "purple"}>
                                        <div className="p-6 md:p-8 space-y-6">

                                            {/* CABECERA DE LA TIRADA */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
                                                <div className="flex items-center gap-3">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                                                        <span>{badge.icon}</span>
                                                        <span>{entry.readingTypeName || badge.label}</span>
                                                        <span className="opacity-75">({entry.cards.length} {entry.cards.length === 1 ? "carta" : "cartas"})</span>
                                                    </span>

                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{formatDate(entry.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* PREGUNTA FORMULADA */}
                                            {entry.question && (
                                                <div className="flex items-start gap-3 bg-purple-950/20 border border-purple-500/20 rounded-xl p-3.5">
                                                    <MessageCircleQuestion className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block mb-0.5">
                                                            Tu Pregunta al Oráculo
                                                        </span>
                                                        <p className="text-sm font-medium text-purple-100 italic">
                                                            &quot;{entry.question}&quot;
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* CARTAS REVELADAS EN LA TIRADA */}
                                            {entry.cards.length === 3 ? (
                                                // LAYOUT EVOLUCIÓN TEMPORAL (3 CARTAS EN LÍNEA / COLUMNAS)
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                                                    {entry.cards.map((card, cIdx) => (
                                                        <div
                                                            key={card.id || cIdx}
                                                            className="flex flex-col p-4 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-purple-500/30 transition-all group"
                                                        >
                                                            {/* Posición badge */}
                                                            <div className="flex items-center justify-between mb-3">
                                                                <span className="text-xs uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                                                                    {card.position || (cIdx === 0 ? "Pasado" : cIdx === 1 ? "Presente" : "Futuro")}
                                                                </span>
                                                                <button
                                                                    onClick={() => setInspectedCard({ card, typeName: entry.readingTypeName, date: formatDate(entry.createdAt) })}
                                                                    className="text-slate-500 hover:text-purple-300 transition-colors p-1"
                                                                    title="Ver Arcano"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            {/* Miniatura y Nombre */}
                                                            <div className="flex gap-3 items-center mb-3">
                                                                <div className="w-12 h-18 relative rounded-lg overflow-hidden border border-purple-500/40 shadow-md flex-shrink-0 cursor-pointer"
                                                                    onClick={() => setInspectedCard({ card, typeName: entry.readingTypeName, date: formatDate(entry.createdAt) })}
                                                                >
                                                                    <Image
                                                                        src={getCardImage(card.cardName)}
                                                                        alt={card.cardName}
                                                                        fill
                                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                                <h4 className="font-serif font-bold text-base text-white leading-tight">
                                                                    {card.cardName}
                                                                </h4>
                                                            </div>

                                                            {/* Keywords */}
                                                            <div className="flex flex-wrap gap-1 mb-3">
                                                                {card.keywords.map((k, kIdx) => (
                                                                    <span key={kIdx} className="text-[9px] uppercase tracking-wider bg-white/5 text-slate-300 px-2 py-0.5 rounded border border-white/10">
                                                                        {k}
                                                                    </span>
                                                                ))}
                                                            </div>

                                                            {/* Interpretación */}
                                                            <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-4 border-l-2 border-amber-500/40 pl-2.5">
                                                                &quot;{card.description}&quot;
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : entry.cards.length >= 5 ? (
                                                // LAYOUT CRUZ GUÍA (5 CARTAS EN GRID)
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                                                    {entry.cards.map((card, cIdx) => (
                                                        <div
                                                            key={card.id || cIdx}
                                                            className="flex flex-col p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 transition-all group"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 truncate">
                                                                    {card.position || `Carta ${cIdx + 1}`}
                                                                </span>
                                                                <button
                                                                    onClick={() => setInspectedCard({ card, typeName: entry.readingTypeName, date: formatDate(entry.createdAt) })}
                                                                    className="text-slate-500 hover:text-emerald-300 transition-colors p-1"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>

                                                            <div className="flex gap-2.5 items-center mb-2">
                                                                <div
                                                                    className="w-10 h-15 relative rounded-lg overflow-hidden border border-emerald-500/40 shadow-sm flex-shrink-0 cursor-pointer"
                                                                    onClick={() => setInspectedCard({ card, typeName: entry.readingTypeName, date: formatDate(entry.createdAt) })}
                                                                >
                                                                    <Image
                                                                        src={getCardImage(card.cardName)}
                                                                        alt={card.cardName}
                                                                        fill
                                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                                <h4 className="font-serif font-bold text-xs text-white leading-tight">
                                                                    {card.cardName}
                                                                </h4>
                                                            </div>

                                                            <p className="text-[11px] text-slate-300 italic leading-relaxed line-clamp-3 border-l-2 border-emerald-500/40 pl-2">
                                                                &quot;{card.description}&quot;
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                // LAYOUT 1 CARTA (ORÁCULO DIARIO / PREGUNTA INDIVIDUAL)
                                                <div className="flex flex-col sm:flex-row gap-6 items-start bg-slate-950/50 p-6 rounded-2xl border border-white/5">
                                                    <div
                                                        className="w-28 h-42 md:w-36 md:h-54 relative rounded-xl overflow-hidden border-2 border-purple-500/40 shadow-xl flex-shrink-0 mx-auto sm:mx-0 cursor-pointer group"
                                                        onClick={() => setInspectedCard({ card: entry.cards[0], typeName: entry.readingTypeName, date: formatDate(entry.createdAt) })}
                                                    >
                                                        <Image
                                                            src={getCardImage(entry.cards[0].cardName)}
                                                            alt={entry.cards[0].cardName}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>

                                                    <div className="flex-1 space-y-3 text-left">
                                                        <h3 className="text-2xl font-serif font-bold text-white">
                                                            {entry.cards[0].cardName}
                                                        </h3>

                                                        <div className="flex flex-wrap gap-1.5">
                                                            {entry.cards[0].keywords.map((k, kIdx) => (
                                                                <span key={kIdx} className="text-xs uppercase tracking-wider bg-purple-950/60 text-purple-300 px-3 py-1 rounded-full border border-purple-500/20">
                                                                    {k}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <p className="text-sm md:text-base text-slate-300 italic leading-relaxed border-l-2 border-purple-500/50 pl-4">
                                                            &quot;{entry.cards[0].description}&quot;
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* SECCIÓN DE MISIÓN EVOLUTIVA */}
                                            {entry.cards.some(c => c.action) && (
                                                <div className="bg-slate-950/70 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-purple-400 flex items-center gap-1.5">
                                                            <Zap className="w-3.5 h-3.5" />
                                                            Misión / Acción Evolutiva
                                                        </span>
                                                        <p className="text-xs md:text-sm text-slate-300 italic">
                                                            {entry.cards[0].action || entry.cards[entry.cards.length - 1]?.action}
                                                        </p>
                                                    </div>

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => setInspectedCard({
                                                            card: entry.cards[0],
                                                            typeName: entry.readingTypeName,
                                                            date: formatDate(entry.createdAt)
                                                        })}
                                                        className="text-purple-400 hover:text-white hover:bg-purple-600/20 text-xs self-end sm:self-center"
                                                    >
                                                        Detalles Completos
                                                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                                    </Button>
                                                </div>
                                            )}

                                        </div>
                                    </GlowingBorderCard>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

            </main>

            {/* MODAL DETALLE DE ARCANO */}
            <AnimatePresence>
                {inspectedCard && (
                    <Dialog open={!!inspectedCard} onOpenChange={(open) => !open && setInspectedCard(null)}>
                        <DialogContent className="max-w-md bg-slate-950 border-purple-500/30 text-white overflow-hidden p-6">
                            <DialogHeader>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
                                        {inspectedCard.card.position || inspectedCard.typeName}
                                    </span>
                                    <span className="text-[11px] text-slate-500">
                                        {inspectedCard.date}
                                    </span>
                                </div>
                                <DialogTitle className="text-2xl font-serif text-white">
                                    {inspectedCard.card.cardName}
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-5 pt-2">
                                <div className="w-44 h-66 relative rounded-2xl overflow-hidden mx-auto border-2 border-purple-500/50 shadow-2xl shadow-purple-950/80">
                                    <Image
                                        src={getCardImage(inspectedCard.card.cardName)}
                                        alt={inspectedCard.card.cardName}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex flex-wrap justify-center gap-1.5">
                                    {inspectedCard.card.keywords.map((k, i) => (
                                        <span key={i} className="text-xs uppercase tracking-wider bg-purple-950/60 text-purple-200 px-3 py-1 rounded-full border border-purple-500/30">
                                            {k}
                                        </span>
                                    ))}
                                </div>

                                <DialogDescription className="text-slate-300 italic text-center text-sm leading-relaxed border-t border-white/10 pt-4">
                                    &quot;{inspectedCard.card.description}&quot;
                                </DialogDescription>

                                {inspectedCard.card.action && (
                                    <div className="bg-purple-950/30 p-3.5 rounded-xl border border-purple-500/20 text-xs text-slate-300">
                                        <span className="text-[10px] uppercase font-bold text-purple-400 block mb-1">
                                            ⚡ Práctica Sugerida:
                                        </span>
                                        {inspectedCard.card.action}
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </div>
    );
}

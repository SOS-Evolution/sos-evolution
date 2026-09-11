"use client";

import { useState } from "react";
import { ScrollText, Search, Eye, Sparkles, Calendar, User, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

export interface AdminSpreadReading {
    spread_id?: string;
    id?: string | number;
    full_name?: string | null;
    email?: string | null;
    reading_type_name?: string | null;
    reading_type_code?: string | null;
    question?: string | null;
    created_at: string;
    cards_count?: number;
    cards_summary?: string;
    card_name?: string; // Retrocompatibilidad
    is_reversed?: boolean;
    cards_detail?: Array<{
        id: number | string;
        card_name: string;
        position?: string | null;
        card_order: number;
        keywords?: string[];
        description?: string;
        action?: string;
    }>;
}

interface AdminReadingsClientProps {
    initialReadings: AdminSpreadReading[];
}

export default function AdminReadingsClient({ initialReadings }: AdminReadingsClientProps) {
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [selectedSpread, setSelectedSpread] = useState<AdminSpreadReading | null>(null);

    const filtered = initialReadings.filter(item => {
        const matchesSearch =
            !search ||
            (item.full_name?.toLowerCase().includes(search.toLowerCase())) ||
            (item.email?.toLowerCase().includes(search.toLowerCase())) ||
            (item.question?.toLowerCase().includes(search.toLowerCase())) ||
            (item.cards_summary?.toLowerCase().includes(search.toLowerCase())) ||
            (item.card_name?.toLowerCase().includes(search.toLowerCase()));

        const count = item.cards_count || 1;
        const matchesType =
            typeFilter === "all" ||
            (typeFilter === "1" && count === 1) ||
            (typeFilter === "3" && count === 3) ||
            (typeFilter === "5" && count === 5);

        return matchesSearch && matchesType;
    });

    const getBadgeClass = (count: number) => {
        if (count >= 5) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
        if (count === 3) return "bg-amber-500/20 text-amber-300 border-amber-500/30";
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                        <ScrollText className="w-6 h-6 text-purple-500" />
                        Historial de Tiradas y Consultas
                    </h2>
                    <p className="text-slate-400 text-sm">
                        Registro unificado de tiradas de tarot multi-carta y consultas individuales.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Total Tiradas: <strong className="text-white">{initialReadings.length}</strong></span>
                </div>
            </div>

            {/* FILTROS Y BÚSQUEDA */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por usuario, carta o pregunta..."
                        className="pl-9 bg-slate-950/60 border-slate-800 text-white placeholder:text-slate-500 text-sm h-10"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {[
                        { id: "all", label: "Todas" },
                        { id: "1", label: "1 Carta" },
                        { id: "3", label: "3 Cartas (Temporal)" },
                        { id: "5", label: "5 Cartas (Cruz)" },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setTypeFilter(f.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                                typeFilter === f.id
                                    ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLA UNIFICADA DE TIRADAS */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-slate-800 bg-slate-800/60 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="h-12 px-4">Usuario</th>
                                <th className="h-12 px-4">Tipo de Tirada</th>
                                <th className="h-12 px-4">Cartas Reveladas</th>
                                <th className="h-12 px-4">Pregunta</th>
                                <th className="h-12 px-4">Fecha</th>
                                <th className="h-12 px-4 text-right">Detalle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No se encontraron tiradas con los filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((read, idx) => {
                                    const cardsCount = read.cards_count || (read.cards_detail?.length ?? 1);
                                    const typeName = read.reading_type_name || (cardsCount === 3 ? "Evolución Temporal" : cardsCount === 5 ? "Cruz Guía" : "Consulta General");

                                    return (
                                        <tr key={read.spread_id || read.id || idx} className="hover:bg-slate-800/30 transition-colors group">
                                            {/* USUARIO */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-xs flex-shrink-0">
                                                        {(read.full_name?.[0] || read.email?.[0] || "U").toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-slate-200 font-medium truncate max-w-[140px]">
                                                            {read.full_name || "Místico"}
                                                        </span>
                                                        <span className="text-xs text-slate-500 truncate max-w-[140px]">
                                                            {read.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* TIPO DE TIRADA */}
                                            <td className="p-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getBadgeClass(cardsCount)}`}>
                                                    <Sparkles className="w-3 h-3" />
                                                    {typeName}
                                                    <span className="opacity-80 text-[10px]">({cardsCount}c)</span>
                                                </span>
                                            </td>

                                            {/* CARTAS */}
                                            <td className="p-4">
                                                {read.cards_detail && read.cards_detail.length > 0 ? (
                                                    <div className="flex flex-wrap items-center gap-1.5 max-w-md">
                                                        {read.cards_detail.map((c, cIdx) => (
                                                            <span
                                                                key={cIdx}
                                                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-950/40 border border-purple-500/30 text-xs font-serif text-purple-200"
                                                            >
                                                                {c.position && (
                                                                    <span className="text-[10px] uppercase font-sans font-bold text-purple-400/80 mr-0.5">
                                                                        {c.position}:
                                                                    </span>
                                                                )}
                                                                {c.card_name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="font-serif text-purple-300">
                                                        {read.cards_summary || read.card_name || "Carta"}
                                                    </span>
                                                )}
                                            </td>

                                            {/* PREGUNTA */}
                                            <td className="p-4 italic text-slate-400 truncate max-w-xs text-xs">
                                                {read.question ? `"${read.question}"` : <span className="text-slate-600 not-italic">Sin pregunta</span>}
                                            </td>

                                            {/* FECHA */}
                                            <td className="p-4 text-xs text-slate-400 whitespace-nowrap">
                                                {new Date(read.created_at).toLocaleString("es-ES", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </td>

                                            {/* ACCIÓN VER DETALLE */}
                                            <td className="p-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setSelectedSpread(read)}
                                                    className="h-8 px-2.5 text-purple-400 hover:text-white hover:bg-purple-600/20 rounded-lg"
                                                >
                                                    <Eye className="w-4 h-4 mr-1.5" />
                                                    Ver
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL DE DETALLE DE LA TIRADA */}
            <Dialog open={!!selectedSpread} onOpenChange={(open) => !open && setSelectedSpread(null)}>
                <DialogContent className="max-w-3xl bg-slate-950 border-purple-500/20 text-white max-h-[85vh] overflow-y-auto">
                    {selectedSpread && (
                        <div className="space-y-6">
                            <DialogHeader>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeClass(selectedSpread.cards_count || selectedSpread.cards_detail?.length || 1)}`}>
                                        {selectedSpread.reading_type_name || "Tirada"}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(selectedSpread.created_at).toLocaleString("es-ES")}
                                    </span>
                                </div>
                                <DialogTitle className="text-xl font-serif text-white flex items-center gap-2">
                                    <User className="w-5 h-5 text-purple-400" />
                                    Consulta de {selectedSpread.full_name || "Místico"} ({selectedSpread.email})
                                </DialogTitle>
                                {selectedSpread.question && (
                                    <DialogDescription className="text-slate-300 italic pt-2 border-t border-white/5">
                                        &quot;{selectedSpread.question}&quot;
                                    </DialogDescription>
                                )}
                            </DialogHeader>

                            {/* CARTAS DE LA TIRADA */}
                            <div className="space-y-4">
                                {(selectedSpread.cards_detail && selectedSpread.cards_detail.length > 0) ? (
                                    selectedSpread.cards_detail.map((c, i) => (
                                        <div key={i} className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {c.position && (
                                                        <span className="text-xs uppercase font-bold tracking-wider text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                                                            {c.position}
                                                        </span>
                                                    )}
                                                    <h4 className="text-lg font-serif font-bold text-white">{c.card_name}</h4>
                                                </div>
                                            </div>

                                            {c.keywords && c.keywords.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {c.keywords.map((k, kIdx) => (
                                                        <span key={kIdx} className="text-[10px] uppercase tracking-wider bg-white/5 text-purple-300 px-2 py-0.5 rounded border border-white/10">
                                                            {k}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {c.description && (
                                                <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-purple-500/40 pl-3 pt-1">
                                                    &quot;{c.description}&quot;
                                                </p>
                                            )}

                                            {c.action && (
                                                <div className="pt-2">
                                                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-1">
                                                        ⚡ Misión Evolutiva:
                                                    </span>
                                                    <p className="text-xs text-slate-400 bg-black/40 p-2.5 rounded-lg border border-white/5">
                                                        {c.action}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/20">
                                        <h4 className="text-lg font-serif font-bold text-white mb-2">
                                            {selectedSpread.card_name || selectedSpread.cards_summary}
                                        </h4>
                                        <p className="text-xs text-slate-400 italic">Lectura registrada individualmente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

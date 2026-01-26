"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, CheckCircle2, Circle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import AnimatedSection from "@/components/landing/AnimatedSection";

type IdeaStatus = "backlog" | "planning" | "done";

interface Idea {
    id: string;
    text: string;
    status: IdeaStatus;
    tag?: string;
}

const INITIAL_IDEAS: Idea[] = [
    { id: "1", text: "Narrativa Modular (Místico/Poético/Directo)", status: "backlog", tag: "UX" },
    { id: "2", text: "Memoria Vectorial (Pinecone/Weaviate)", status: "planning", tag: "IA" },
    { id: "3", text: "Integración WebPay/EBANX (LatAm)", status: "backlog", tag: "Pagos" },
    { id: "4", text: "Comunidad / Tiradas Espejo", status: "backlog", tag: "Social" },
    { id: "5", text: "Meditaciones guiadas por IA", status: "backlog", tag: "Contenido" },
    { id: "6", text: "Tracking Emocional Diario", status: "planning", tag: "Core" },
];

export default function IdeasDocsPage() {
    const [ideas, setIdeas] = useState<Idea[]>(INITIAL_IDEAS);
    const [newIdea, setNewIdea] = useState("");

    const addIdea = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIdea.trim()) return;
        setIdeas([...ideas, { id: Date.now().toString(), text: newIdea, status: "backlog", tag: "General" }]);
        setNewIdea("");
    };

    const moveIdea = (id: string, newStatus: IdeaStatus) => {
        setIdeas(ideas.map(idea => idea.id === id ? { ...idea, status: newStatus } : idea));
    };

    const Column = ({ title, status, icon: Icon, color }: { title: string, status: IdeaStatus, icon: any, color: string }) => (
        <div className="flex-1 min-w-[300px] bg-slate-900/40 rounded-xl p-4 border border-slate-800 flex flex-col h-[600px]">
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 ${color}`}>
                <Icon className="w-5 h-5" />
                <h3 className="font-bold">{title}</h3>
                <Badge variant="secondary" className="ml-auto bg-slate-800 text-slate-400">
                    {ideas.filter(i => i.status === status).length}
                </Badge>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {ideas.filter(i => i.status === status).map(idea => (
                    <div key={idea.id} className="p-3 bg-slate-900 border border-slate-700 rounded-lg group hover:border-purple-500/40 transition-colors shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-[10px] py-0 h-5 border-slate-600 text-slate-400">
                                {idea.tag}
                            </Badge>
                            {status === "done" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <p className="text-sm text-slate-200 mb-3">{idea.text}</p>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800 opacity-60 group-hover:opacity-100 transition-opacity">
                            {status !== "backlog" && (
                                <button onClick={() => moveIdea(idea.id, "backlog")} className="text-xs hover:text-white text-slate-500">
                                    ← Backlog
                                </button>
                            )}
                            {status === "backlog" && (
                                <button onClick={() => moveIdea(idea.id, "planning")} className="text-xs hover:text-blue-400 text-slate-500 ml-auto">
                                    Planear →
                                </button>
                            )}
                            {status === "planning" && (
                                <button onClick={() => moveIdea(idea.id, "done")} className="text-xs hover:text-emerald-400 text-slate-500 ml-auto">
                                    Completar →
                                </button>
                            )}
                            {status === "done" && (
                                <button onClick={() => moveIdea(idea.id, "planning")} className="text-xs hover:text-yellow-400 text-slate-500">
                                    ← Reabrir
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl h-[calc(100vh-140px)] flex flex-col">
            <AnimatedSection>
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/admin/docs">
                        <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass shrink-0">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-[0.3em] mb-1">Hoja de Ruta del Sistema</h2>
                        <h1 className="text-4xl font-serif text-white">Planificación del <span className="text-amber-400">Sistema</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Gestión técnica de hitos, requerimientos y evolución del proyecto.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="space-y-8 flex flex-col flex-1 pb-10">
                {/* Input Rápido */}
                <form onSubmit={addIdea} className="flex gap-4">
                    <Input
                        value={newIdea}
                        onChange={(e) => setNewIdea(e.target.value)}
                        placeholder="✨ ¿Qué nueva idea se te ocurrió?"
                        className="bg-slate-900 border-slate-700 text-white"
                    />
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Idea
                    </Button>
                </form>

                {/* Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
                    <Column title="Banco de Ideas" status="backlog" icon={Circle} color="text-slate-400" />
                    <Column title="En Planificación" status="planning" icon={Clock} color="text-blue-400" />
                    <Column title="Implementado" status="done" icon={CheckCircle2} color="text-emerald-400" />
                </div>
            </div>
        </div>
    );
}

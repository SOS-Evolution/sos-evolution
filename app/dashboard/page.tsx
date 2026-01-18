import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ScrollText, ArrowRight, Star, History as HistoryIcon, Layers } from "lucide-react";
import UserProfile from "@/components/dashboard/UserProfile";
import AnimatedSection from "@/components/landing/AnimatedSection";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return (
        <main className="min-h-screen bg-slate-950 pb-20 relative overflow-hidden">

            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/15 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/15 rounded-full blur-[100px] animate-float-delayed" />
            </div>

            {/* Contenido Principal */}
            <div className="max-w-6xl mx-auto p-6 space-y-8 mt-4 relative z-10">

                {/* 1. SECCIÓN DE PERFIL */}
                <AnimatedSection>
                    <UserProfile user={user} />
                </AnimatedSection>

                {/* Separador */}
                <div className="flex items-center gap-4 py-4">
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                    <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Panel de Control</span>
                    <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                </div>

                {/* 2. GRID DE ACCIONES */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* TARJETA 1: NUEVA LECTURA */}
                    <AnimatedSection delay={0.1}>
                        <GlowingBorderCard className="h-full" glowColor="purple">
                            <div className="p-8 flex flex-col h-full min-h-[300px]">
                                <div className="flex-grow mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-purple-900/30">
                                        <Layers className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-3">Tiradas de Tarot</h2>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Elige entre diferentes métodos de consulta para recibir la respuesta exacta que tu alma necesita.
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <Link href="/lectura" className="block w-full">
                                        <Button className="w-full bg-white text-purple-950 hover:bg-purple-50 font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] group">
                                            Seleccionar Tirada
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </GlowingBorderCard>
                    </AnimatedSection>

                    {/* TARJETA 2: HISTORIAL */}
                    <AnimatedSection delay={0.2}>
                        <GlowingBorderCard className="h-full" glowColor="cyan">
                            <div className="p-8 flex flex-col h-full min-h-[300px]">
                                <div className="flex-grow mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-5 border border-slate-600">
                                        <ScrollText className="w-7 h-7 text-slate-300" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-3">Diario del Alma</h2>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Revisa tus lecturas pasadas, patrones recurrentes y misiones cumplidas.
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <Link href="/historial" className="block w-full">
                                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-6 rounded-xl shadow-lg transition-all hover:scale-[1.02] group">
                                            Ver Historial
                                            <HistoryIcon className="w-4 h-4 ml-2 group-hover:rotate-[-20deg] transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </GlowingBorderCard>
                    </AnimatedSection>
                </div>

                {/* 3. FRASE DEL DÍA */}
                <AnimatedSection delay={0.3}>
                    <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <Star className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-300 italic font-serif">
                                "Quien mira hacia afuera, sueña; quien mira hacia adentro, despierta."
                            </p>
                            <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-wider">— Carl Gustav Jung</p>
                        </div>
                    </div>
                </AnimatedSection>

            </div>
        </main>
    );
}
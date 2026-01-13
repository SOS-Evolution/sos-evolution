import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AppNavbar from "@/components/AppNavbar"; // O "Navbar" si unificaste el nombre
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ScrollText, ArrowRight, Star, History as HistoryIcon } from "lucide-react";
import UserProfile from "@/components/dashboard/UserProfile";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    return (
        <main className="min-h-screen bg-slate-950 pb-20">

            {/* Contenido Principal */}
            <div className="max-w-6xl mx-auto p-6 space-y-8 mt-4">

                {/* 1. SECCIÓN DE PERFIL (Datos + Estadísticas) */}
                <UserProfile user={user} />

                {/* Separador sutil */}
                <div className="flex items-center gap-4 py-4">
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Panel de Control</span>
                    <div className="h-[1px] bg-white/10 flex-1"></div>
                </div>

                {/* 2. GRID DE ACCIONES PRINCIPALES */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* TARJETA: NUEVA LECTURA */}
                    <Card className="bg-gradient-to-br from-purple-900/10 to-slate-900 border-purple-500/30 p-8 flex flex-col h-64 hover:border-purple-500/50 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-32 h-32" />
                        </div>

                        <div className="mb-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-900/30">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Consultar Oráculo</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Realiza una tirada evolutiva con IA para recibir guía en tu momento presente.
                            </p>
                        </div>

                        {/* mt-auto empuja el botón al fondo para alinear */}
                        <div className="mt-auto">
                            <Link href="/lectura">
                                <Button className="w-full bg-white text-purple-950 hover:bg-slate-200 font-bold shadow-lg shadow-purple-900/10 transition-all hover:translate-y-[-2px]">
                                    Iniciar Lectura <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    {/* TARJETA: HISTORIAL */}
                    <Card className="bg-slate-900/50 border-slate-800 p-8 flex flex-col h-64 hover:border-slate-600 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ScrollText className="w-32 h-32 text-slate-400" />
                        </div>

                        <div className="mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                                <ScrollText className="w-6 h-6 text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Diario del Alma</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Revisa tus lecturas pasadas, patrones recurrentes y misiones cumplidas.
                            </p>
                        </div>

                        <div className="mt-auto">
                            <Link href="/historial">
                                <Button variant="outline" className="w-full border-slate-600 text-slate-200 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-all">
                                    Ver Historial <HistoryIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* 3. FRASE DEL DÍA (Footer Decorativo) */}
                <div className="bg-slate-900/30 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="p-2 bg-yellow-500/10 rounded-full">
                        <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-300 italic">
                            "Quien mira hacia afuera, sueña; quien mira hacia adentro, despierta."
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-bold uppercase">— Carl Gustav Jung</p>
                    </div>
                </div>

            </div>
        </main>
    );
}
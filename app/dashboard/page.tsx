import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AppNavbar from "@/components/AppNavbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// CORRECCIÓN AQUÍ: Importamos History como "HistoryIcon" para no confundir a TypeScript
import { Sparkles, ScrollText, ArrowRight, Star, History as HistoryIcon } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Protección de ruta: Si no hay usuario, fuera.
    if (!user) {
        redirect("/login");
    }

    const username = user.email?.split("@")[0] || "Viajero";

    return (
        <main className="min-h-screen bg-slate-950">
            {/* Navbar presente */}
            <AppNavbar userEmail={user.email!} />

            <div className="max-w-6xl mx-auto p-6 space-y-8">

                {/* Bienvenida */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-white mb-2">Hola, {username}</h1>
                        <p className="text-slate-400">¿En qué etapa de tu viaje te encuentras hoy?</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs text-purple-400 uppercase tracking-widest font-bold">Estado del Alma</p>
                        <p className="text-slate-300">Buscador Activo</p>
                    </div>
                </div>

                {/* Grid de Acciones */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* TARJETA 1: NUEVA LECTURA */}
                    <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900 border-purple-500/30 p-8 flex flex-col justify-between hover:border-purple-500/60 transition-all group relative overflow-hidden h-64">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-32 h-32" />
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-900/50">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Consultar Oráculo</h2>
                            <p className="text-slate-400 text-sm">Realiza una tirada evolutiva con IA para recibir guía en tu momento presente.</p>
                        </div>

                        <Link href="/lectura">
                            <Button className="w-full mt-4 bg-white text-purple-950 hover:bg-purple-100 font-bold">
                                Iniciar Lectura <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </Card>

                    {/* TARJETA 2: HISTORIAL */}
                    <Card className="bg-slate-900/50 border-slate-800 p-8 flex flex-col justify-between hover:border-slate-600 transition-all group relative overflow-hidden h-64">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ScrollText className="w-32 h-32 text-slate-400" />
                        </div>

                        <div>
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                                <ScrollText className="w-6 h-6 text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Diario del Alma</h2>
                            <p className="text-slate-400 text-sm">Revisa tus lecturas pasadas, patrones y misiones cumplidas.</p>
                        </div>

                        <Link href="/historial">
                            <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                                {/* CORRECCIÓN AQUÍ: Usamos HistoryIcon en lugar de History */}
                                Ver Historial <HistoryIcon className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </Card>
                </div>

                {/* Sección Extra */}
                <div className="bg-slate-900/30 border border-white/5 rounded-xl p-6 flex items-center gap-4">
                    <Star className="w-6 h-6 text-yellow-500/50" />
                    <p className="text-sm text-slate-500 italic">
                        "Quien mira hacia afuera, sueña; quien mira hacia adentro, despierta." — Carl Jung
                    </p>
                </div>

            </div>
        </main>
    );
}
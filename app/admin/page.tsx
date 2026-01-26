import { createClient } from "@/lib/supabase/server";
import { Users, Coins, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

async function getStats() {
    const supabase = await createClient();

    // Llamamos a nuestra funcion RPC segura
    const { data, error } = await supabase.rpc('get_admin_stats');

    if (error) {
        console.error("Error fetching stats:", error);
        return null;
    }

    return data as {
        total_users: number;
        total_credits: number;
        total_readings: number;
    };
}

export default async function AdminDashboardPage() {
    const stats = await getStats();

    if (!stats) {
        return (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p>Error al cargar estadísticas. Asegúrate de haber corrido la migración "12_admin_system.sql".</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Resumen General</h2>
                <p className="text-slate-400">Vista panorámica del estado de SOS Evolution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* USERS CARD */}
                <GlowingBorderCard glowColor="blue">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Usuarios Totales</p>
                            <h3 className="text-3xl font-bold text-white">{stats.total_users}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                    </div>
                </GlowingBorderCard>

                {/* CREDITS CARD */}
                <GlowingBorderCard glowColor="yellow">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Créditos en Circulación</p>
                            <h3 className="text-3xl font-bold text-white">{stats.total_credits}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                            <Coins className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                </GlowingBorderCard>

                {/* READINGS CARD */}
                <GlowingBorderCard glowColor="purple">
                    <div className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Lecturas Realizadas</p>
                            <h3 className="text-3xl font-bold text-white">{stats.total_readings}</h3>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <BookOpen className="w-6 h-6 text-purple-400" />
                        </div>
                    </div>
                </GlowingBorderCard>
            </div>

            {/* Aqui podriamos poner graficos mas adelante */}
            <div className="mt-8">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
                    </div>
                    <div className="h-64 flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-lg">
                        <span>Próximamente: Gráfico de Registros Diarios</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

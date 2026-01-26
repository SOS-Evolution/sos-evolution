import { createClient } from "@/lib/supabase/server";
import { Users, Coins, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

async function getData() {
    const supabase = await createClient();

    const [statsRes, activityRes] = await Promise.all([
        supabase.rpc('get_admin_stats'),
        supabase.rpc('get_recent_activity_admin')
    ]);

    if (statsRes.error) {
        console.error("Error fetching stats:", statsRes.error);
        return null;
    }

    return {
        stats: statsRes.data as {
            total_users: number;
            total_credits: number;
            total_readings: number;
        },
        activity: activityRes.data || []
    };
}

export default async function AdminDashboardPage() {
    const data = await getData();

    if (!data) {
        return (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p>Error al cargar estadísticas. Asegúrate de haber corrido la migración "12_admin_system.sql".</p>
            </div>
        );
    }

    const { stats, activity } = data;

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

            {/* ACTIVIDAD RECIENTE */}
            <div className="mt-8">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
                    </div>

                    <div className="space-y-4">
                        {activity && activity.length > 0 ? (
                            activity.map((event: any, i: number) => (
                                <div key={i} className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-slate-800">
                                    <div className={`mt-1 p-2 rounded-lg ${event.type === 'user' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                                        }`}>
                                        {event.type === 'user' ? <Users className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-slate-200 truncate">
                                                {event.full_name || "Místico"}
                                            </p>
                                            <span className="text-[10px] text-slate-500 whitespace-nowrap bg-slate-800 px-2 py-0.5 rounded-full">
                                                {new Date(event.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            {event.type === 'user' ? (
                                                <span className="text-blue-400/80">Nuevo registro</span>
                                            ) : (
                                                <>Lectura: <span className="text-purple-400/80 font-serif">{event.detail}</span></>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-32 flex items-center justify-center text-slate-600 italic border-2 border-dashed border-slate-800 rounded-lg">
                                No hay actividad reciente registrada.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

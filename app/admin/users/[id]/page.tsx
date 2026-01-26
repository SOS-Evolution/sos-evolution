import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import {
    User,
    Coins,
    History,
    Calendar,
    MapPin,
    Search,
    Plus,
    Minus,
    ShieldAlert,
    ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { adjustUserCredits } from "./actions";

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = params.id;
    const supabase = await createClient();

    // 1. Obtener perfil completo via RPC (para incluir email de forma segura)
    const { data: profile, error } = await supabase.rpc('get_user_detail_admin', {
        p_user_id: userId
    });

    if (error || !profile) {
        return (
            <div className="p-8 rounded-2xl bg-red-900/10 border border-red-500/20 text-red-200">
                <h2 className="text-xl font-bold mb-2">Error al cargar usuario</h2>
                <p className="font-mono text-sm bg-black/40 p-3 rounded">
                    {error ? `Código: ${error.code} - Mensaje: ${error.message}` : "El perfil no existe en la base de datos."}
                </p>
                <Button asChild className="mt-4" variant="outline">
                    <Link href="/admin/users">Volver a la lista</Link>
                </Button>
            </div>
        );
    }

    // 2. Obtener balance
    const { data: balance } = await supabase.rpc('get_user_balance', { user_uuid: userId });

    // 3. Obtener Historial de Créditos
    const { data: credits } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

    // 4. Obtener Historial de Lecturas
    const { data: readings } = await supabase
        .from("lecturas")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

    return (
        <div className="space-y-8 animate-fade-in-up pb-12">
            {/* Header / Nav */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild className="text-slate-400 hover:text-white group">
                    <Link href="/admin/users" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Volver a Usuarios
                    </Link>
                </Button>
                <div className="flex gap-2">
                    {profile.role === 'admin' ? (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Admin Account</Badge>
                    ) : (
                        <Badge variant="secondary" className="bg-slate-800 text-slate-500 italic">User Account</Badge>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* COLUMNA IZQUIERDA: PERFIL */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 p-1 mb-4 shadow-xl shadow-purple-950/40">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                    <User className="w-10 h-10 text-slate-600" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1 font-serif tracking-wide">{profile.full_name || "Místico sin nombre"}</h2>
                        <p className="text-slate-500 text-sm mb-4">{profile.email}</p>

                        <div className="w-full pt-4 border-t border-slate-800/50 space-y-3 text-left">
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-slate-400">Nació:</span>
                                <span className="text-slate-200 ml-auto">{profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'Desconocido'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span className="text-slate-400">Lugar:</span>
                                <span className="text-slate-200 ml-auto truncate max-w-[120px]">{profile.birth_place || 'Desconocido'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Search className="w-4 h-4 text-purple-400" />
                                <span className="text-slate-400">Vibración:</span>
                                <span className="text-purple-400 font-bold ml-auto">Camino {profile.life_path_number || '?'}</span>
                            </div>
                        </div>
                    </div>

                    {/* AJUSTE DE CRÉDITOS */}
                    <div className="rounded-2xl border border-yellow-900/20 bg-yellow-950/10 p-6">
                        <h3 className="text-sm font-bold text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" /> Gestión de Créditos
                        </h3>
                        <form action={adjustUserCredits} className="space-y-4">
                            <input type="hidden" name="userId" value={userId} />
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-slate-500 ml-1">Monto (usar negativo para quitar)</label>
                                <div className="relative">
                                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yellow-600" />
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Ej: 50 o -10"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-slate-500 ml-1">Motivo</label>
                                <input
                                    type="text"
                                    name="description"
                                    placeholder="Regalo, bonus, error..."
                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg h-10 px-4 text-sm text-white focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-10 rounded-lg transition-all active:scale-[0.98]">
                                Aplicar Ajuste Místico
                            </Button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DERECHA: HISTORIALES */}
                <div className="lg:col-span-2 space-y-8">

                    {/* STATS RAPIDAS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Saldo Actual</span>
                                <Coins className="w-4 h-4 text-yellow-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">{balance || 0} <span className="text-xs text-slate-500 font-normal">créditos</span></p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Lecturas Totales</span>
                                <History className="w-4 h-4 text-purple-500" />
                            </div>
                            <p className="text-3xl font-bold text-white">{(readings as any)?.length || 0}</p>
                        </div>
                    </div>

                    {/* TABLA TRANSACCIONES */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Últimos Movimientos</h3>
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 overflow-hidden">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-800/40 text-slate-500">
                                    <tr>
                                        <th className="p-3 font-medium">Concepto</th>
                                        <th className="p-3 font-medium text-right">Monto</th>
                                        <th className="p-3 font-medium">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {credits?.map(tx => (
                                        <tr key={tx.id} className="border-t border-slate-800/50 hover:bg-white/5 transition-colors">
                                            <td className="p-3">
                                                <span className="text-slate-300">{tx.description}</span>
                                                <span className="ml-2 px-1 rounded bg-slate-800 text-[9px] text-slate-500 uppercase">{tx.source}</span>
                                            </td>
                                            <td className={`p-3 text-right font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                            </td>
                                            <td className="p-3 text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* HISTORIAL LECTURAS */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Bitácora del Oráculo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {readings?.map(read => (
                                <div key={read.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-purple-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-purple-400 font-serif font-bold group-hover:text-purple-300 transition-colors uppercase tracking-tighter text-sm">{read.card_name}</span>
                                        <span className="text-[10px] text-slate-600 font-mono">{new Date(read.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-400 italic line-clamp-2">"{read.question || 'Sin pregunta registrada'}"</p>
                                </div>
                            ))}
                        </div>
                        {(!readings || readings.length === 0) && (
                            <div className="p-8 rounded-xl border border-dashed border-slate-800 text-center text-slate-600 italic">
                                Este usuario aún no ha consultado a las estrellas.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

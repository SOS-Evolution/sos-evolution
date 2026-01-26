import { createClient } from "@/lib/supabase/server";
import { ScrollText, Sparkles } from "lucide-react";

export default async function AdminReadingsPage() {
    const supabase = await createClient();

    // Obtener últimas 50 lecturas
    const { data: readings, error } = await supabase
        .from('lecturas')
        .select(`
        *,
        profiles (
            full_name,
            email
        )
    `)
        .order('created_at', { ascending: false })
        .limit(50);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                    <ScrollText className="w-6 h-6 text-purple-500" />
                    Historial de Lecturas
                </h2>
                <p className="text-slate-400 text-sm">Registros de todas las consultas realizadas al oráculo.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-slate-800 bg-slate-800/50">
                            <tr>
                                <th className="h-12 px-4 font-medium text-slate-400">Usuario</th>
                                <th className="h-12 px-4 font-medium text-slate-400">Carta</th>
                                <th className="h-12 px-4 font-medium text-slate-400">Pregunta</th>
                                <th className="h-12 px-4 font-medium text-slate-400">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {readings?.map((read: any) => (
                                <tr key={read.id} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{read.profiles?.full_name || "Místico"}</span>
                                            <span className="text-xs text-slate-500">{read.profiles?.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-purple-400 font-serif">{read.card_name}</span>
                                            {read.is_reversed && <span className="text-[10px] bg-red-900/30 text-red-300 px-1 rounded italic">Invertida</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 italic text-slate-400 truncate max-w-xs">
                                        "{read.question || 'Sin pregunta'}"
                                    </td>
                                    <td className="p-4 text-xs text-slate-500">
                                        {new Date(read.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

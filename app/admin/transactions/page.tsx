import { createClient } from "@/lib/supabase/server";
import { CreditCard, History } from "lucide-react";

export default async function AdminTransactionsPage() {
    const supabase = await createClient();

    // Obtener últimas 50 transacciones vía RPC
    const { data: transactions, error } = await supabase.rpc('get_transactions_list_admin', {
        p_limit: 50
    });

    if (error) {
        console.error("Error fetching transactions:", error);
        return (
            <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/50 text-red-200">
                Error al cargar el flujo de créditos.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-yellow-500" />
                    Flujo de Créditos
                </h2>
                <p className="text-slate-400 text-sm">Monitoreo de transacciones y economía del sistema.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="border-b border-slate-800 bg-slate-800/50">
                            <tr>
                                <th className="h-12 px-4 font-medium text-slate-400">Usuario</th>
                                <th className="h-12 px-4 font-medium text-slate-400">Concepto</th>
                                <th className="h-12 px-4 font-medium text-slate-400 text-right">Monto</th>
                                <th className="h-12 px-4 font-medium text-slate-400">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions?.map((tx: any) => (
                                <tr key={tx.id} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-200 font-medium">{tx.full_name || "Místico Desconocido"}</span>
                                            <span className="text-xs text-slate-500">{tx.email}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 uppercase text-xs tracking-wider text-slate-300">
                                        <span className={`px-2 py-0.5 rounded ${tx.source === 'purchase' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                            tx.source === 'reading' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                'bg-slate-700/30 text-slate-400'
                                            }`}>
                                            {tx.source}
                                        </span>
                                        <span className="ml-2 opacity-60">{tx.description}</span>
                                    </td>
                                    <td className={`p-4 text-right font-mono font-bold ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                    </td>
                                    <td className="p-4 text-xs text-slate-500">
                                        {new Date(tx.created_at).toLocaleString()}
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

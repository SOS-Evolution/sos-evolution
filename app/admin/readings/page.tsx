import { createClient } from "@/lib/supabase/server";
import AdminReadingsClient, { AdminSpreadReading } from "@/components/admin/AdminReadingsClient";

export default async function AdminReadingsPage() {
    const supabase = await createClient();

    // Obtener últimas 100 tiradas vía RPC agrupada por spread_id
    const { data: readings, error } = await supabase.rpc('get_readings_list_admin', {
        p_limit: 100
    });

    if (error) {
        return (
            <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-red-200">
                <p className="font-bold text-lg mb-1">Error al cargar el historial de lecturas:</p>
                <p className="text-xs font-mono opacity-80">{error.message} (Código: {error.code})</p>
            </div>
        );
    }

    return (
        <AdminReadingsClient initialReadings={(readings || []) as AdminSpreadReading[]} />
    );
}

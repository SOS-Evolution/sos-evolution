import { createClient } from "@/lib/supabase/server";

export default async function UserDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = params.id;

    return (
        <div className="p-10 text-white">
            <h1 className="text-2xl font-bold">Debug: Vista de Usuario</h1>
            <p className="mt-4">ID del usuario: <span className="text-purple-400 font-mono">{userId}</span></p>
            <p className="mt-2 text-slate-400 font-serif italic">Si estás viendo esto, las rutas dinámicas están funcionando correctamente.</p>
        </div>
    );
}

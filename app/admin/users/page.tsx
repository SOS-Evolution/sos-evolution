import { createClient } from "@/lib/supabase/server";
import { AdminSearch } from "@/components/admin/AdminSearch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Shield, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || "";
    const currentPage = Number(searchParams?.page) || 1;
    const itemsPerPage = 10;
    const offset = (currentPage - 1) * itemsPerPage;

    const supabase = await createClient();

    // Llamada segura a la funcion RPC de admin
    const { data: users, error } = await supabase.rpc('get_users_list_admin', {
        p_limit: itemsPerPage,
        p_offset: offset,
        p_search: query
    });

    if (error) {
        console.error("Error fetching users:", error);
        return (
            <div className="text-red-400 p-4 border border-red-900/50 rounded bg-red-900/10">
                Error cargando usuarios: {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Gestión de Usuarios</h2>
                    <p className="text-slate-400 text-sm">Administra cuents, créditos y roles.</p>
                </div>
                <div className="w-full max-w-sm">
                    <AdminSearch placeholder="Buscar por nombre o email..." />
                </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b [&_tr]:border-slate-800">
                            <tr className="border-b border-slate-700 bg-slate-800/50 transition-colors hover:bg-slate-800/50 data-[state=selected]:bg-slate-800">
                                <th className="h-12 px-4 align-middle font-medium text-slate-400">Usuario</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400">Rol</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Créditos</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400 text-center">Lecturas</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400">Registro</th>
                                <th className="h-12 px-4 align-middle font-medium text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users && users.length > 0 ? (
                                users.map((user: any) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-800 transition-colors hover:bg-slate-800/30 data-[state=selected]:bg-slate-800"
                                    >
                                        <td className="p-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-200">{user.full_name || "Sin nombre"}</span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {user.role === 'admin' ? (
                                                <Badge variant="default" className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                                                    <ShieldAlert className="w-3 h-3 mr-1" /> Admin
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-slate-800 text-slate-400 hover:bg-slate-700">
                                                    <Shield className="w-3 h-3 mr-1" /> User
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-right font-mono font-medium text-yellow-500">
                                            {user.credit_balance} 🪙
                                        </td>
                                        <td className="p-4 align-middle text-center">
                                            <span className="inline-flex items-center justify-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                                                {user.readings_count}
                                            </span>
                                        </td>
                                        <td className="p-4 align-middle text-slate-400 text-xs">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            {/* El enlace de detalle lo implementaremos luego */}
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-500/20 hover:text-purple-400" asChild>
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginacion Simple */}
            <div className="flex items-center justify-between px-2">
                <p className="text-xs text-slate-500">Mostrando {users?.length || 0} usuarios</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={currentPage <= 1} className="h-8 text-xs bg-transparent border-slate-700 hover:bg-slate-800">
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" disabled className="h-8 text-xs bg-slate-800 border-slate-700">
                        {currentPage}
                    </Button>
                    <Button variant="outline" size="sm" disabled={!users || users.length < itemsPerPage} className="h-8 text-xs bg-transparent border-slate-700 hover:bg-slate-800">
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}

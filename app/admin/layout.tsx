import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/admin");
    }

    // Verificar rol de admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <html lang="es">
            <body className={`${inter.className} bg-slate-950`}>
                <Toaster position="top-right" richColors />
                <div className="flex h-screen overflow-hidden bg-slate-950 text-white font-sans">
                    <AdminSidebar />
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur">
                            <h1 className="text-sm uppercase tracking-widest text-slate-500 font-medium font-serif">Panel de Control</h1>
                            <div className="flex items-center gap-4">
                                {/* Aquí podrían ir notificaciones o info del admin */}
                                <div className="h-8 w-8 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                                    <span className="text-xs font-bold text-purple-400">A</span>
                                </div>
                            </div>
                        </header>
                        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            <div className="mx-auto max-w-6xl space-y-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}

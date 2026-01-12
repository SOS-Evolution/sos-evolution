"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard, History, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AppNavbar({ userEmail }: { userEmail: string }) {
    const pathname = usePathname(); // Para saber en qué página estamos
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/"); // Al salir, volvemos al Landing
        router.refresh();
    };

    // Función para saber si el link está activo (estilo visual)
    const isActive = (path: string) => pathname === path ? "bg-purple-900/40 text-white" : "text-purple-200 hover:text-white hover:bg-white/5";

    return (
        <nav className="w-full border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

                {/* LOGO (Clic lleva al Dashboard) */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="bg-purple-600/20 p-2 rounded-lg group-hover:bg-purple-600/40 transition-colors">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="font-serif tracking-widest text-purple-100 font-bold hidden sm:block">SOS EVOLUTION</span>
                </Link>

                {/* MENÚ CENTRAL */}
                <div className="flex items-center gap-1">
                    <Link href="/dashboard">
                        <Button variant="ghost" className={`gap-2 ${isActive("/dashboard")}`}>
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Panel</span>
                        </Button>
                    </Link>
                    <Link href="/historial">
                        <Button variant="ghost" className={`gap-2 ${isActive("/historial")}`}>
                            <History className="w-4 h-4" />
                            <span className="hidden sm:inline">Diario</span>
                        </Button>
                    </Link>
                </div>

                {/* USUARIO Y SALIR */}
                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 hidden md:block">{userEmail}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="text-red-300 hover:text-red-100 hover:bg-red-900/20"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Salir
                    </Button>
                </div>

            </div>
        </nav>
    );
}
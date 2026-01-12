"use client";

import { supabase } from "@/lib/supabase"; // <--- CORRECCIÓN: Importamos 'supabase' (la instancia), no createClient
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AuthButton({ user }: { user: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        // 1. Cerrar sesión usando la instancia 'supabase'
        await supabase.auth.signOut();
        // 2. Refrescar la página para limpiar caché
        router.refresh();
        setLoading(false);
    };

    if (!user) {
        // ESTADO: NO LOGUEADO
        return (
            <Link href="/login">
                <Button variant="ghost" className="text-purple-200 hover:text-white hover:bg-white/10 transition-colors">
                    <LogIn className="w-4 h-4 mr-2" />
                    Ingresar / Registro
                </Button>
            </Link>
        );
    }

    // ESTADO: LOGUEADO
    return (
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-purple-200 bg-purple-900/20 px-3 py-1 rounded-full border border-purple-500/30">
                <User className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{user.email}</span>
            </div>

            <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={loading}
                className="text-red-300 hover:text-red-100 hover:bg-red-900/20 transition-colors"
            >
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? "Saliendo..." : "Salir"}
            </Button>
        </div>
    );
}
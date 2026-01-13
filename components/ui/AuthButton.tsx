"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// IMPORTANTE: Importamos la acción del servidor
import { logout } from "@/app/login/actions";

export default function AuthButton({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            // Llamamos a la Server Action. 
            // Ella se encargará de borrar la cookie y redirigir.
            await logout();
        } catch (error) {
            console.error("Error al salir:", error);
            setLoading(false);
        }
    };

    if (!user) {
        // NO LOGUEADO
        return (
            <Link href="/login">
                <Button variant="ghost" className="text-purple-200 hover:text-white hover:bg-white/10 transition-colors">
                    <LogIn className="w-4 h-4 mr-2" />
                    Ingresar
                </Button>
            </Link>
        );
    }

    // LOGUEADO
    return (
        <div className="flex items-center gap-4">
            {/* Email del usuario */}
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                <User className="w-3 h-3 text-purple-400" />
                <span className="truncate max-w-[150px]">{user.email}</span>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={loading}
                className="text-red-300 hover:text-red-100 hover:bg-red-900/20 transition-colors"
            >
                <LogOut className="w-4 h-4 mr-2" />
                {loading ? "..." : "Salir"}
            </Button>
        </div>
    );
}
"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { LogIn, LogOut, User, KeyRound, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { logout } from "@/app/login/actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AuthButton({ user, profile }: { user: any, profile?: any }) {
    const [loading, setLoading] = useState(false);

    const router = useRouter();  // Asegúrate de que esto esté dentro del componente

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Error al salir:", error);
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Link href="/login">
                <Button variant="ghost" className="text-purple-200 hover:text-white hover:bg-white/10 transition-colors">
                    <LogIn className="w-4 h-4 mr-2" />
                    Ingresar
                </Button>
            </Link>
        );
    }

    // Lógica para mostrar nombre: Alias > Nombre Completo > Email (parte antes del @)
    const displayName = profile?.display_name || profile?.full_name?.split(' ')[0] || user.email?.split('@')[0];
    const fullName = profile?.full_name;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-3 py-1.5 h-auto rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white text-slate-400 transition-all group"
                >
                    <div className="bg-purple-500/10 p-1 rounded-full group-hover:bg-purple-500/20 transition-colors">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-xs font-medium max-w-[120px] truncate hidden md:block capitalize">
                        {displayName}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-black/90 backdrop-blur-xl border-white/10">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">Mi Cuenta</p>
                        {fullName && (
                            <p className="text-xs leading-none text-slate-300 truncate font-normal">
                                {fullName}
                            </p>
                        )}
                        <p className="text-xs leading-none text-slate-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white cursor-pointer group">
                    <Link href="/dashboard/profile/reset-password">
                        <KeyRound className="mr-2 h-4 w-4 text-purple-400 group-hover:text-purple-300" />
                        <span>Cambiar Contraseña</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={loading}
                    className="text-red-400 focus:text-red-300 focus:bg-red-900/10 cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{loading ? "Saliendo..." : "Cerrar Sesión"}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
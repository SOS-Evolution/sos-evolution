"use client";

import Link from "next/link";
import { Sparkles, LayoutDashboard, History } from "lucide-react";
import AuthButton from "@/components/ui/AuthButton";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar({ user }: { user: any }) {
    const pathname = usePathname();

    const isActive = (path: string) =>
        pathname === path
            ? "text-purple-400 bg-white/5"
            : "text-slate-400 hover:text-white hover:bg-white/5";

    return (
        // CAMBIO 1: Efecto Glassmorphism (Negro semitransparente + Blur)
        <nav className="w-full bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-300 supports-[backdrop-filter]:bg-black/40">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* --- LOGO --- */}
                <div className="flex items-center gap-6">
                    {/* CAMBIO 2: Link siempre va a la raíz "/" */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-purple-900/20 group-hover:shadow-purple-500/40 transition-all">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif text-lg font-bold tracking-wider text-white leading-none">SOS</span>
                            <span className="text-[0.6rem] text-purple-300 tracking-widest uppercase">Evolution</span>
                        </div>
                    </Link>

                    {/* Enlaces Centrales (Solo si hay usuario) */}
                    {user && (
                        <div className="hidden md:flex items-center gap-1 ml-4 border-l border-white/10 pl-6 h-8">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className={`gap-2 ${isActive("/dashboard")}`}>
                                    <LayoutDashboard className="w-4 h-4" />
                                    Panel
                                </Button>
                            </Link>
                            <Link href="/historial">
                                <Button variant="ghost" size="sm" className={`gap-2 ${isActive("/historial")}`}>
                                    <History className="w-4 h-4" />
                                    Diario
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* --- USUARIO / SALIR --- */}
                <div>
                    <AuthButton user={user} />
                </div>

            </div>
        </nav>
    );
}
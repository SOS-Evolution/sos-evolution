"use client";

import Link from "next/link";
import { Sparkles, Home, Layers, BookOpen } from "lucide-react";
import AuthButton from "@/components/ui/AuthButton";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Navbar({ user }: { user: any }) {
    const pathname = usePathname();

    const isActive = (path: string) =>
        pathname === path
            ? "text-purple-400 bg-white/10"
            : "text-slate-400 hover:text-white hover:bg-white/5";

    const navItems = [
        { href: "/dashboard", icon: Home, label: "Inicio" },
        { href: "/lectura", icon: Layers, label: "Lectura" },
        { href: "/historial", icon: BookOpen, label: "Diario" },
    ];

    return (
        <nav className="w-full bg-black/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 transition-all duration-300 supports-[backdrop-filter]:bg-black/40">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                {/* --- LOGO (Ahora circular) --- */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2.5 rounded-full shadow-lg shadow-purple-900/20 group-hover:shadow-purple-500/40 transition-all group-hover:scale-105">
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
                            {navItems.map((item, index) => (
                                <div key={item.href} className="flex items-center">
                                    {/* Separador después del primer elemento */}
                                    {index === 1 && (
                                        <div className="w-px h-4 bg-white/10 mx-2" />
                                    )}
                                    <Link href={item.href}>
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className={`gap-2 transition-all duration-200 ${isActive(item.href)}`}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.label}
                                            </Button>
                                        </motion.div>
                                    </Link>
                                </div>
                            ))}
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
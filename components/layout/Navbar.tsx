"use client";

import { Sparkles, Home, Layers, BookOpen, Star, Hash } from "lucide-react";
import AuthButton from "@/components/ui/AuthButton";
import { Link, usePathname } from "@/i18n/routing";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import CreditsDisplay from "@/components/dashboard/CreditsDisplay";
import { routing } from "@/i18n/routing";
import LocaleSwitcher from "./LocaleSwitcher";

type Pathname = keyof typeof routing.pathnames;

export default function Navbar({ user, role, profile }: { user: any, role?: string, profile?: any }) {
    const pathname = usePathname();
    const t = useTranslations('Navbar');

    const isActive = (path: string) =>
        pathname === path
            ? "text-purple-400 bg-white/10"
            : "text-slate-400 hover:text-white hover:bg-white/5";

    const isAdmin = role === 'admin';

    const navItems: { href: Pathname, icon: any, label: string }[] = isAdmin
        ? [
            { href: "/admin", icon: Layers, label: "Administrador" } as any,
            { href: "/dashboard", icon: Home, label: "SOS" },
        ]
        : [
            { href: "/dashboard", icon: Home, label: t('home') },
            { href: "/tarot", icon: Layers, label: t('tarot') },
            { href: "/historial", icon: BookOpen, label: t('history') },
            { href: "/astrology", icon: Star, label: t('astrology') },
            { href: "/numerology", icon: Hash, label: t('numerology') },
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
                                    {/* Separadores: Antes de Lectura (index 1) y Astrología (index 3) - Solo para clientes */}
                                    {!isAdmin && (index === 1 || index === 3) && (
                                        <div className="w-px h-4 bg-white/10 mx-2" />
                                    )}
                                    {/* Separador simple para Admin entre sus 2 items */}
                                    {isAdmin && index === 1 && (
                                        <div className="w-px h-4 bg-white/10 mx-2" />
                                    )}
                                    {item.href.startsWith('/admin') ? (
                                        <NextLink href={item.href}>
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
                                        </NextLink>
                                    ) : (
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
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- USUARIO / SALDOS --- */}
                <div className="flex items-center gap-4">
                    {user && <CreditsDisplay minimal />}
                    {!user && <LocaleSwitcher />}
                    <AuthButton user={user} profile={profile} />
                </div>

            </div>
        </nav>
    );
}
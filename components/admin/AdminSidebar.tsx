"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, ScrollText, LogOut, Settings, BookOpen, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/login/actions";
import { useState, useEffect } from "react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Usuarios",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Transacciones",
        href: "/admin/transactions",
        icon: CreditCard,
    },
    {
        title: "Lecturas",
        href: "/admin/readings",
        icon: ScrollText,
    },
    {
        title: "Documentación",
        href: "/admin/docs",
        icon: BookOpen,
        subItems: [
            { title: "Visión & Filosofía", href: "/admin/docs/vision" },
            { title: "Arquitectura", href: "/admin/docs/architecture" },
            { title: "Contenido Base", href: "/admin/docs/content" },
            { title: "Negocio", href: "/admin/docs/business" },
            { title: "Planificación", href: "/admin/docs/ideas" },
        ]
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [docsOpen, setDocsOpen] = useState(pathname.startsWith("/admin/docs"));

    // Mantener abierto si estamos en una subruta de docs
    useEffect(() => {
        if (pathname.startsWith("/admin/docs")) {
            setDocsOpen(true);
        }
    }, [pathname]);

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800">
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 uppercase tracking-wider">
                    SOS Admin
                </span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        const isDocs = item.title === "Documentación";
                        const hasSubItems = !!item.subItems;

                        return (
                            <div key={item.title} className="space-y-1">
                                <div className="flex items-center group">
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                            pathname === item.href || (isDocs && pathname.startsWith(item.href))
                                                ? "bg-purple-900/20 text-purple-400"
                                                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.title}
                                    </Link>

                                    {hasSubItems && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setDocsOpen(!docsOpen);
                                            }}
                                            className="px-2 py-2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", docsOpen && "rotate-180")} />
                                        </button>
                                    )}
                                </div>

                                {isDocs && docsOpen && item.subItems && (
                                    <div className="ml-9 space-y-1">
                                        {item.subItems.map((sub) => {
                                            const subActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    className={cn(
                                                        "block rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                                                        subActive
                                                            ? "text-purple-400"
                                                            : "text-slate-500 hover:text-slate-300"
                                                    )}
                                                >
                                                    {sub.title}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-900/10 hover:text-red-400"
                >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}

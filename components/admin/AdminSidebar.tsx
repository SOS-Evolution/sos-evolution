"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, ScrollText, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/app/login/actions";

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
    //   {
    //     title: "Configuración",
    //     href: "/admin/settings",
    //     icon: Settings,
    //   },
];

export function AdminSidebar() {
    const pathname = usePathname();

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
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-purple-900/20 text-purple-400"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </Link>
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

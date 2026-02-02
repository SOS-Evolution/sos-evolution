"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, Sparkle, Trophy, Coins } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { UserBalance } from "@/types";

export default function CreditsDisplay({ minimal = false }: { minimal?: boolean }) {
    const [balance, setBalance] = useState<number | null>(null);

    // Fetch credits
    useEffect(() => {
        fetch('/api/credits')
            .then(res => res.json())
            .then((data: UserBalance) => {
                if (data && typeof data.balance === 'number') {
                    setBalance(data.balance);
                }
            })
            .catch(err => console.error("Error fetching credits:", err));
    }, []);

    // Escuchar eventos de actualización de créditos (custom event)
    useEffect(() => {
        const handleUpdate = (e: any) => {
            if (e.detail?.newBalance !== undefined) {
                setBalance(e.detail.newBalance);
            }
        };
        window.addEventListener('credits-updated', handleUpdate);
        return () => window.removeEventListener('credits-updated', handleUpdate);
    }, []);

    if (minimal) {
        return (
            <div className="flex items-center gap-2 bg-purple-900/40 border border-purple-500/30 px-3 py-1.5 rounded-full text-sm font-medium text-purple-200">
                <Sparkle className="w-4 h-4 text-yellow-400" />
                <span>{balance !== null ? balance : "..."}</span>
            </div>
        );
    }

    return (
        <Link href="/purchase" className="block group h-full">
            <Card className="h-full bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-500/20 p-4 relative overflow-hidden group-hover:border-purple-500/40 transition-all group-hover:scale-[1.01] cursor-pointer">
                <div className="absolute top-1/2 -translate-y-1/2 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 duration-500">
                    <Sparkle className="w-16 h-16 text-yellow-500" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1 text-purple-300">
                        <Sparkle className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Aura de Evolución</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-white font-serif">
                            {balance !== null ? balance : "---"}
                        </span>
                        <span className="text-xs text-purple-200">Aura</span>
                    </div>

                    {/* Indicador visual de que es clickeable */}
                    <div className="mt-4 flex items-center gap-1.5 text-purple-400 group-hover:text-purple-300 transition-colors">
                        <Coins className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">Ofrenda Evolutiva - Recarga de aura</span>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

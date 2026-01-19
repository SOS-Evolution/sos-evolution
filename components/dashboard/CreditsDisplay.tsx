"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, Coins, Trophy } from "lucide-react";
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
                <Coins className="w-4 h-4 text-yellow-400" />
                <span>{balance !== null ? balance : "..."}</span>
            </div>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-indigo-950 to-purple-950 border-purple-500/20 p-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Coins className="w-16 h-16 text-yellow-500" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold">Saldo Místico</span>
                </div>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-white font-serif">
                        {balance !== null ? balance : "---"}
                    </span>
                    <span className="text-xs text-purple-200">créditos</span>
                </div>

                {/* Botones eliminados para ahorrar espacio a petición del usuario */}
            </div>
        </Card>
    );
}

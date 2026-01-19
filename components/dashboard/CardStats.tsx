"use client";

import { Card } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface CardStatsProps {
    stats: {
        card_name: string;
        times_drawn: number;
    } | null;
    className?: string; // Prop opcional para estilos extra
}

export default function CardStats({ stats, className }: CardStatsProps) {
    return (
        <Card className={cn("bg-slate-900/50 border-white/5 p-6 flex items-center justify-between", className)}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-sm text-slate-400 font-medium">Carta Recurrente</h3>
                    <p className="text-xl font-bold text-white font-serif mt-0.5">
                        {stats?.card_name || "---"}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xs text-slate-500 block mb-1">Frecuencia</span>
                <span className="text-lg font-mono text-indigo-300">
                    {stats?.times_drawn || 0}
                </span>
            </div>
        </Card>
    );
}

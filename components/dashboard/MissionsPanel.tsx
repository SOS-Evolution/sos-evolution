"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle, Trophy, Lock } from "lucide-react";
import type { UserMission } from "@/types";
import { cn } from "@/lib/utils";

export default function MissionsPanel() {
    const [missions, setMissions] = useState<UserMission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/missions')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setMissions(data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    // Ordenar: Completadas al final, Activas primero
    const sortedMissions = [...missions].sort((a, b) => {
        if (a.completed === b.completed) return (a.mission?.sort_order || 0) - (b.mission?.sort_order || 0);
        return a.completed ? 1 : -1;
    });

    if (loading) return <div className="animate-pulse h-48 bg-white/5 rounded-xl"></div>;

    return (
        <Card className="bg-slate-900/50 border-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="text-lg font-serif text-white">Misiones & Recompensas</h3>
            </div>

            <div className="space-y-4">
                {sortedMissions.map((um) => (
                    <div
                        key={um.id}
                        className={cn(
                            "flex items-center gap-4 p-4 rounded-xl border transition-all",
                            um.completed
                                ? "bg-slate-900/50 border-white/5 opacity-60"
                                : "bg-gradient-to-r from-purple-900/20 to-slate-900/40 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-900/30"
                        )}
                    >
                        <div className="flex-shrink-0">
                            {um.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500/80" />
                            ) : (
                                <div className="relative">
                                    <Circle className="w-6 h-6 text-slate-600" />
                                    {um.progress > 0 && (
                                        <svg className="absolute top-0 left-0 w-6 h-6 rotate-[-90deg]">
                                            <circle
                                                cx="12" cy="12" r="10"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="text-purple-500"
                                                strokeDasharray="63"
                                                strokeDashoffset={63 - (63 * (um.progress / um.target))}
                                            />
                                        </svg>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className={cn("font-medium truncate", um.completed ? "text-slate-400 line-through" : "text-slate-200")}>
                                {um.mission?.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate">{um.mission?.description}</p>

                            {!um.completed && um.target > 1 && (
                                <div className="mt-1.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${(um.progress / um.target) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex-shrink-0 flex flex-col items-end">
                            <span className={cn(
                                "text-xs font-bold px-2 py-1 rounded-md border",
                                um.completed
                                    ? "bg-slate-800 text-slate-500 border-transparent"
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            )}>
                                +{um.mission?.reward_credits} ✨
                            </span>
                        </div>
                    </div>
                ))}

                {sortedMissions.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic text-sm">
                        No hay misiones disponibles.
                    </div>
                )}
            </div>
        </Card>
    );
}

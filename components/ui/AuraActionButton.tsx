"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AuraActionButtonProps {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    cost: number;
    label: string;
    icon?: ReactNode;
    className?: string;
    badgeLabel?: string; // Optional: "Aura" or translation
}

export default function AuraActionButton({
    onClick,
    disabled = false,
    loading = false,
    cost,
    label,
    icon,
    className,
    badgeLabel = ""
}: AuraActionButtonProps) {
    return (
        <Button
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                "relative group px-8 py-6 rounded-2xl",
                "bg-gradient-to-r from-indigo-600 to-purple-600",
                "hover:from-indigo-500 hover:to-purple-500",
                "text-white font-bold shadow-xl shadow-indigo-500/20",
                "transition-all hover:scale-105 active:scale-95",
                className
            )}
        >
            {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : icon ? (
                <div className="mr-2 group-hover:rotate-12 transition-transform">
                    {icon}
                </div>
            ) : null}
            {label}

            {/* Price Badge */}
            <div className="absolute -top-3 -right-3 bg-yellow-500 text-black text-xs px-2.5 py-1 rounded-full font-black flex items-center gap-1.5 shadow-[0_4px_10px_rgba(234,179,8,0.3)] z-10 border border-yellow-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="leading-none pb-[1px]">{cost}{badgeLabel ? ` ${badgeLabel}` : ''}</span>
            </div>
        </Button>
    );
}

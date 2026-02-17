"use client";

import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

// Confetti sencillo con CSS puro (sin dependencias externas)
function CSSConfetti() {
    const colors = ["#fbbf24", "#a855f7", "#ec4899", "#3b82f6", "#10b981", "#f97316"];
    const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
        duration: `${2 + Math.random() * 3}s`,
        size: `${4 + Math.random() * 6}px`,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            {pieces.map((p) => (
                <span
                    key={p.id}
                    className="absolute top-0 animate-confetti-fall"
                    style={{
                        left: p.left,
                        animationDelay: p.delay,
                        animationDuration: p.duration,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    }}
                />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti-fall {
                    animation-name: confetti-fall;
                    animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
}

interface RewardPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    credits: number;
    icon?: string;
}

export default function RewardPopup({ isOpen, onClose, title, description, credits, icon = "🎉" }: RewardPopupProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(timer);
        } else {
            setShowConfetti(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {showConfetti && <CSSConfetti />}

            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md bg-slate-900/95 backdrop-blur-xl border-yellow-500/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                    <DialogTitle className="sr-only">Recompensa</DialogTitle>
                    {/* Brillo de fondo */}
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-transparent rounded-3xl pointer-events-none" />

                    {/* Icono Flotante */}
                    <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-yellow-500/20 text-5xl border-4 border-slate-900 ring-4 ring-yellow-500/20 animate-bounce">
                        {icon}
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white mb-2">
                        ¡Misión Completada!
                    </h2>
                    <h3 className="text-yellow-400 font-bold text-lg mb-4">{title}</h3>

                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                        {description}
                    </p>

                    <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-white/5 flex flex-col items-center">
                        <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">Recompensa</span>
                        <div className="flex items-center gap-2 text-2xl font-bold text-yellow-500">
                            <Sparkles className="w-5 h-5 fill-yellow-500" />
                            +{credits} AURA
                        </div>
                    </div>

                    <Button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-bold py-6 rounded-xl shadow-lg shadow-yellow-600/20 transition-all hover:scale-[1.02]"
                    >
                        ¡Genial! Continuar
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}

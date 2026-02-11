"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TarotFrameId, GoldenClassicFrame, MysticSilverFrame, CelestialFrame, GoldenOrnateFrame } from "./frames";
import { useConfig } from "@/components/providers/ConfigProvider";

interface TarotCardProps {
    cardName?: string;
    imageUrl?: string;
    isRevealed: boolean;
    onClick: () => void;
    frameId?: TarotFrameId;
    layoutId?: string;  // Para transiciones compartidas entre componentes
    label?: string;      // Etiqueta para tiradas (ej: "Pasado", "Presente", "Futuro")
    className?: string;
}

export const DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
];

export function TarotCard({ cardName, imageUrl, isRevealed, onClick, frameId, layoutId, label, className }: TarotCardProps) {
    const { tarotFrame } = useConfig();
    const activeFrameId = frameId || tarotFrame;
    const resolvedImageUrl = imageUrl || (cardName ? `/assets/tarot/arcano-${DECK.indexOf(cardName)}.jpg` : null);

    const renderFrame = () => {
        switch (activeFrameId) {
            case "mystic":
                return <MysticSilverFrame className="absolute inset-0 z-20 pointer-events-none w-full h-full" />;
            case "classic":
                return <GoldenClassicFrame className="absolute inset-0 z-20 pointer-events-none w-full h-full" />;
            case "ornate":
                return <GoldenOrnateFrame className="absolute inset-0 z-20 pointer-events-none w-full h-full" />;
            case "celestial":
            default:
                return <CelestialFrame className="absolute inset-0 z-20 pointer-events-none w-full h-full" />;
        }
    };

    return (
        <div className={cn("flex flex-col items-center gap-3", className)}>
            {/* Etiqueta de posición (para tiradas multi-carta) */}
            {label && (
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-bold text-purple-400 uppercase tracking-widest"
                >
                    {label}
                </motion.span>
            )}

            <motion.div
                layoutId={layoutId}
                className="relative w-64 h-96 perspective-1000 cursor-pointer group"
                onClick={onClick}
            >
                <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: isRevealed ? 180 : 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* REVERSO DE LA CARTA */}
                    <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-slate-900 border-2 border-purple-500/30 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                        <div className="flex flex-col items-center gap-2 relative z-10">
                            <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
                            <span className="text-purple-200 font-serif tracking-[0.3em] text-sm font-bold">SOS</span>
                        </div>
                    </div>

                    {/* FRENTE DE LA CARTA */}
                    <div
                        className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-slate-950 overflow-hidden"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        {renderFrame()}

                        {resolvedImageUrl && (DECK.includes(cardName || "")) ? (
                            <div className="relative w-full h-full z-10 p-[4px]">
                                <img
                                    src={resolvedImageUrl}
                                    alt={cardName}
                                    className="w-full h-full object-cover rounded-[10px]"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.parentElement!.querySelector('.placeholder')?.classList.remove('hidden');
                                    }}
                                />
                            </div>
                        ) : null}

                        {/* Placeholder */}
                        <div className={cn(
                            "placeholder absolute inset-0 z-0 w-full h-full flex flex-col items-center justify-center bg-slate-900 p-4 text-center",
                            resolvedImageUrl && (DECK.includes(cardName || "")) ? "hidden" : ""
                        )}>
                            <h3 className="text-xl font-bold text-slate-200 font-serif mb-2">{cardName || "El Misterio"}</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest">Arcano Mayor</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

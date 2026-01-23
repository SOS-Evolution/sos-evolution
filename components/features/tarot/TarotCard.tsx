"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TarotCardProps {
    cardName?: string;
    imageUrl?: string; // URL de la imagen (DALL-E o assets fijos)
    isRevealed: boolean;
    onClick: () => void;
}

const DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
];

export function TarotCard({ cardName, imageUrl, isRevealed, onClick }: TarotCardProps) {
    // Intentar resolver la imagen si no se proporciona una
    const resolvedImageUrl = imageUrl || (cardName ? `/assets/tarot/arcano-${DECK.indexOf(cardName)}.jpg` : null);

    return (
        <div className="relative w-64 h-96 perspective-1000 cursor-pointer" onClick={onClick}>
            <motion.div
                className="w-full h-full relative preserve-3d"
                animate={{ rotateY: isRevealed ? 180 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* REVERSO DE LA CARTA (Diseño Místico) */}
                <div className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-slate-900 border-2 border-purple-500/30 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <div className="flex flex-col items-center gap-2">
                        <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
                        <span className="text-purple-200 font-serif tracking-widest text-sm">S.O.S</span>
                    </div>
                </div>

                {/* FRENTE DE LA CARTA (Revelación) */}
                <div
                    className="absolute w-full h-full backface-hidden rounded-xl shadow-2xl bg-slate-100 overflow-hidden border-4 border-gold-500"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    {resolvedImageUrl && (DECK.includes(cardName || "")) ? (
                        <img
                            src={resolvedImageUrl}
                            alt={cardName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Si falla la carga, ocultamos la imagen para mostrar el placeholder
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.querySelector('.placeholder')?.classList.remove('hidden');
                            }}
                        />
                    ) : null}

                    {/* Placeholder mientras no hay imagen o si falla la carga */}
                    <div className={`placeholder ${resolvedImageUrl && (DECK.includes(cardName || "")) ? 'hidden' : ''} w-full h-full flex flex-col items-center justify-center bg-slate-200 p-4 text-center`}>
                        <h3 className="text-xl font-bold text-slate-800 font-serif">{cardName || "El Misterio"}</h3>
                        <p className="text-xs text-slate-500 mt-2">Arcano Mayor</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
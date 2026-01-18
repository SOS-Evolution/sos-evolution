"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TarotDeckProps {
    onSelectCard: (cardIndex: number) => void;
    disabled?: boolean;
}

const DECK_SIZE = 22;

export default function TarotDeck({ onSelectCard, disabled = false }: TarotDeckProps) {
    return (
        <div className="flex flex-col items-center gap-6">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-serif text-white text-center"
            >
                Elige una <span className="text-gradient-purple">Carta</span>
            </motion.h2>

            {/* Abanico de 360° con espacio en el centro */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="relative w-full max-w-[600px] h-[400px] md:h-[600px]"
            >
                {Array.from({ length: DECK_SIZE }).map((_, index) => {
                    // Abanico de 325 grados para dejar hueco visible
                    const totalDegrees = 325;
                    const anglePerCard = totalDegrees / (DECK_SIZE - 1);
                    // Centrar el abanico rotando el inicio
                    const startRotation = -totalDegrees / 2;
                    const rotation = startRotation + (anglePerCard * index);

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, rotate: 0, scale: 0 }}
                            animate={{ opacity: 1, rotate: rotation, scale: 1 }}
                            transition={{
                                delay: index * 0.03, // Un poco más rápido el deal inicial también
                                type: "spring",
                                stiffness: 260, // Mucho más rígido para un retorno "snappy"
                                damping: 20
                            }}
                            whileHover={
                                !disabled
                                    ? {
                                        scale: 1.15,
                                        zIndex: 100,
                                        transition: { duration: 0.15 }, // Hover in rápido
                                    }
                                    : {}
                            }
                            whileTap={!disabled ? { scale: 0.95 } : {}}
                            onClick={() => !disabled && onSelectCard(index)}
                            className={`absolute left-1/2 top-1/2 -translate-x-1/2 cursor-pointer ${disabled ? "pointer-events-none" : ""}`}
                            style={{
                                transformOrigin: "center bottom",
                                zIndex: index,
                            }}
                        >
                            {/* Card Back - Proporciones reales y más grandes, con offset del centro */}
                            <div
                                className={`
                                    w-[90px] h-[135px] md:w-[110px] md:h-[165px]
                                    -mt-[180px] md:-mt-[220px]
                                    bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950
                                    border-2 border-purple-500/50
                                    rounded-xl shadow-lg
                                    flex flex-col items-center justify-center gap-1
                                    transition-all duration-200
                                    hover:border-purple-400 hover:shadow-purple-500/40 hover:shadow-xl
                                `}
                            >
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-500/70" />
                                <span className="text-purple-400/70 text-[9px] md:text-[10px] font-bold tracking-wider">
                                    S.O.S
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-slate-500 text-sm text-center"
            >
                Confía en tu intuición y selecciona la carta que te llame
            </motion.p>
        </div>
    );
}

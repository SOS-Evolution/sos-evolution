"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface TarotDeckProps {
    onSelectCard: (cardIndex: number) => void;
    disabled?: boolean;
}

const DECK_SIZE = 22;

export default function TarotDeck({ onSelectCard, disabled = false }: TarotDeckProps) {
    const [isShuffling, setIsShuffling] = useState(true);

    // Generar índices mezclados solo una vez al montar
    const shuffledIndices = useMemo(() => {
        return Array.from({ length: DECK_SIZE })
            .map((_, i) => i)
            .sort(() => Math.random() - 0.5);
    }, []);

    // Duración de la animación de barajado
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShuffling(false);
        }, 2500); // 2.5 segundos de barajado
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center gap-6 overflow-hidden py-10">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-serif text-white text-center z-50"
            >
                {isShuffling ? (
                    <span className="flex items-center gap-3">
                        Barajando el <span className="text-gradient-purple">Destino</span>...
                    </span>
                ) : (
                    <>Elige una <span className="text-gradient-purple">Carta</span></>
                )}
            </motion.h2>

            <div className="relative w-full max-w-[600px] h-[400px] md:h-[600px] flex items-center justify-center">
                {shuffledIndices.map((originalIndex, visualIndex) => {
                    // Lógica del abanico con más espacio en la entrada de abajo
                    const totalDegrees = 300; // Reducido de 325 para dejar espacio en la parte inferior
                    const anglePerCard = totalDegrees / (DECK_SIZE - 1);
                    const startRotation = -totalDegrees / 2;
                    const finalRotation = startRotation + (anglePerCard * visualIndex);

                    // Valores aleatorios únicos por carta para el shuffle
                    const shuffleX = (Math.random() - 0.5) * 120;
                    const shuffleY = (Math.random() - 0.5) * 120;
                    const shuffleRotate = (Math.random() - 0.5) * 180;
                    const shuffleScale = 0.8 + Math.random() * 0.4;

                    // Variantes de animación mejoradas
                    const variants = {
                        shuffle: {
                            x: [0, shuffleX, -shuffleX * 0.5, shuffleX * 0.7, 0],
                            y: [0, shuffleY, -shuffleY * 0.6, shuffleY * 0.4, 0],
                            rotate: [0, shuffleRotate, -shuffleRotate * 0.7, shuffleRotate * 0.5, 0],
                            scale: [1, shuffleScale, 1.2, shuffleScale * 0.9, 1],
                            zIndex: Math.floor(Math.random() * 50),
                            transition: {
                                duration: 0.85,
                                repeat: 2,
                                repeatType: "mirror" as const,
                                ease: [0.43, 0.13, 0.23, 0.96],
                                times: [0, 0.25, 0.5, 0.75, 1]
                            }
                        },
                        fan: {
                            x: 0,
                            y: 0,
                            rotate: finalRotation,
                            scale: 1,
                            zIndex: visualIndex,
                            transition: {
                                delay: visualIndex * 0.04,
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                            }
                        }
                    };

                    return (
                        <motion.div
                            key={originalIndex}
                            variants={variants}
                            animate={isShuffling ? "shuffle" : "fan"}
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            whileHover={
                                !disabled && !isShuffling
                                    ? {
                                        scale: 1.2,
                                        y: -40,
                                        zIndex: 100,
                                        transition: { duration: 0.2 }
                                    }
                                    : {}
                            }
                            whileTap={!disabled && !isShuffling ? { scale: 0.95 } : {}}
                            onClick={() => !disabled && !isShuffling && onSelectCard(originalIndex)}
                            className={`absolute cursor-pointer ${disabled || isShuffling ? "pointer-events-none" : ""}`}
                            style={{
                                transformOrigin: "center bottom",
                            }}
                        >
                            <div
                                className={`
                                    relative
                                    w-[90px] h-[135px] md:w-[110px] md:h-[165px]
                                    ${!isShuffling ? "-mt-[220px] md:-mt-[260px]" : ""}
                                    bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950
                                    border-2 border-purple-500/50
                                    rounded-xl shadow-2xl
                                    flex flex-col items-center justify-center gap-1
                                    transition-all duration-300
                                    hover:border-purple-400 hover:shadow-purple-500/40
                                    overflow-hidden
                                `}
                            >
                                {/* Brillo místico interno */}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />

                                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-500/70 relative z-10" />
                                <span className="text-purple-400/70 text-[9px] md:text-[10px] font-bold tracking-[0.3em] relative z-10">
                                    SOS
                                </span>

                                {/* Patrón de fondo sutil */}
                                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isShuffling ? 0 : 1 }}
                transition={{ delay: 1 }}
                className="text-slate-500 text-sm text-center italic"
            >
                La sincronicidad guiará tu mano...
            </motion.p>
        </div>
    );
}

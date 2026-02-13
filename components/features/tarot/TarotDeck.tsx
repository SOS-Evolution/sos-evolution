"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";
import { useTranslations } from 'next-intl';

interface TarotDeckProps {
    onSelectCard: (cardIndex: number) => void;
    onSelectionComplete?: (selectedCards: number[]) => void;
    disabled?: boolean;
    maxSelections?: number;  // 1 para básica, 3 para clásica
    selectedCards?: number[];  // Cartas ya seleccionadas (controlado externamente)
    animatingCards?: number[];  // Cartas que se están animando al centro
    fadeOthers?: boolean;  // Si true, las cartas no seleccionadas hacen fade out
}

const DECK_SIZE = 22;

export const CARD_SIZE = {
    mobile: { width: 90, height: 135 },
    desktop: { width: 110, height: 165 }
};

export default function TarotDeck({
    onSelectCard,
    onSelectionComplete,
    disabled = false,
    maxSelections = 1,
    selectedCards = [],
    animatingCards = [],
    fadeOthers = false
}: TarotDeckProps) {
    const t = useTranslations('TarotDeck');
    const [isShuffling, setIsShuffling] = useState(true);
    const [internalSelected, setInternalSelected] = useState<number[]>([]);

    // Usar selección externa si se provee, sino usar interna
    const currentSelected = selectedCards.length > 0 ? selectedCards : internalSelected;

    // Generar índices mezclados solo una vez al montar
    const shuffledIndices = useMemo(() => {
        return Array.from({ length: DECK_SIZE })
            .map((_, i) => i)
            .sort(() => Math.random() - 0.5);
    }, []);

    // Valores aleatorios para shuffle - memorizados para evitar recálculos
    const shuffleValues = useMemo(() => {
        return shuffledIndices.map(() => ({
            x: (Math.random() - 0.5) * 120,
            y: (Math.random() - 0.5) * 120,
            rotate: (Math.random() - 0.5) * 180,
            scale: 0.8 + Math.random() * 0.4
        }));
    }, [shuffledIndices]);

    // Duración de la animación de barajado
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsShuffling(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    // Detectar móvil para ajustar el abanico
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleCardClick = (cardIndex: number) => {
        if (disabled || isShuffling) return;

        // Verificar si ya está seleccionada
        if (currentSelected.includes(cardIndex)) return;

        // Verificar si ya se alcanzó el máximo
        if (currentSelected.length >= maxSelections) return;

        const newSelected = [...internalSelected, cardIndex];
        setInternalSelected(newSelected);
        onSelectCard(cardIndex);

        // Si se completó la selección, notificar con un ligero retraso para ver la animación
        if (newSelected.length >= maxSelections && onSelectionComplete) {
            setTimeout(() => {
                onSelectionComplete(newSelected);
            }, 1000);
        }
    };

    const isCardSelected = (cardIndex: number) => currentSelected.includes(cardIndex);
    const isCardAnimating = (cardIndex: number) => animatingCards.includes(cardIndex);

    // Calcular título dinámico
    const getTitle = () => {
        if (isShuffling) {
            return (
                <span className="flex items-center gap-3">
                    {t.rich('shuffling', {
                        span: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                    })}
                </span>
            );
        }
        if (maxSelections === 1) {
            return <>{t.rich('choose_card', {
                span: (chunks) => <span className="text-gradient-purple">{chunks}</span>
            })}</>;
        }
        const remaining = maxSelections - currentSelected.length;
        if (remaining === 0) {
            return <span className="text-gradient-purple">{t('selected')}</span>;
        }
        return (
            <>
                {t.rich('choose_more', {
                    count: remaining,
                    span: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                })}
            </>
        );
    };

    return (
        <div className="flex flex-col items-center gap-6 overflow-hidden md:overflow-visible py-10 w-full">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-serif text-white text-center z-50 pointer-events-none"
            >
                {getTitle()}
            </motion.h2>

            <div className="relative w-full max-w-[350px] md:max-w-4xl h-[400px] md:h-[600px] flex items-center justify-center scale-90 md:scale-100 origin-center perspective-1000">
                <AnimatePresence>
                    {shuffledIndices.map((originalIndex, visualIndex) => {
                        const isSelected = isCardSelected(originalIndex);
                        const isAnimating = isCardAnimating(originalIndex);
                        const shuffleVal = shuffleValues[visualIndex];

                        // Si la carta está animando al centro, no renderizar aquí
                        if (isAnimating) return null;

                        // Lógica del abanico
                        const totalDegrees = 300; // Ángulo unificado para móvil y escritorio
                        const anglePerCard = totalDegrees / (DECK_SIZE - 1);
                        const startRotation = -totalDegrees / 2;
                        const finalRotation = startRotation + (anglePerCard * visualIndex);

                        // Si fadeOthers está activo y la carta no está seleccionada, hacer fade
                        const shouldFade = fadeOthers && !isSelected;

                        const variants = {
                            shuffle: {
                                x: [0, shuffleVal.x, -shuffleVal.x * 0.5, shuffleVal.x * 0.7, 0],
                                y: [0, shuffleVal.y, -shuffleVal.y * 0.6, shuffleVal.y * 0.4, 0],
                                rotate: [0, shuffleVal.rotate, -shuffleVal.rotate * 0.7, shuffleVal.rotate * 0.5, 0],
                                scale: [1, shuffleVal.scale, 1.2, shuffleVal.scale * 0.9, 1],
                                opacity: 1,
                                zIndex: Math.floor(Math.random() * 50),
                                transition: {
                                    duration: 0.85,
                                    repeat: 2,
                                    repeatType: "mirror" as const,
                                    ease: "easeOut",
                                    times: [0, 0.25, 0.5, 0.75, 1]
                                }
                            },
                            fan: {
                                x: 0,
                                y: isSelected ? (isMobile ? -60 : -100) : 0,
                                rotate: isSelected ? 0 : finalRotation,
                                scale: isSelected ? 1.3 : 1,
                                opacity: shouldFade ? 0 : 1,
                                zIndex: isSelected ? 100 : visualIndex,
                                transition: {
                                    delay: isSelected ? 0 : visualIndex * 0.04,
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20
                                }
                            },
                            exit: {
                                opacity: 0,
                                scale: 0.8,
                                transition: { duration: 0.3 }
                            }
                        };

                        return (
                            <motion.div
                                key={originalIndex}
                                layoutId={`tarot-card-${originalIndex}`}
                                variants={variants as any}
                                animate={isShuffling ? "shuffle" : "fan"}
                                exit="exit"
                                initial={{ scale: 0, opacity: 0 }}
                                whileInView={{ opacity: shouldFade ? 0 : 1, scale: 1 }}
                                whileHover={
                                    !disabled && !isShuffling && !isSelected && currentSelected.length < maxSelections
                                        ? {
                                            scale: 1.2,
                                            y: -40,
                                            zIndex: 100,
                                            transition: { duration: 0.2 }
                                        }
                                        : {}
                                }
                                whileTap={!disabled && !isShuffling && !isSelected ? {
                                    scale: 1.15,
                                    y: -20,
                                    transition: { duration: 0.15 }
                                } : {}}
                                onClick={() => handleCardClick(originalIndex)}
                                className={`absolute cursor-pointer ${disabled || isShuffling || isSelected || currentSelected.length >= maxSelections ? "pointer-events-none" : ""}`}
                                style={{
                                    transformOrigin: "center bottom",
                                    touchAction: "manipulation"
                                }}
                            >
                                <div
                                    className={`
                                        relative
                                        w-[90px] h-[135px] md:w-[110px] md:h-[165px]
                                        ${!isShuffling ? "-mt-[160px] md:-mt-[260px]" : ""}
                                        bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950
                                        border-2 
                                        ${isSelected
                                            ? "border-purple-400 shadow-purple-500/60"
                                            : "border-purple-500/50 hover:border-purple-400 hover:shadow-purple-500/60"
                                        }
                                        rounded-xl shadow-2xl
                                        flex flex-col items-center justify-center gap-1
                                        transition-all duration-300
                                        active:border-purple-300 active:shadow-purple-400/80
                                        overflow-hidden
                                    `}
                                >
                                    {/* Glow de selección */}
                                    {isSelected && (
                                        <motion.div
                                            className="absolute inset-0 bg-purple-500/20 rounded-xl"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0.2, 0.4, 0.2] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}

                                    {/* Brillo místico interno */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />

                                    {/* Badge de selección (para multi-selección) */}
                                    {isSelected && maxSelections > 1 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center z-20"
                                        >
                                            <Check className="w-3 h-3 text-white" />
                                        </motion.div>
                                    )}

                                    <Sparkles className={`w-5 h-5 md:w-6 md:h-6 relative z-10 ${isSelected ? "text-purple-400" : "text-purple-500/70"}`} />
                                    <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.3em] relative z-10 ${isSelected ? "text-purple-300" : "text-purple-400/70"}`}>
                                        SOS
                                    </span>

                                    {/* Patrón de fondo sutil */}
                                    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isShuffling ? 0 : 1 }}
                transition={{ delay: 1 }}
                className="text-slate-500 text-sm text-center italic"
            >
                {maxSelections > 1
                    ? t('select_order')
                    : t('synchronicity')
                }
            </motion.p>
        </div>
    );
}

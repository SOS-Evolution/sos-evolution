"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from 'next-intl';

export interface TarotDeckProps {
    onSelectCard: (cardIndex: number) => void;
    onDeselectCard?: (cardIndex: number) => void;
    onSelectionComplete?: (selectedCards: number[]) => void;
    disabled?: boolean;
    maxSelections?: number; // 1 para básica, 3 para clásica, 5 para cruzada
    selectedCards?: number[]; // Cartas ya seleccionadas (controlado externamente)
    animatingCards?: number[]; // Cartas que se están animando al centro
    fadeOthers?: boolean; // Si true, las cartas no seleccionadas hacen fade out
    slotLabels?: string[]; // Nombres o etiquetas para los slots de selección
}

const DECK_SIZE = 22;

export const CARD_SIZE = {
    mobile: { width: 90, height: 135 },
    desktop: { width: 110, height: 165 }
};

/**
 * Calcula dinámicamente las coordenadas y escalas de las cartas seleccionadas
 * para que nunca se amontonen una encima de la otra, adaptándose a 1, 3, 5 o más cartas.
 */
export function getSelectedCardPosition(
    selIndex: number,
    totalCards: number,
    isMobile: boolean
) {
    if (totalCards <= 1) {
        return {
            x: 0,
            y: isMobile ? -65 : -110,
            scale: isMobile ? 1.2 : 1.3,
            rotate: 0
        };
    }

    const centerIndex = (totalCards - 1) / 2;
    const offset = selIndex - centerIndex;

    let spacing: number;
    let scale: number;
    let yOffset: number;

    if (isMobile) {
        if (totalCards <= 3) {
            spacing = 84;
            scale = 0.86;
            yOffset = -75;
        } else {
            // 4, 5+ cartas en pantallas móviles
            spacing = 56;
            scale = 0.70;
            yOffset = -75;
        }
    } else {
        if (totalCards <= 3) {
            spacing = 140;
            scale = 1.1;
            yOffset = -120;
        } else {
            // 4, 5+ cartas en pantallas de escritorio
            spacing = 114;
            scale = 0.90;
            yOffset = -125;
        }
    }

    return {
        x: offset * spacing,
        y: yOffset,
        scale,
        rotate: 0
    };
}

export default function TarotDeck({
    onSelectCard,
    onDeselectCard,
    onSelectionComplete,
    disabled = false,
    maxSelections = 1,
    selectedCards = [],
    animatingCards = [],
    fadeOthers = false,
    slotLabels = []
}: TarotDeckProps) {
    const t = useTranslations('TarotDeck');
    const [isShuffling, setIsShuffling] = useState(true);
    const [internalSelected, setInternalSelected] = useState<number[]>([]);

    // Mantener sincronizado el estado interno cuando cambie externamente
    useEffect(() => {
        if (selectedCards) {
            setInternalSelected(selectedCards);
        }
    }, [selectedCards]);

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

        // Si ya está seleccionada y aún no se completó la tirada, permitir deseleccionar
        if (currentSelected.includes(cardIndex)) {
            if (currentSelected.length < maxSelections) {
                const newSelected = currentSelected.filter(id => id !== cardIndex);
                setInternalSelected(newSelected);
                onDeselectCard?.(cardIndex);
            }
            return;
        }

        // Verificar si ya se alcanzó el máximo
        if (currentSelected.length >= maxSelections) return;

        const newSelected = [...currentSelected, cardIndex];
        setInternalSelected(newSelected);
        onSelectCard(cardIndex);

        // Si se completó la selección, notificar con un ligero retraso para apreciar la animación
        if (newSelected.length >= maxSelections && onSelectionComplete) {
            setTimeout(() => {
                onSelectionComplete(newSelected);
            }, 1200);
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

                {/* Ranuras guía para lecturas multi-carta (1 a 5 cartas) */}
                {!isShuffling && maxSelections > 1 && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {Array.from({ length: maxSelections }).map((_, slotIdx) => {
                            const isFilled = currentSelected.length > slotIdx;
                            const pos = getSelectedCardPosition(slotIdx, maxSelections, isMobile);
                            const label = slotLabels?.[slotIdx] || t('slot_card', { number: slotIdx + 1 });

                            return (
                                <motion.div
                                    key={`slot-${slotIdx}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: pos.scale }}
                                    transition={{ delay: 0.15 + slotIdx * 0.05, duration: 0.4 }}
                                    className="absolute flex flex-col items-center justify-center"
                                    style={{
                                        transformOrigin: "center center",
                                        x: pos.x,
                                        y: pos.y,
                                    }}
                                >
                                    <div
                                        className={`
                                            relative
                                            w-[90px] h-[135px] md:w-[110px] md:h-[165px]
                                            ${!isShuffling ? "-mt-[160px] md:-mt-[260px]" : ""}
                                            rounded-xl border-2 border-dashed
                                            flex flex-col items-center justify-center gap-1 p-2
                                            transition-all duration-500
                                            ${isFilled
                                                ? "border-purple-500/40 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                                                : "border-purple-500/25 bg-slate-900/40 shadow-inner backdrop-blur-[2px]"
                                            }
                                        `}
                                    >
                                        {!isFilled && (
                                            <>
                                                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-purple-400/40 bg-purple-500/10 flex items-center justify-center text-[10px] md:text-xs font-mono font-bold text-purple-300">
                                                    {slotIdx + 1}
                                                </div>
                                                <span className="text-[9px] md:text-[11px] font-serif text-purple-300/70 text-center leading-tight line-clamp-2 px-1">
                                                    {label}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* Mazo de cartas desplegado */}
                <AnimatePresence>
                    {shuffledIndices.map((originalIndex, visualIndex) => {
                        const isSelected = isCardSelected(originalIndex);
                        const isAnimating = isCardAnimating(originalIndex);
                        const shuffleVal = shuffleValues[visualIndex];

                        // Si la carta está animando al centro, no renderizar aquí
                        if (isAnimating) return null;

                        // Lógica del abanico
                        const totalDegrees = 300;
                        const anglePerCard = totalDegrees / (DECK_SIZE - 1);
                        const startRotation = -totalDegrees / 2;
                        const finalRotation = startRotation + (anglePerCard * visualIndex);

                        // Si fadeOthers está activo y la carta no está seleccionada, hacer fade
                        const shouldFade = fadeOthers && !isSelected;
                        const selIndex = currentSelected.indexOf(originalIndex);
                        const targetPos = isSelected
                            ? getSelectedCardPosition(selIndex, maxSelections, isMobile)
                            : { x: 0, y: 0, rotate: finalRotation, scale: 1 };

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
                                x: targetPos.x,
                                y: targetPos.y,
                                rotate: targetPos.rotate,
                                scale: targetPos.scale,
                                opacity: shouldFade ? 0 : 1,
                                zIndex: isSelected ? 120 + selIndex : visualIndex,
                                transition: {
                                    delay: isSelected ? 0 : visualIndex * 0.04,
                                    type: "spring",
                                    stiffness: 220,
                                    damping: 22
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
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                        : (isSelected && currentSelected.length < maxSelections ? {
                                            scale: targetPos.scale * 1.05,
                                            transition: { duration: 0.2 }
                                        } : {})
                                }
                                whileTap={!disabled && !isShuffling ? {
                                    scale: 1.05,
                                    transition: { duration: 0.15 }
                                } : {}}
                                onClick={() => handleCardClick(originalIndex)}
                                className={`absolute cursor-pointer ${disabled || isShuffling || (currentSelected.length >= maxSelections && !isSelected) ? "pointer-events-none" : ""}`}
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
                                            ? "border-purple-400 shadow-purple-500/60 ring-2 ring-purple-400/40"
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
                                            animate={{ opacity: [0.2, 0.45, 0.2] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                    )}

                                    {/* Brillo místico interno */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />

                                    {/* Badge numérico de orden de selección (para multi-selección) */}
                                    {isSelected && maxSelections > 1 && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            className="absolute top-1.5 right-1.5 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 rounded-full flex items-center justify-center z-30 shadow-[0_0_12px_rgba(168,85,247,0.7)] border border-white/30"
                                        >
                                            <span className="text-[11px] md:text-xs font-mono font-bold text-white leading-none">
                                                {selIndex + 1}
                                            </span>
                                        </motion.div>
                                    )}

                                    {/* Etiqueta de posición debajo de la carta seleccionada */}
                                    {isSelected && slotLabels && slotLabels[selIndex] && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-1.5 inset-x-1 z-30 text-center pointer-events-none"
                                        >
                                            <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-purple-200 bg-black/80 px-1.5 py-0.5 rounded backdrop-blur-xs border border-purple-500/30 truncate inline-block max-w-full">
                                                {slotLabels[selIndex]}
                                            </span>
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

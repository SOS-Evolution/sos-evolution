"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CelestialFrame } from "@/components/features/tarot/frames";

interface ArcanaCardPreview {
    index: number;
    name: string;
    roman: string;
    element: string;
    keyword: string;
    messageEs: string;
    messageEn: string;
}

const FEATURED_ARCANA: ArcanaCardPreview[] = [
    {
        index: 1,
        name: "El Mago",
        roman: "I",
        element: "Aire / Mercurio",
        keyword: "Manifestación & Poder Creador",
        messageEs: "Posees todos los elementos sagrados ante ti. La sincronicidad conspira a tu favor para transformar tus ideas en realidad tangible.",
        messageEn: "You hold all sacred elements before you. Synchronicity is aligning to transform your mental visions into tangible reality."
    },
    {
        index: 3,
        name: "La Emperatriz",
        roman: "III",
        element: "Tierra / Venus",
        keyword: "Abundancia & Fertilidad",
        messageEs: "Un ciclo de gestación florece en tu vida. Nutre tus proyectos con paciencia, amor propio y confianza en los ritmos del universo.",
        messageEn: "A cycle of gestation is blossoming. Nourish your projects with patience, self-love, and trust in cosmic timing."
    },
    {
        index: 17,
        name: "La Estrella",
        roman: "XVII",
        element: "Aire / Acuario",
        keyword: "Esperanza & Claridad Divina",
        messageEs: "Las aguas de tu intuición se renuevan. Tras la tormenta llega la serenidad, la fe inquebrantable y la guía luminosa de tu alma.",
        messageEn: "The waters of your intuition are renewed. After the storm comes serene faith, inspiration, and the guiding light of your soul."
    },
    {
        index: 19,
        name: "El Sol",
        roman: "XIX",
        element: "Fuego / Sol",
        keyword: "Vitalidad & Consciencia Plena",
        messageEs: "La verdad se ilumina sin velos. Tu vitalidad irradia calidez, éxito y lucidez para disipar cualquier sombra del pasado.",
        messageEn: "Truth illuminates without veils. Your vitality radiates warmth, success, and lucidity to dissolve past shadows."
    },
    {
        index: 21,
        name: "El Mundo",
        roman: "XXI",
        element: "Tierra / Saturno",
        keyword: "Realización & Totalidad Junguiana",
        messageEs: "Has completado una etapa sagrada de aprendizaje. Es momento de celebrar tu integración interna y expandirte al cosmos.",
        messageEn: "You have completed a sacred learning cycle. It is time to celebrate your inner wholeness and expand into the cosmos."
    }
];

export default function InteractiveHeroOracle({ locale }: { locale: string }) {
    const t = useTranslations("Landing.oracle_teaser");
    const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null);
    const isEs = locale === "es";

    const handleSelectCard = (index: number) => {
        if (selectedCardIdx === index) return;
        setSelectedCardIdx(index);
    };

    const handleShuffle = () => {
        setSelectedCardIdx(null);
    };

    const revealedArcana = selectedCardIdx !== null ? FEATURED_ARCANA[selectedCardIdx] : null;

    return (
        <div className="w-full max-w-5xl mx-auto my-8 relative z-20">
            {/* Header hint */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-amber-400/30 text-amber-300 text-xs font-medium tracking-widest uppercase mb-2 shadow-[0_0_15px_rgba(210,161,125,0.2)]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                    <span>{t("tag")}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white tracking-wide">
                    {t("title")}
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto font-light mt-1">
                    {t("subtitle")}
                </p>
            </div>

            {/* Interactive Card Fan Container */}
            <div className="relative min-h-[360px] md:min-h-[420px] flex items-center justify-center py-4 px-2">
                <div className="relative flex items-center justify-center w-full max-w-2xl h-[320px] md:h-[360px]">
                    {FEATURED_ARCANA.map((card, i) => {
                        const isSelected = selectedCardIdx === i;
                        const isAnySelected = selectedCardIdx !== null;
                        // Calculation for fan rotation and horizontal offset
                        const offset = i - 2; // -2, -1, 0, 1, 2
                        const baseRotate = offset * 7;
                        const baseTranslateX = offset * (typeof window !== "undefined" && window.innerWidth < 768 ? 48 : 72);
                        const baseTranslateY = Math.abs(offset) * 10;

                        return (
                            <motion.div
                                key={card.index}
                                initial={false}
                                animate={{
                                    rotate: isSelected ? 0 : baseRotate,
                                    x: isSelected ? 0 : baseTranslateX,
                                    y: isSelected ? -20 : baseTranslateY,
                                    scale: isSelected ? 1.08 : isAnySelected ? 0.92 : 1,
                                    zIndex: isSelected ? 30 : 10 + i,
                                    opacity: isAnySelected && !isSelected ? 0.45 : 1
                                }}
                                whileHover={
                                    !isSelected && !isAnySelected
                                        ? {
                                            y: baseTranslateY - 24,
                                            scale: 1.05,
                                            zIndex: 25,
                                            transition: { duration: 0.25 }
                                        }
                                        : {}
                                }
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                onClick={() => handleSelectCard(i)}
                                className="absolute cursor-pointer perspective-1000 select-none group"
                                style={{ width: "160px", height: "260px" }}
                            >
                                <div
                                    className="w-full h-full relative preserve-3d transition-transform duration-700"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        transform: isSelected ? "rotateY(180deg)" : "rotateY(0deg)"
                                    }}
                                >
                                    {/* REVERSO DE LA CARTA (DORADO / PÚRPURA NOCTURNO) */}
                                    <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-b from-[#211235] via-[#160a25] to-[#0d0517] border border-amber-400/40 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(210,161,125,0.2)] group-hover:border-amber-300 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_25px_rgba(210,161,125,0.45)] transition-all overflow-hidden flex flex-col items-center justify-between">
                                        {/* Corner stars */}
                                        <div className="w-full flex justify-between text-[10px] text-amber-400/70">
                                            <span>✦</span>
                                            <span>✦</span>
                                        </div>

                                        {/* Geometric sacred center */}
                                        <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full border border-amber-400/30 bg-amber-400/5">
                                            <div className="absolute inset-1 rounded-full border border-purple-500/20 animate-spin" style={{ animationDuration: "30s" }} />
                                            <Sparkles className="w-8 h-8 text-amber-300/80 group-hover:text-amber-200 group-hover:scale-110 transition-all duration-300" />
                                            <span className="text-[10px] tracking-[0.25em] text-amber-200/90 font-serif font-bold mt-1">
                                                SOS
                                            </span>
                                        </div>

                                        {/* Bottom label */}
                                        <div className="w-full flex justify-between text-[10px] text-amber-400/70">
                                            <span>✦</span>
                                            <span className="text-[8px] uppercase tracking-widest text-slate-400 font-sans">
                                                {t("flip_hint")}
                                            </span>
                                            <span>✦</span>
                                        </div>
                                    </div>

                                    {/* FRENTE DE LA CARTA (REVELADO) */}
                                    <div
                                        className="absolute inset-0 backface-hidden rounded-xl bg-[#0d0714] border border-amber-400/60 shadow-[0_0_35px_rgba(230,190,138,0.5)] overflow-hidden"
                                        style={{ transform: "rotateY(180deg)" }}
                                    >
                                        <CelestialFrame className="absolute inset-0 z-20 pointer-events-none w-full h-full" />
                                        <div className="relative w-full h-full p-[4px] z-10">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`/assets/tarot/arcano-${card.index}.jpg`}
                                                alt={card.name}
                                                className="w-full h-full object-cover rounded-[8px]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Revealed Arcana Message Card */}
            <AnimatePresence mode="wait">
                {revealedArcana && (
                    <motion.div
                        key={revealedArcana.index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4 max-w-xl mx-auto p-6 md:p-7 rounded-2xl bg-gradient-to-b from-[#25153d]/90 via-[#1a0f2b]/95 to-[#120a1e]/95 border border-amber-400/40 backdrop-blur-xl shadow-[0_0_40px_rgba(210,161,125,0.25)] text-center relative overflow-hidden"
                    >
                        {/* Ambient glow in corner */}
                        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

                        {/* Card metadata badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-3">
                            <span>Arcano {revealedArcana.roman}</span>
                            <span>•</span>
                            <span>{revealedArcana.element}</span>
                        </div>

                        <h4 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1 tracking-wide">
                            {revealedArcana.name}
                        </h4>
                        <p className="text-xs uppercase tracking-[0.2em] text-purple-300 font-medium mb-4">
                            {revealedArcana.keyword}
                        </p>

                        <p className="text-slate-200 text-sm md:text-base leading-relaxed font-light mb-6">
                            &ldquo;{isEs ? revealedArcana.messageEs : revealedArcana.messageEn}&rdquo;
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href={{
                                pathname: "/tarot",
                                query: {
                                    modalidad: "general",
                                    pregunta: isEs ? `Consejo evolutivo de ${revealedArcana.name}` : `Evolutionary guidance for ${revealedArcana.name}`
                                }
                            }}>
                                <Button className="h-11 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold hover:brightness-110 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all group">
                                    <Sparkles className="w-4 h-4 mr-2 text-slate-950" />
                                    {t("cta_full_reading")}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>

                            <Button
                                variant="ghost"
                                onClick={handleShuffle}
                                className="h-11 px-5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/5 rounded-xl text-sm"
                            >
                                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                                {t("shuffle")}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

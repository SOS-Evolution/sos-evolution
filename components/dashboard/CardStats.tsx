"use client";

import { Card } from "@/components/ui/card";
import { Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfig } from "@/components/providers/ConfigProvider";
import { GoldenClassicFrame, MysticSilverFrame, CelestialFrame, GoldenOrnateFrame } from "@/components/features/tarot/frames";
import { useTranslations } from 'next-intl';

interface CardStatsProps {
    stats: {
        card_name: string;
        times_drawn: number;
    } | null;
    className?: string;
}

const ROMAN_NUMERALS = [
    "0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
    "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"
];

export default function CardStats({ stats, className }: CardStatsProps) {
    const t = useTranslations('Dashboard.tarot');
    const tc = useTranslations('Tarot');
    const { tarotFrame } = useConfig();

    // Convertir el array de nombres de cartas del JSON a una lista
    const DECK_EN = [
        "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
        "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
        "Wheel of Fortune", "Justice", "The Hanged Man", "Death",
        "Temperance", "The Devil", "The Tower", "The Star", "The Moon",
        "The Sun", "Judgement", "The World"
    ];
    const DECK_ES = [
        "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
        "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
        "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
        "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
        "El Sol", "El Juicio", "El Mundo"
    ];

    // Buscar en ambos idiomas por si acaso
    let cardIndex = stats ? DECK_ES.indexOf(stats.card_name) : -1;
    if (cardIndex === -1 && stats) {
        cardIndex = DECK_EN.indexOf(stats.card_name);
    }

    const imageUrl = cardIndex !== -1 ? `/assets/tarot/arcano-${cardIndex}.jpg` : null;
    const localizedCardName = cardIndex !== -1 ? tc.raw('cards')[cardIndex] : "???";

    const renderFrame = () => {
        const frameClass = "absolute inset-0 z-20 pointer-events-none w-full h-full";
        switch (tarotFrame) {
            case "mystic": return <MysticSilverFrame className={frameClass} />;
            case "classic": return <GoldenClassicFrame className={frameClass} />;
            case "ornate": return <GoldenOrnateFrame className={frameClass} />;
            case "celestial":
            default: return <CelestialFrame className={frameClass} />;
        }
    };

    return (
        <Card className={cn(
            // Restauramos p-4 para alinear títulos con el resto del dashboard
            "bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/40 border-white/5 p-4 flex flex-col gap-0 h-full relative overflow-hidden group",
            className
        )}>

            {/* Header: Título e Icono solamente en el flujo */}
            <div className="flex justify-between items-start relative z-10 w-full shrink-0">
                <div className="flex items-center gap-2 text-indigo-300/90 pt-0">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase tracking-wider font-bold leading-none">{t('stats_title')}</span>
                </div>
            </div>

            {/* Contador de Frecuencia: Absoluto para no afectar al nombre */}
            <div className="absolute top-3 right-3 z-20 text-4xl font-serif font-bold text-indigo-400/40 leading-none drop-shadow-[0_0_12px_rgba(129,140,248,0.2)]">
                {t('stats_count', { count: stats?.times_drawn || 0 })}
            </div>

            {/* Título (Nombre de la carta): En la misma fila que el número */}
            <div className="w-full relative z-10 shrink-0 mt-2 flex items-center justify-center gap-4">
                <div className="w-9 h-9 min-w-[36px] rounded-full border border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    <span className="text-indigo-300 font-serif font-bold text-xs">
                        {cardIndex !== -1 ? ROMAN_NUMERALS[cardIndex] : "?"}
                    </span>
                </div>
                <div className="text-2xl font-serif font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    {localizedCardName}
                </div>
            </div>

            {/* Contenedor de Imagen */}
            <div className="flex-1 flex items-center justify-center relative min-h-0 w-full py-2">
                {imageUrl ? (
                    <div className="relative flex items-center justify-center h-full aspect-[2/3] max-h-[210px]">
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />

                        {/* El Marco Global */}
                        {renderFrame()}

                        <div className="relative w-full h-full z-10 p-[4px]">
                            <img
                                src={imageUrl}
                                alt={stats?.card_name}
                                className="w-full h-full object-cover rounded-[10px] shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center opacity-30">
                        <Layers className="w-6 h-6 text-slate-400" />
                    </div>
                )}
            </div>

            {/* Decoración: Centrada verticalmente y alineada a la derecha como en las otras tarjetas */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 p-3 opacity-10 group-hover:opacity-15 pointer-events-none transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                <Sparkles className="w-16 h-16 text-indigo-400" />
            </div>
        </Card>
    );
}
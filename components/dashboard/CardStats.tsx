import { Card } from "@/components/ui/card";
import { Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardStatsProps {
    stats: {
        card_name: string;
        times_drawn: number;
    } | null;
    className?: string;
}

const DECK = [
    "El Loco", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
    "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza", "El Ermitaño",
    "La Rueda de la Fortuna", "La Justicia", "El Colgado", "La Muerte",
    "La Templanza", "El Diablo", "La Torre", "La Estrella", "La Luna",
    "El Sol", "El Juicio", "El Mundo"
];

export default function CardStats({ stats, className }: CardStatsProps) {
    const cardIndex = stats ? DECK.indexOf(stats.card_name) : -1;
    const imageUrl = cardIndex !== -1 ? `/assets/tarot/arcano-${cardIndex}.jpg` : null;

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
                    <span className="text-[10px] uppercase tracking-wider font-bold leading-none">Afinidad Arcana</span>
                </div>
            </div>

            {/* Contador de Frecuencia: Absoluto para no afectar al nombre */}
            <div className="absolute top-3 right-3 z-20 text-4xl font-serif font-bold text-indigo-400/40 leading-none drop-shadow-[0_0_12px_rgba(129,140,248,0.2)]">
                x{stats?.times_drawn || 0}
            </div>

            {/* Título (Nombre de la carta): Pegado arriba */}
            <div className="w-full text-center relative z-10 shrink-0 mt-0">
                <div className="text-2xl font-serif font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    <span className="text-indigo-400/50 mr-2 text-xl font-sans italic">
                        {cardIndex !== -1 ? cardIndex : "???"}
                    </span>
                    {stats?.card_name || "???"}
                </div>
            </div>

            {/* Contenedor de Imagen */}
            {/* flex-1 permite ocupar espacio sobrante, pero la imagen dentro tendrá límite */}
            <div className="flex-1 flex items-center justify-center relative min-h-0 w-full py-1">
                {imageUrl ? (
                    <div className="relative flex items-center justify-center h-full">
                        <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
                        <img
                            src={imageUrl}
                            alt={stats?.card_name}
                            // CORRECCIÓN AQUÍ:
                            // 1. Quitamos h-full para que no fuerce el estiramiento infinito.
                            // 2. Definimos max-h-[210px]. Esto es +50px que el original, 
                            //    pero pone un techo para que la tarjeta no crezca más allá de eso.
                            className="max-h-[210px] w-auto object-contain rounded-xl shadow-2xl border border-white/10 transition-all duration-500 group-hover:scale-[1.02]"
                        />
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
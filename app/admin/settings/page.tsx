"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save, Check, Loader2, Sparkles } from "lucide-react";
import { GoldenClassicFrame, MysticSilverFrame, CelestialFrame, GoldenOrnateFrame, TarotFrameId } from "@/components/features/tarot/frames";
import { updateSystemSetting, getSystemSettings } from "./actions";
import { toast } from "sonner";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const [activeFrame, setActiveFrame] = useState<TarotFrameId>("celestial");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadSettings() {
            try {
                const settings = await getSystemSettings();
                const frameSetting = settings.find(s => s.key === "tarot_frame");
                if (frameSetting) {
                    setActiveFrame(frameSetting.value as TarotFrameId);
                }
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSystemSetting("tarot_frame", activeFrame);
            // Si sonner no está disponible, esto fallará silenciosamente o podemos usar alert
            if (typeof toast !== "undefined") {
                toast.success("Configuración actualizada correctamente");
            } else {
                alert("¡Configuración guardada!");
            }
        } catch (error) {
            console.error(error);
            alert("Error al guardar la configuración");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl">
            <AnimatedSection>
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                        <Settings className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif text-white">Ajustes del <span className="text-purple-400">Sistema</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Configura los parámetros globales de la experiencia SOS Evolution.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="grid gap-8">
                {/* Selección de Marco de Tarot */}
                <Card className="p-8 bg-slate-900/50 border-slate-800 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="w-24 h-24 text-purple-400" />
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Diseño de Cartas de Tarot</h3>
                        <p className="text-slate-400 text-sm mb-8 max-w-2xl">
                            Selecciona el estilo visual de los marcos que se mostrarán en todas las lecturas de la plataforma.
                        </p>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { id: "classic", name: "Dorado Clásico", frame: GoldenClassicFrame, desc: "Elegancia tradicional con filigranas de oro." },
                                { id: "ornate", name: "Dorado Barroco", frame: GoldenOrnateFrame, desc: "Trazos más gruesos y ornamentación enriquecida." },
                                { id: "mystic", name: "Plata Mística", frame: MysticSilverFrame, desc: "Temática lunar con acabados plateados y estrellas." },
                                { id: "celestial", name: "Arco Celestial", frame: CelestialFrame, desc: "Diseño detallado con iconografía del Sol y la Luna." },
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setActiveFrame(option.id as TarotFrameId)}
                                    className={cn(
                                        "group relative flex flex-col p-4 rounded-2xl border-2 transition-all duration-300 text-left",
                                        activeFrame === option.id
                                            ? "bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                                    )}
                                >
                                    <div className="aspect-[2/3] w-full rounded-xl bg-slate-950 mb-4 overflow-hidden relative border border-slate-800">
                                        <option.frame className="absolute inset-0 w-full h-full" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                            <div className="w-12 h-16 border border-dashed border-slate-700 rounded-sm" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mb-1">
                                        <span className={cn(
                                            "font-bold text-sm transition-colors",
                                            activeFrame === option.id ? "text-purple-400" : "text-slate-200"
                                        )}>
                                            {option.name}
                                        </span>
                                        {activeFrame === option.id && (
                                            <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-500 leading-relaxed">
                                        {option.desc}
                                    </p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-end items-center gap-4">
                            <p className="text-xs text-slate-500 italic">
                                * El cambio se aplicará globalmente a todos los usuarios.
                            </p>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-8 rounded-xl h-12 gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Más ajustes en el futuro */}
                <Card className="p-8 bg-slate-900/30 border-slate-800 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-50">
                    <p className="text-slate-400 text-sm">Próximamente: Ajustes de IA, correos transaccionales y límites de créditos.</p>
                </Card>
            </div>
        </div>
    );
}

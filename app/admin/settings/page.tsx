"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save, Check, Loader2, Sparkles } from "lucide-react";
import { GoldenClassicFrame, MysticSilverFrame, CelestialFrame, GoldenOrnateFrame, TarotFrameId } from "@/components/features/tarot/frames";
import { updateSystemSetting, getSystemSettings, getReadingTypes, updateReadingTypeCost } from "./actions";
import { toast } from "sonner";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Coins, Info, AlertCircle, Trophy } from "lucide-react";

export default function SettingsPage() {
    const [activeFrame, setActiveFrame] = useState<TarotFrameId>("celestial");
    const [readingTypes, setReadingTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingAura, setSavingAura] = useState<string | null>(null);

    useEffect(() => {
        async function loadSettings() {
            try {
                const [settings, rTypes] = await Promise.all([
                    getSystemSettings(),
                    getReadingTypes()
                ]);

                const frameSetting = settings.find(s => s.key === "tarot_frame");
                if (frameSetting) {
                    setActiveFrame(frameSetting.value as TarotFrameId);
                }
                setReadingTypes(rTypes);
            } catch (error) {
                console.error("Failed to load settings:", error);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleAuraCostSave = async (id: string, newCost: number) => {
        setSavingAura(id);
        try {
            await updateReadingTypeCost(id, newCost);
            toast.success("Costo de AURA actualizado");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar el costo");
        } finally {
            setSavingAura(null);
        }
    };

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

                {/* Gestión de Economía AURA */}
                <AnimatedSection delay={0.2}>
                    <Card className="p-8 bg-slate-900/50 border-slate-800 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Coins className="w-24 h-24 text-amber-400" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                    <Coins className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Economía (Costos AURA)</h3>
                                    <p className="text-slate-400 text-sm">Administra los costos de créditos para cada acción en la plataforma.</p>
                                </div>
                            </div>

                            <div className="bg-slate-950/40 rounded-2xl border border-slate-800 overflow-hidden">
                                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                                    <div className="col-span-5">Sección / Acción</div>
                                    <div className="col-span-4">Descripción</div>
                                    <div className="col-span-3 text-right">Costo (AURA)</div>
                                </div>

                                <div className="divide-y divide-slate-800">
                                    {readingTypes.length === 0 ? (
                                        <div className="p-8 text-center text-slate-500 italic text-sm">
                                            No se encontraron tipos de lectura...
                                        </div>
                                    ) : (
                                        readingTypes.map((type) => (
                                            <div key={type.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                                                <div className="col-span-5 flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-xl">
                                                        {type.icon || '🔮'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-200">{type.name}</div>
                                                        <div className="text-[10px] text-purple-400 font-mono">{type.code}</div>
                                                    </div>
                                                </div>
                                                <div className="col-span-4">
                                                    <p className="text-xs text-slate-500 line-clamp-1">{type.description}</p>
                                                </div>
                                                <div className="col-span-3 flex items-center justify-end gap-3">
                                                    <div className="relative w-24">
                                                        <Input
                                                            type="number"
                                                            defaultValue={type.credit_cost}
                                                            onBlur={(e) => {
                                                                const val = parseInt(e.target.value);
                                                                if (val !== type.credit_cost && !isNaN(val)) {
                                                                    handleAuraCostSave(type.id, val);
                                                                }
                                                            }}
                                                            className="h-10 bg-slate-900 border-slate-700 text-right pr-4 font-bold text-amber-400 rounded-lg focus:border-amber-500/50"
                                                        />
                                                    </div>
                                                    {savingAura === type.id && (
                                                        <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                        ))}
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                                <Info className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                                    * Los cambios en los costos de AURA se aplicarán inmediatamente. Los usuarios verán los nuevos precios al recargar sus páginas. Los créditos ya gastados no se verán afectados.
                                </p>
                            </div>
                        </div>
                    </Card>
                </AnimatedSection>

                {/* Gestión de Misiones y Recompensas */}
                <AnimatedSection delay={0.4}>
                    <MissionsSettingsCard />
                </AnimatedSection>

                {/* Más ajustes en el futuro */}
                <Card className="p-8 bg-slate-900/30 border-slate-800 border-dashed border-2 flex flex-col items-center justify-center text-center opacity-50">
                    <p className="text-slate-400 text-sm">Próximamente: Ajustes de IA, correos transaccionales y límites de créditos.</p>
                </Card>
            </div>
        </div>
    );
}

// Subcomponente para aislar la lógica de misiones
import { getMissions, updateMissionReward } from "./missions-actions";

function MissionsSettingsCard() {
    const [missions, setMissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);

    useEffect(() => {
        getMissions()
            .then(setMissions)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleRewardSave = async (id: string, newReward: number) => {
        setSavingId(id);
        try {
            await updateMissionReward(id, newReward);
            toast.success("Recompensa actualizada");
        } catch (error) {
            console.error(error);
            toast.error("Error al actualizar recompensa");
        } finally {
            setSavingId(null);
        }
    };

    if (loading) return (
        <Card className="p-8 bg-slate-900/50 border-slate-800 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
        </Card>
    );

    return (
        <Card className="p-8 bg-slate-900/50 border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Trophy className="w-24 h-24 text-yellow-400" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Recompensas y Misiones</h3>
                        <p className="text-slate-400 text-sm">Define la cantidad de AURA que otorgan las misiones.</p>
                    </div>
                </div>

                <div className="bg-slate-950/40 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                        <div className="col-span-5">Misión</div>
                        <div className="col-span-4">Descripción</div>
                        <div className="col-span-3 text-right">Recompensa (AURA)</div>
                    </div>

                    <div className="divide-y divide-slate-800">
                        {missions.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 italic text-sm">
                                No se encontraron misiones...
                            </div>
                        ) : (
                            missions.map((mission) => (
                                <div key={mission.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors">
                                    <div className="col-span-5 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-center text-xl">
                                            {mission.icon || '🎯'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-200">{mission.title}</div>
                                            <div className="text-[10px] text-purple-400 font-mono">{mission.code}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-xs text-slate-500 line-clamp-1">{mission.description}</p>
                                    </div>
                                    <div className="col-span-3 flex items-center justify-end gap-3">
                                        <div className="relative w-24">
                                            <Input
                                                type="number"
                                                defaultValue={mission.reward_credits}
                                                onBlur={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    if (val !== mission.reward_credits && !isNaN(val)) {
                                                        handleRewardSave(mission.id, val);
                                                    }
                                                }}
                                                className="h-10 bg-slate-900 border-slate-700 text-right pr-4 font-bold text-yellow-400 rounded-lg focus:border-yellow-500/50"
                                            />
                                        </div>
                                        {savingId === mission.id && (
                                            <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

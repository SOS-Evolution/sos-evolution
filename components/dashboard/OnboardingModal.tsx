"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, MapPin, Calendar as CalendarIcon, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types";

interface OnboardingModalProps {
    onComplete: (profile: Profile) => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [birthTime, setBirthTime] = useState("12:00");
    const [gender, setGender] = useState<string>("");
    const [latitude, setLatitude] = useState<number | "">("");
    const [longitude, setLongitude] = useState<number | "">("");

    const handleSave = async () => {
        if (!fullName || !birthDate || !birthPlace || !gender) {
            alert("Por favor completa todos los campos requeridos.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    birth_date: birthDate,
                    birth_place: birthPlace,
                    birth_time: birthTime,
                    gender: gender,
                    latitude: latitude === "" ? 0 : latitude,
                    longitude: longitude === "" ? 0 : longitude
                })
            });

            const updatedProfile = await res.json();

            if (updatedProfile.error) {
                throw new Error(updatedProfile.error);
            }

            onComplete(updatedProfile);
        } catch (error) {
            console.error("Error guardando perfil:", error);
            alert("Hubo un error al guardar tu perfil. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const genderOptions = [
        { value: "masculino", label: "Masculino", desc: "Sexo biológico masculino de nacimiento" },
        { value: "femenino", label: "Femenino", desc: "Sexo biológico femenino de nacimiento" },
        { value: "intersexual", label: "Intersexual", desc: "Variación biológica de nacimiento" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay Oscuro */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />

            {/* Modal Container */}
            <div className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-300">
                <Card className="bg-slate-900 border-purple-500/30 shadow-2xl shadow-purple-500/10 overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
                                <Sparkles className="w-8 h-8 text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-serif text-white mb-2">Completa tu Identidad del Alma</h2>
                            <p className="text-slate-400 text-sm max-w-md">
                                Para que SOS Evolution pueda realizar cálculos precisos y personalizados de tu mapa evolutivo, necesitamos los siguientes datos de tu nacimiento.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Nombre Completo */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Tu nombre completo"
                                        className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                    />
                                </div>
                            </div>

                            {/* Fecha y Hora */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Fecha de Nacimiento</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Hora (Aprox)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input
                                            type="time"
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                            className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sexo de Nacimiento */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sexo de Nacimiento</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {genderOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setGender(opt.value)}
                                            className={cn(
                                                "p-3 rounded-xl border text-sm transition-all duration-200 text-center flex flex-col items-center gap-1",
                                                gender === opt.value
                                                    ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                                    : "bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600"
                                            )}
                                        >
                                            <span className="font-bold">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 italic px-1 text-center">
                                    * Este dato es fundamental para la polaridad en los cálculos astrales y numerológicos.
                                </p>
                            </div>

                            {/* Lugar de Nacimiento */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Lugar de Nacimiento</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input
                                        value={birthPlace}
                                        onChange={(e) => setBirthPlace(e.target.value)}
                                        placeholder="Ciudad, País"
                                        className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!birthPlace) return;
                                            setLoading(true);
                                            try {
                                                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(birthPlace)}&limit=1`);
                                                const data = await res.json();
                                                if (data && data[0]) {
                                                    setLatitude(parseFloat(data[0].lat));
                                                    setLongitude(parseFloat(data[0].lon));
                                                }
                                            } catch (e) {
                                                console.error(e);
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-purple-400 hover:text-purple-300 underline"
                                    >
                                        Auto-Detectar
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 text-lg font-serif"
                                >
                                    {loading ? "Sincronizando..." : <><Save className="w-5 h-5 mr-2" /> Completar Mi Identidad</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

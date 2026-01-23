"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, User, MapPin, Calendar as CalendarIcon, Save, Edit2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getLifePathNumber, getZodiacSign, getNumerologyDetails, LifePathDetails } from "@/lib/soul-math";
import MagicModal from "@/components/ui/MagicModal";
import type { Profile } from "@/types";

interface UserProfileProps {
    user: any; // Mantenemos el usuario de auth como prop inicial
    className?: string;
}

export default function UserProfile({ user, className }: UserProfileProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estados del formulario
    const [fullName, setFullName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [latitude, setLatitude] = useState<number | "">("");
    const [longitude, setLongitude] = useState<number | "">("");

    const [selectedDetails, setSelectedDetails] = useState<LifePathDetails | null>(null);

    // Cargar perfil real desde nuestra tabla
    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setProfile(data);
                    setFullName(data.full_name || "");
                    setBirthDate(data.birth_date || "");
                    setBirthPlace(data.birth_place || "");
                    setBirthTime(data.birth_time || "12:00");
                    setLatitude(data.latitude || "");
                    setLongitude(data.longitude || "");

                    if (!data.full_name) setIsEditing(true);
                }
            })
            .catch(err => console.error("Error loading profile:", err));
    }, []);

    // Cálculos en tiempo real
    const zodiac = birthDate ? getZodiacSign(new Date(birthDate).getDate(), new Date(birthDate).getMonth() + 1) : "---";
    const lifePath = birthDate ? getLifePathNumber(birthDate) : "---";

    const handleSave = async () => {
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
                    latitude: latitude === "" ? 0 : latitude,
                    longitude: longitude === "" ? 0 : longitude
                })
            });

            const updatedProfile = await res.json();

            if (updatedProfile.error) {
                throw new Error(updatedProfile.error);
            }

            setProfile(updatedProfile);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Error guardando:", error);
            alert("Hubo un error al guardar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="animate-pulse h-32 bg-slate-900/50 rounded-xl w-full"></div>;

    return (
        <>
            <Card className={cn("bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/20 p-4 relative overflow-hidden group", className)}>
                {/* Fondo Decorativo */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                    <User className="w-16 h-16 text-purple-500" />
                </div>

                {!isEditing && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="absolute top-2 right-2 z-20 text-slate-500 hover:text-white h-7 text-xs hover:bg-white/5"
                    >
                        <Edit2 className="w-3 h-3 mr-1" /> Editar
                    </Button>
                )}

                <div className="flex flex-col md:flex-row gap-4 items-start relative z-10">

                    {/* COLUMNA 1: Datos Personales */}
                    <div className="flex-1 w-full space-y-2">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                                <h2 className="text-[10px] font-serif text-purple-300 flex items-center gap-1.5 uppercase tracking-[0.2em]">
                                    <User className="w-3.5 h-3.5" />
                                    Identidad del Alma
                                </h2>
                                {!isEditing && (
                                    <div className="h-7" /> // Placeholder to maintain spacing if needed, though absolute won't occupy space
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 ml-1">Nombre Completo</label>
                                    <Input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Tu nombre mágico"
                                        className="bg-slate-800/50 border-slate-700 text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Fecha Nacimiento</label>
                                        <Input
                                            type="date"
                                            value={birthDate}
                                            onChange={(e) => setBirthDate(e.target.value)}
                                            className="bg-slate-800/50 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Hora (Aproximada)</label>
                                        <Input
                                            type="time"
                                            value={birthTime}
                                            onChange={(e) => setBirthTime(e.target.value)}
                                            className="bg-slate-800/50 border-slate-700 text-white font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs text-slate-400 ml-1 flex justify-between items-center">
                                        <span>Lugar (País/Ciudad)</span>
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
                                                        alert("Coordenadas detectadas!");
                                                    }
                                                } catch (e) {
                                                    console.error("Geocoding error", e);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="text-[10px] text-purple-400 hover:text-purple-300 underline"
                                        >
                                            Auto-Detectar Coordenadas
                                        </button>
                                    </label>
                                    <Input
                                        value={birthPlace}
                                        onChange={(e) => setBirthPlace(e.target.value)}
                                        placeholder="Ej: Santiago, Chile"
                                        className="bg-slate-800/50 border-slate-700 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 opacity-70">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Latitud</label>
                                        <Input
                                            type="number"
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            placeholder="0.00"
                                            className="bg-slate-800/50 border-slate-700 text-white text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Longitud</label>
                                        <Input
                                            type="number"
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                            placeholder="0.00"
                                            className="bg-slate-800/50 border-slate-700 text-white text-xs"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleSave} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                    {loading ? "Guardando..." : <><Save className="w-4 h-4 mr-2" /> Guardar Perfil</>}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                    {fullName || "Viajero Sin Nombre"}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-400">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                        <CalendarIcon className="w-3 h-3" />
                                        {birthDate || "Fecha desconocida"}
                                        {birthTime && (
                                            <span className="flex items-center gap-1 ml-2">
                                                <Clock className="w-3 h-3" />
                                                {birthTime.split(':').slice(0, 2).join(':')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                        <MapPin className="w-3 h-3" />
                                        {birthPlace || "Lugar desconocido"}
                                        {latitude && longitude && <span className="text-[10px] opacity-50">({latitude.toFixed(2)}, {longitude.toFixed(2)})</span>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </Card>

            <MagicModal
                isOpen={!!selectedDetails}
                onClose={() => setSelectedDetails(null)}
                details={selectedDetails}
            />
        </>
    );
}
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, User, MapPin, Calendar as CalendarIcon, Save, Edit2, Clock, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getLifePathNumber, getZodiacSign, getNumerologyDetails, LifePathDetails } from "@/lib/soul-math";
import MagicModal from "@/components/ui/MagicModal";
import type { Profile } from "@/types";

interface UserProfileProps {
    user: any; // Mantenemos el usuario de auth como prop inicial
    profile?: Profile | null; // Añadimos perfil opcional desde el padre
    className?: string;
}

export default function UserProfile({ user, profile: externalProfile, className }: UserProfileProps) {
    const router = useRouter();
    const [profile, setProfile] = useState<Profile | null>(externalProfile || null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Sincronizar con perfil externo si cambia (ej. post-onboarding)
    useEffect(() => {
        if (externalProfile) {
            setProfile(externalProfile);
            setFullName(externalProfile.full_name || "");
            setDisplayName(externalProfile.display_name || "");
            setBirthDate(externalProfile.birth_date || "");
            setBirthPlace(externalProfile.birth_place || "");
            setBirthTime(externalProfile.birth_time || "12:00");
            setGender(externalProfile.gender || "");
            setLatitude(externalProfile.latitude || "");
            setLongitude(externalProfile.longitude || "");
        }
    }, [externalProfile]);

    // Estados del formulario
    const [fullName, setFullName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [gender, setGender] = useState("");
    const [latitude, setLatitude] = useState<number | "">("");
    const [longitude, setLongitude] = useState<number | "">("");
    const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

    const [selectedDetails, setSelectedDetails] = useState<LifePathDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Cargar perfil real desde nuestra tabla si no viene de props
    useEffect(() => {
        if (!externalProfile) {
            fetch('/api/profile')
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setProfile(data);
                        setFullName(data.full_name || "");
                        setDisplayName(data.display_name || "");
                        setBirthDate(data.birth_date || "");
                        setBirthPlace(data.birth_place || "");
                        setBirthTime(data.birth_time || "12:00");
                        setGender(data.gender || "");
                        setLatitude(data.latitude || "");
                        setLongitude(data.longitude || "");

                        if (!data.full_name) setIsEditing(true);
                    }
                })
                .catch(err => console.error("Error loading profile:", err));
        }
    }, [externalProfile]);

    // Cálculos en tiempo real
    const zodiac = birthDate ? getZodiacSign(new Date(birthDate).getDate(), new Date(birthDate).getMonth() + 1) : "---";
    const lifePath = birthDate ? getLifePathNumber(birthDate) : "---";

    const handleSave = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: fullName,
                    display_name: displayName,
                    birth_date: birthDate,
                    birth_place: birthPlace,
                    birth_time: birthTime,
                    gender: gender,
                    latitude: latitude === "" ? 0 : latitude,
                    longitude: longitude === "" ? 0 : longitude
                })
            });

            const data = await res.json();

            if (!res.ok || data.error) {
                const errorMsg = data.details || data.error || "Error desconocido";
                const hint = data.hint ? `\n\nTip: ${data.hint}` : "";
                throw new Error(`${errorMsg}${hint}`);
            }

            setProfile(data);
            setIsEditing(false);
            router.refresh();
        } catch (err: any) {
            console.error("Error guardando:", err);
            setError(err.message || "Hubo un error al guardar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (!profile) return <div className="animate-pulse h-32 bg-slate-900/50 rounded-xl w-full"></div>;

    return (
        <>
            <Card className={cn("bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/20 p-4 relative overflow-hidden group", className)}>
                {/* Error Message UI */}
                {error && (
                    <div className="absolute inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-slate-900 border border-red-500/30 p-6 rounded-2xl shadow-2xl max-w-[280px] text-center space-y-3">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                                <Info className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-lg font-serif text-white">Error</h3>
                            <p className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap">
                                {error}
                            </p>
                            <Button
                                onClick={() => setError(null)}
                                size="sm"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/5 h-8 text-xs"
                            >
                                Reintentar
                            </Button>
                        </div>
                    </div>
                )}

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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Nombre Público</label>
                                        <Input
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Tu apodo"
                                            className="bg-slate-800/50 border-slate-700 text-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Nombre Completo</label>
                                        <Input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Tu nombre mágico"
                                            className="bg-slate-800/50 border-slate-700 text-white"
                                        />
                                    </div>
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
                                    <label className="text-xs text-slate-400 ml-1">Sexo de Nacimiento</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["masculino", "femenino", "intersexual"].map((opt) => (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => setGender(opt)}
                                                className={cn(
                                                    "py-1.5 px-2 rounded-lg border text-[10px] transition-all duration-200 text-center font-bold uppercase",
                                                    gender === opt
                                                        ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                                                        : "bg-slate-800/30 border-slate-700 text-slate-500 hover:border-slate-600"
                                                )}
                                            >
                                                {opt}
                                            </button>
                                        ))}
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
                                                    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(birthPlace)}&addressdetails=1&limit=1`);
                                                    const data = await res.json();
                                                    if (data && data[0]) {
                                                        setLatitude(parseFloat(data[0].lat));
                                                        setLongitude(parseFloat(data[0].lon));

                                                        const addr = data[0].address;
                                                        const city = addr.city || addr.town || addr.village || addr.suburb || "";
                                                        const country = addr.country || "";

                                                        if (city && country) {
                                                            setBirthPlace(`${city}, ${country}`);
                                                        }
                                                        setIsLocationConfirmed(true);
                                                    }
                                                } catch (e) {
                                                    console.error("Geocoding error", e);
                                                } finally {
                                                    setLoading(false);
                                                }
                                            }}
                                            className="text-[10px] text-purple-400 hover:text-purple-300 underline"
                                        >
                                            {isLocationConfirmed ? "✓ Lugar Confirmado" : "Auto-Detectar Coordenadas"}
                                        </button>
                                    </label>
                                    <Input
                                        value={birthPlace}
                                        onChange={(e) => {
                                            setBirthPlace(e.target.value);
                                            setIsLocationConfirmed(false);
                                        }}
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
                                    {profile?.display_name || profile?.full_name || user.user_metadata?.full_name || "Viajero Sin Nombre"}
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
                                    {gender && (
                                        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full capitalize">
                                            <User className="w-3 h-3" />
                                            {gender}
                                        </div>
                                    )}
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
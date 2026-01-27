"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, MapPin, Calendar as CalendarIcon, Clock, Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types";

interface OnboardingModalProps {
    onComplete: (profile: Profile) => void;
    onClose?: () => void;
    initialData?: Profile | null;
}

export default function OnboardingModal({ onComplete, onClose, initialData }: OnboardingModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // Datos del perfil
    const [displayName, setDisplayName] = useState(initialData?.display_name || "");
    const [fullName, setFullName] = useState(initialData?.full_name || "");
    const [birthDate, setBirthDate] = useState(initialData?.birth_date || "");
    const [birthPlace, setBirthPlace] = useState(initialData?.birth_place || "");
    const [birthTime, setBirthTime] = useState(initialData?.birth_time || "12:00");
    const [gender, setGender] = useState<string>(initialData?.gender || "");
    const [latitude, setLatitude] = useState<number | "">(initialData?.latitude || "");
    const [longitude, setLongitude] = useState<number | "">(initialData?.longitude || "");
    const [isLocationConfirmed, setIsLocationConfirmed] = useState(!!initialData?.latitude);

    const isStep2Complete = fullName && birthDate && birthPlace && gender && birthTime;

    const handleSave = async () => {
        if (!isStep2Complete) return;
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    display_name: displayName,
                    full_name: fullName,
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

            onComplete(data);
        } catch (err: any) {
            console.error("Error guardando perfil:", err);
            setError(err.message || "Hubo un error al sincronizar con el cosmos. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    const handleAutoDetect = async () => {
        if (!birthPlace) return;
        setLoading(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(birthPlace)}&addressdetails=1&limit=1`);
            const data = await res.json();
            if (data && data[0]) {
                setLatitude(parseFloat(data[0].lat));
                setLongitude(parseFloat(data[0].lon));

                // Formatear como "Ciudad, País" simplificado
                const addr = data[0].address;
                const city = addr.city || addr.town || addr.village || addr.suburb || "";
                const country = addr.country || "";

                if (city && country) {
                    setBirthPlace(`${city}, ${country}`);
                }
                setIsLocationConfirmed(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const genderOptions = [
        { value: "masculino", label: "Masculino" },
        { value: "femenino", label: "Femenino" },
        { value: "intersexual", label: "Intersexual" },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay más transparente */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />

            <div className="relative w-full max-w-2xl animate-in fade-in zoom-in duration-300">
                <Card className="bg-slate-900/90 backdrop-blur-xl border-purple-500/30 shadow-2xl shadow-purple-500/10 overflow-hidden relative">

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-[120] text-slate-500 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <span className="sr-only">Cerrar</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {/* Error Message UI */}
                    {error && (
                        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl shadow-2xl max-w-sm text-center space-y-4">
                                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                                    <Info className="w-8 h-8 text-red-400" />
                                </div>
                                <h3 className="text-xl font-serif text-white">Error</h3>
                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {error}
                                </p>
                                <div className="pt-2">
                                    <Button
                                        onClick={() => setError(null)}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/5"
                                    >
                                        Volver a Intentar
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest pt-2">
                                    Tip: Verifica tu conexión o reintenta en unos momentos.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-8">

                        {/* STEP 1: BIENVENIDA */}
                        {step === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                                        <Sparkles className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <h2 className="text-4xl font-serif text-white mb-4">Bienvenido a SOS Evolution</h2>
                                    <div className="space-y-4 text-slate-300 max-w-md">
                                        <p>Estás a punto de iniciar un viaje de autodescubrimiento profundo.</p>
                                        <div className="flex flex-col gap-3 text-sm text-slate-400">
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ArrowRight className="w-4 h-4 text-purple-400" />
                                                <span>Cálculos astrológicos precisos.</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ArrowRight className="w-4 h-4 text-purple-400" />
                                                <span>Mapas de numerología evolutiva.</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ArrowRight className="w-4 h-4 text-purple-400" />
                                                <span>Interpretaciones alineadas a tu esencia.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-sm mx-auto">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">¿Cómo quieres que te llamemos?</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder="Tu apodo o nombre preferido"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic mt-1 text-center font-light">
                                            Este nombre es solo para saludarte y no influye en las interpretaciones técnicas.
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => setStep(2)}
                                        disabled={!displayName}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 font-bold group"
                                    >
                                        Siguiente
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DATOS TÉCNICOS */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
                                        <Sparkles className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-serif text-white mb-2">Identidad del Alma</h2>
                                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-start gap-3 max-w-lg mb-4 text-left">
                                        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-purple-100/80 leading-relaxed">
                                            Todos los datos a continuación son fundamentales para el cálculo astral y numerológico.
                                            <strong> La precisión y eficacia de tus resultados dependen directamente de la exactitud de esta información.</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-5">
                                    {/* Nombre Completo */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Nombre Completo (Nombres y Apellidos)</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Tu nombre místico completo"
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                            />
                                        </div>
                                    </div>

                                    {/* Fecha y Hora */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Fecha de Nacimiento</label>
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
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Hora (Aprox)</label>
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

                                    {/* Sexo */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Sexo de Nacimiento</label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {genderOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setGender(opt.value)}
                                                    className={cn(
                                                        "p-3 rounded-xl border text-sm transition-all duration-200 text-center font-bold",
                                                        gender === opt.value
                                                            ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                                            : "bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-600"
                                                    )}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Lugar */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Lugar de Nacimiento</label>
                                        <div className="relative flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-md pr-2 overflow-hidden focus-within:border-purple-500/50 transition-colors">
                                            <MapPin className="ml-3 w-4 h-4 text-slate-500" />
                                            <Input
                                                value={birthPlace}
                                                onChange={(e) => {
                                                    setBirthPlace(e.target.value);
                                                    setIsLocationConfirmed(false);
                                                }}
                                                placeholder="Ciudad, País"
                                                className="bg-transparent border-none text-white h-12 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-600"
                                            />
                                            {isLocationConfirmed ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg animate-in zoom-in duration-300 mr-1">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-tighter">Confirmado</span>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-purple-600/20 hover:bg-purple-600 text-purple-100 border-none h-8 px-4 font-bold text-[10px] uppercase tracking-wider"
                                                    onClick={handleAutoDetect}
                                                    disabled={!birthPlace || loading}
                                                >
                                                    Confirmar
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col gap-4">
                                        <div className="flex items-center justify-center gap-2 text-emerald-400/60 text-[10px] uppercase tracking-widest font-bold">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Tus datos están seguros y protegidos.
                                        </div>
                                        <Button
                                            onClick={handleSave}
                                            disabled={loading || !isStep2Complete}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 text-lg font-serif shadow-lg shadow-purple-900/20"
                                        >
                                            {loading ? "Sincronizando..." : <><Save className="w-5 h-5 mr-2" /> Completar Mi Identidad</>}
                                        </Button>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="text-slate-500 text-[10px] uppercase tracking-widest hover:text-slate-300 transition-colors py-2"
                                        >
                                            Volver al inicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, User, MapPin, Calendar as CalendarIcon, Clock, Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/types";
import { useTranslations } from 'next-intl';
import { toast } from "sonner";

interface OnboardingModalProps {
    onComplete: (profile: Profile) => void;
    onClose?: () => void;
    initialData?: Profile | null;
    isEdit?: boolean;
}

export default function OnboardingModal({ onComplete, onClose, initialData, isEdit }: OnboardingModalProps) {
    const t = useTranslations('Onboarding');
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
            toast.success(t('profile_updated_success') || "Perfil actualizado con éxito");
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
        { value: "masculino", label: t('gender_options.masculino') },
        { value: "femenino", label: t('gender_options.femenino') },
        { value: "intersexual", label: t('gender_options.intersexual') },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex justify-center p-4 overflow-y-auto items-start sm:items-center py-8">
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
                                <h3 className="text-xl font-serif text-white">{t('error_title')}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {error}
                                </p>
                                <div className="pt-2">
                                    <Button
                                        onClick={() => setError(null)}
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-white/5"
                                    >
                                        {t('error_retry')}
                                    </Button>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest pt-2">
                                    {t('error_hint')}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="p-5 sm:p-8">

                        {/* STEP 1: BIENVENIDA */}
                        {step === 1 && !isEdit && (
                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                <div className="flex flex-col items-center text-center">
                                    <div className="p-4 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
                                        <Sparkles className="w-10 h-10 text-purple-400" />
                                    </div>
                                    <h2 className="text-4xl font-serif text-white mb-4">{t('welcome_title')}</h2>
                                    <div className="space-y-4 text-slate-300 max-w-md">
                                        <p>{t('welcome_desc')}</p>
                                        <div className="flex flex-col gap-3 text-sm text-slate-400">
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ArrowRight className="w-4 h-4 text-purple-400" />
                                                <span>{t('feature_astro')}</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ArrowRight className="w-4 h-4 text-purple-400" />
                                                <span>{t('feature_num')}</span>
                                            </div>
                                            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <ArrowRight className="w-4 h-4 text-purple-400" />
                                                <span>{t('feature_essence')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 max-w-sm mx-auto">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{t('nickname_label')}</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                placeholder={t('nickname_placeholder')}
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-500 italic mt-1 text-center font-light">
                                            {t('nickname_hint')}
                                        </p>
                                    </div>

                                    <Button
                                        onClick={() => setStep(2)}
                                        disabled={!displayName}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 font-bold group"
                                    >
                                        {t('next')}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: DATOS TÉCNICOS (O Pantalla Única de Edición) */}
                        {(step === 2 || isEdit) && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                <div className="flex flex-col items-center text-center">
                                    {!isEdit && (
                                        <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 mb-4">
                                            <Sparkles className="w-8 h-8 text-purple-400" />
                                        </div>
                                    )}
                                    <h2 className={cn("font-serif text-white mb-2", isEdit ? "text-2xl" : "text-3xl")}>
                                        {isEdit ? t('edit_title') : t('identity_title')}
                                    </h2>
                                    <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-xl flex items-start gap-3 max-w-lg mb-4 text-left">
                                        <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-purple-100/80 leading-relaxed">
                                            {t('identity_hint')}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid gap-5">
                                    {/* Campo de Nombre Preferido (Solo en Edición o como parte del flujo integrado) */}
                                    {isEdit && (
                                        <div className="space-y-2 animate-in fade-in duration-500">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{t('nickname_label')}</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                                <Input
                                                    value={displayName}
                                                    onChange={(e) => setDisplayName(e.target.value)}
                                                    placeholder={t('nickname_placeholder')}
                                                    className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-500 italic mt-1 font-light ml-1">
                                                {t('nickname_hint')}
                                            </p>
                                        </div>
                                    )}
                                    {/* Nombre Completo */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{t('fullname_label')}</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                            <Input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder={t('fullname_placeholder')}
                                                className="bg-slate-800/50 border-slate-700 pl-10 text-white h-12"
                                            />
                                        </div>
                                    </div>

                                    {/* Fecha y Hora */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{t('birthdate_label')}</label>
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
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{t('birthtime_label')}</label>
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
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{t('gender_label')}</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {genderOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setGender(opt.value)}
                                                    className={cn(
                                                        "p-2.5 rounded-xl border text-sm transition-all duration-200 text-center font-bold truncate",
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
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{t('birthplace_label')}</label>
                                        <div className="relative flex items-center gap-2 bg-slate-800/50 border border-slate-700 rounded-md pr-2 overflow-hidden focus-within:border-purple-500/50 transition-colors">
                                            <MapPin className="ml-3 w-4 h-4 text-slate-500" />
                                            <Input
                                                value={birthPlace}
                                                onChange={(e) => {
                                                    setBirthPlace(e.target.value);
                                                    setIsLocationConfirmed(false);
                                                }}
                                                placeholder={t('birthplace_placeholder')}
                                                className="bg-transparent border-none text-white h-12 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-600"
                                            />
                                            {isLocationConfirmed ? (
                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg animate-in zoom-in duration-300 mr-1">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-tighter">{t('confirmed')}</span>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="bg-purple-600/20 hover:bg-purple-600 text-purple-100 border-none h-8 px-4 font-bold text-[10px] uppercase tracking-wider"
                                                    onClick={handleAutoDetect}
                                                    disabled={!birthPlace || loading}
                                                >
                                                    {t('confirm')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col gap-4">
                                        <div className="flex items-center justify-center gap-2 text-emerald-400/60 text-[10px] uppercase tracking-widest font-bold">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            {t('security_hint')}
                                        </div>
                                        <Button
                                            onClick={handleSave}
                                            disabled={loading || !isStep2Complete}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 text-lg font-serif shadow-lg shadow-purple-900/20"
                                        >
                                            {loading ? t('syncing') : (
                                                <>
                                                    <Save className="w-5 h-5 mr-2" />
                                                    {isEdit ? t('save_changes') : t('complete_identity')}
                                                </>
                                            )}
                                        </Button>
                                        {!isEdit && (
                                            <button
                                                onClick={() => setStep(1)}
                                                className="text-slate-500 text-[10px] uppercase tracking-widest hover:text-slate-300 transition-colors py-2"
                                            >
                                                {t('back')}
                                            </button>
                                        )}
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

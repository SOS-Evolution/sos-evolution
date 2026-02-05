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
import { useTranslations } from 'next-intl';

interface UserProfileProps {
    user: any; // Mantenemos el usuario de auth como prop inicial
    profile?: Profile | null; // Añadimos perfil opcional desde el padre
    onEdit?: () => void; // Función para abrir el modal de edición
    className?: string;
}

export default function UserProfile({ user, profile: externalProfile, onEdit, className }: UserProfileProps) {
    const t = useTranslations('Dashboard.profile');
    const [profile, setProfile] = useState<Profile | null>(externalProfile || null);
    const [loading, setLoading] = useState(false);

    // Sincronizar con perfil externo si cambia (ej. post-onboarding)
    useEffect(() => {
        if (externalProfile) {
            setProfile(externalProfile);
        }
    }, [externalProfile]);

    const [selectedDetails, setSelectedDetails] = useState<LifePathDetails | null>(null);

    // Cargar perfil real desde nuestra tabla si no viene de props
    useEffect(() => {
        if (!externalProfile) {
            setLoading(true);
            fetch('/api/profile')
                .then(res => res.json())
                .then(data => {
                    if (data && !data.error) {
                        setProfile(data);
                    }
                })
                .catch(err => console.error("Error loading profile:", err))
                .finally(() => setLoading(false));
        }
    }, [externalProfile]);

    // Cálculos en tiempo real
    const birthDate = profile?.birth_date;
    const birthTime = profile?.birth_time;
    const birthPlace = profile?.birth_place;
    const gender = profile?.gender;
    const latitude = profile?.latitude;
    const longitude = profile?.longitude;
    const fullName = profile?.full_name;

    const zodiac = birthDate ? getZodiacSign(new Date(birthDate).getDate(), new Date(birthDate).getMonth() + 1) : "---";
    const lifePath = birthDate ? getLifePathNumber(birthDate) : "---";

    if (loading && !profile) return <div className="animate-pulse h-32 bg-slate-900/50 rounded-xl w-full"></div>;
    if (!profile) return null;

    return (
        <>
            <Card className={cn("bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/20 p-4 relative overflow-hidden group", className)}>

                {/* Fondo Decorativo */}
                <div className="absolute top-1/2 -translate-y-1/2 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                    <User className="w-16 h-16 text-purple-500" />
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="absolute top-2 right-2 z-20 text-slate-500 hover:text-white h-7 text-xs hover:bg-white/5"
                >
                    <Edit2 className="w-3 h-3 mr-1" /> {t('edit')}
                </Button>

                <div className="flex flex-col md:flex-row gap-4 items-start relative z-10">

                    {/* COLUMNA 1: Datos Personales */}
                    <div className="flex-1 w-full space-y-2">
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                                <h2 className="text-[10px] font-serif text-purple-300 flex items-center gap-1.5 uppercase tracking-[0.2em]">
                                    <User className="w-3.5 h-3.5" />
                                    {t('title')}
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                {profile?.full_name || user.user_metadata?.full_name || t('unknown_traveler')}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-400">
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                    <CalendarIcon className="w-3 h-3" />
                                    {birthDate || t('unknown_date')}
                                    {birthTime && (
                                        <span className="flex items-center gap-1 ml-2">
                                            <Clock className="w-3 h-3" />
                                            {birthTime.split(':').slice(0, 2).join(':')}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                    <MapPin className="w-3 h-3" />
                                    {birthPlace || t('unknown_place')}
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
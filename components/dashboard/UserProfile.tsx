"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, User, MapPin, Calendar as CalendarIcon, Save, Edit2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { getLifePathNumber, getZodiacSign } from "@/utils/soul-math";
import { updateProfile } from "@/app/dashboard/actions"; // Importar la acción nueva

interface UserProfileProps {
    user: any;
}

export default function UserProfile({ user }: UserProfileProps) {
    const router = useRouter();
    const metadata = user.user_metadata || {};

    const [isEditing, setIsEditing] = useState(!metadata.full_name); // Editar si no hay datos
    const [loading, setLoading] = useState(false);

    // Estados del formulario
    const [fullName, setFullName] = useState(metadata.full_name || "");
    const [birthDate, setBirthDate] = useState(metadata.birth_date || "");
    const [birthPlace, setBirthPlace] = useState(metadata.birth_place || "");

    // Cálculos en tiempo real (si hay fecha)
    const zodiac = birthDate ? getZodiacSign(new Date(birthDate).getDate(), new Date(birthDate).getMonth() + 1) : "---";
    const lifePath = birthDate ? getLifePathNumber(birthDate) : "---";

    const handleSave = async () => {
        setLoading(true);
        try {
            // Preparamos los datos para enviar al servidor
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("birthDate", birthDate);
            formData.append("birthPlace", birthPlace);

            // Llamamos a la Server Action
            await updateProfile(formData);

            // Si todo sale bien
            setIsEditing(false);
            // No necesitamos router.refresh() porque revalidatePath lo hace solo
        } catch (error) {
            console.error("Error guardando:", error);
            alert("Hubo un error al guardar. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/20 p-6 md:p-8 relative overflow-hidden">
            {/* Fondo Decorativo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">

                {/* COLUMNA 1: Datos Personales */}
                <div className="flex-1 w-full space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-serif text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" />
                            Identidad del Alma
                        </h2>
                        {!isEditing && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-white">
                                <Edit2 className="w-4 h-4 mr-2" /> Editar
                            </Button>
                        )}
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
                                    <label className="text-xs text-slate-400 ml-1">Lugar (País/Ciudad)</label>
                                    <Input
                                        value={birthPlace}
                                        onChange={(e) => setBirthPlace(e.target.value)}
                                        placeholder="Ej: Chile"
                                        className="bg-slate-800/50 border-slate-700 text-white"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSave} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                {loading ? "Guardando..." : <><Save className="w-4 h-4 mr-2" /> Guardar Perfil</>}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {fullName || "Viajero Sin Nombre"}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-400">
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                    <CalendarIcon className="w-3 h-3" />
                                    {birthDate || "Fecha desconocida"}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                    <MapPin className="w-3 h-3" />
                                    {birthPlace || "Lugar desconocido"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* COLUMNA 2: Estadísticas Calculadas */}
                {!isEditing && birthDate && (
                    // CAMBIO AQUÍ: Usamos Grid. 
                    // grid-cols-1 (móvil vertical) -> sm:grid-cols-2 (móvil horizontal) -> md:flex-col (desktop lateral)
                    <div className="w-full md:w-64 grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-4 mt-6 md:mt-0">

                        {/* Signo Zodiacal */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-4 rounded-xl flex items-center gap-4 shadow-lg">
                            <div className="min-w-[2.5rem] h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-serif text-lg">
                                ♒
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold truncate">Signo Solar</p>
                                <p className="text-lg text-white font-bold truncate">{zodiac}</p>
                            </div>
                        </div>

                        {/* Numerología */}
                        <div className="bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/30 p-4 rounded-xl flex items-center gap-4 shadow-lg">
                            <div className="min-w-[2.5rem] h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-serif text-lg">
                                #
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-purple-300 uppercase tracking-widest font-bold truncate">Camino de Vida</p>
                                <p className="text-lg text-white font-bold truncate">{lifePath}</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </Card>
    );
}
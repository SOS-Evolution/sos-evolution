import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserProfile from "@/components/dashboard/UserProfile";
import AnimatedSection from "@/components/landing/AnimatedSection";
import CreditsDisplay from "@/components/dashboard/CreditsDisplay";
import CardStats from "@/components/dashboard/CardStats";
import { ArrowRight, Layers, Trophy, Star, Hash, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { getLifePathNumber, getZodiacSign, getLifePathDetails } from "@/lib/soul-math";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile Completo (para datos de nacimiento)
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. Fetch Top Card
    const { data: topCards } = await supabase.rpc('get_top_card');
    const stats = (topCards && topCards.length > 0) ? topCards[0] : null;

    // 3. Cálculos Astrológicos
    let zodiacSign = "---";
    let lifePathNum = 0;
    let lifePathWord = "---";

    if (profile?.birth_date) {
        const [y, m, d] = profile.birth_date.split('-').map(Number);

        zodiacSign = getZodiacSign(d, m);
        lifePathNum = getLifePathNumber(profile.birth_date);
        if (lifePathNum > 0) {
            const details = getLifePathDetails(lifePathNum);
            lifePathWord = details.powerWord;
        }
    }

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[40%] left-[20%] w-[20%] h-[20%] bg-indigo-900/10 rounded-full blur-[80px] animate-pulse delay-1000" />
            </div>

            <main className="max-w-6xl mx-auto p-6 relative z-10 space-y-4">

                {/* FILA 1: NUEVA DISTRIBUCIÓN */}
                <AnimatedSection delay={0.1}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* COLUMNA IZQUIERDA (2/3): Saldo + Misiones + Identidad */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CreditsDisplay />

                                <Link href="/missions" className="block group h-full">
                                    <Card className="h-full bg-gradient-to-br from-amber-950/80 to-slate-900 border-yellow-500/20 p-4 relative overflow-hidden group transition-all hover:border-yellow-500/40">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110 group-hover:rotate-12 duration-500">
                                            <Trophy className="w-16 h-16 text-yellow-500" />
                                        </div>

                                        <div className="relative z-10 h-full flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1 text-yellow-500/80">
                                                <Trophy className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-wider font-bold">Recompensas</span>
                                            </div>

                                            <div className="text-2xl font-serif font-bold text-white group-hover:text-yellow-100 transition-colors">
                                                Misiones
                                            </div>
                                            <p className="text-xs text-yellow-100/60 max-w-[90%] leading-relaxed">
                                                Gana créditos místicos.
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                            <UserProfile user={user} />
                        </div>

                        {/* COLUMNA DERECHA (1/3): Carta Recurrente (Altura Completa) */}
                        <div className="lg:col-span-1">
                            <CardStats stats={stats} className="h-full flex-col justify-center text-center gap-4" />
                        </div>

                    </div>
                </AnimatedSection>

                {/* SECCIÓN: PANEL DE CONTROL */}
                <div className="flex flex-col">
                    <AnimatedSection delay={0.25}>
                        <div className="flex items-center gap-4 py-2 opacity-80">
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
                            <span className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Panel de Control</span>
                            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1" />
                        </div>
                    </AnimatedSection>

                    <div className="space-y-6 mt-2">
                        {/* FILA 2: ASTRO + NUMEROLOGIA */}
                        <AnimatedSection delay={0.3}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* ASTROLOGÍA */}
                                <Link href="/astrology" className="block group h-full">
                                    <GlowingBorderCard className="h-full overflow-hidden" glowColor="purple">
                                        <div className="flex h-full min-h-[140px]">
                                            {/* Sector Izquierdo: Icono */}
                                            <div className="w-1/3 bg-indigo-500/10 border-r border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors relative">
                                                <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 blur-xl transition-colors" />
                                                {zodiacSign !== "---" ? (
                                                    <span className="text-5xl md::text-6xl text-indigo-400 font-serif relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 select-none">
                                                        {{
                                                            "Aries": "♈", "Tauro": "♉", "Géminis": "♊", "Cáncer": "♋",
                                                            "Leo": "♌", "Virgo": "♍", "Libra": "♎", "Escorpio": "♏",
                                                            "Sagitario": "♐", "Capricornio": "♑", "Acuario": "♒", "Piscis": "♓"
                                                        }[zodiacSign] || <Star className="w-10 h-10" />}
                                                    </span>
                                                ) : (
                                                    <Star className="w-10 h-10 text-indigo-400 relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                                                )}
                                            </div>

                                            {/* Sector Derecho: Contenido */}
                                            <div className="flex-1 p-6 flex flex-col justify-center">
                                                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">
                                                    Astrología
                                                </h3>
                                                <div className="text-xl font-serif font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                                                    {zodiacSign !== "---" ? zodiacSign : "Descubre más"}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                    {zodiacSign !== "---" ? "Tu signo solar define tu esencia." : "Configura tu fecha de nacimiento."}
                                                </p>
                                            </div>
                                        </div>
                                    </GlowingBorderCard>
                                </Link>

                                {/* NUMEROLOGÍA */}
                                <Link href="/numerology" className="block group h-full">
                                    <GlowingBorderCard className="h-full overflow-hidden" glowColor="cyan">
                                        <div className="flex h-full min-h-[140px]">
                                            {/* Sector Izquierdo: Icono */}
                                            <div className="w-1/3 bg-pink-500/10 border-r border-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors relative">
                                                <div className="absolute inset-0 bg-pink-500/5 group-hover:bg-pink-500/10 blur-xl transition-colors" />
                                                {lifePathNum > 0 ? (
                                                    <span className="text-5xl md:text-6xl font-bold text-pink-400 relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 select-none font-serif">
                                                        {lifePathNum}
                                                    </span>
                                                ) : (
                                                    <Hash className="w-10 h-10 text-pink-400 relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500" />
                                                )}
                                            </div>

                                            {/* Sector Derecho: Contenido */}
                                            <div className="flex-1 p-6 flex flex-col justify-center">
                                                <h3 className="text-xs font-bold text-pink-300 uppercase tracking-widest mb-2">
                                                    Numerología
                                                </h3>
                                                <div className="text-xl font-serif font-bold text-white group-hover:text-pink-200 transition-colors truncate">
                                                    {lifePathNum > 0 ? `Camino ${lifePathNum}` : "Calcula tu nº"}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                                    {lifePathNum > 0 ? lifePathWord : "Descubre el poder de tus números."}
                                                </p>
                                            </div>
                                        </div>
                                    </GlowingBorderCard>
                                </Link>
                            </div>
                        </AnimatedSection>

                        {/* FILA 3: LECTURA y DIARIO */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <AnimatedSection delay={0.4}>
                                <GlowingBorderCard className="h-full" glowColor="purple">
                                    <div className="p-8 flex flex-col h-full min-h-[220px]">
                                        <div className="flex-grow mb-6">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/30">
                                                    <Layers className="w-6 h-6 text-white" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-white">Tiradas de Tarot</h2>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed pl-[4rem]">
                                                Consulta el oráculo para recibir guía divina.
                                            </p>
                                        </div>
                                        <div className="mt-auto">
                                            <Link href="/lectura" className="block w-full">
                                                <Button className="w-full bg-white text-purple-950 hover:bg-purple-50 font-bold py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02] group">
                                                    Seleccionar Tirada
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </GlowingBorderCard>
                            </AnimatedSection>

                            <AnimatedSection delay={0.5}>
                                <GlowingBorderCard className="h-full" glowColor="cyan">
                                    <div className="p-8 flex flex-col h-full min-h-[220px]">
                                        <div className="flex-grow mb-6">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center border border-slate-600">
                                                    <BookOpen className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <h2 className="text-2xl font-bold text-white">Diario del Alma</h2>
                                            </div>
                                            <p className="text-slate-400 text-sm leading-relaxed pl-[4rem]">
                                                Revisa tu historial de lecturas y revelaciones.
                                            </p>
                                        </div>
                                        <div className="mt-auto">
                                            <Link href="/historial" className="block w-full">
                                                <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 font-bold py-4 rounded-xl shadow-lg border border-slate-600 transition-all hover:scale-[1.02] group">
                                                    Abrir Diario
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </GlowingBorderCard>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
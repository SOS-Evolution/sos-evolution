import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Star, Disc, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { getWesternChartData, getMockChartData, WesternChartData } from "@/lib/astrology-api";

export default async function AstrologyPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. Prepare/Fetch Chart Data
    let chartData: WesternChartData | null = null;
    let loading = true;

    if (profile?.birth_date) {
        const [y, m, d] = profile.birth_date.split('-').map(Number);

        // Relaxed Logic: 
        // If time is missing, default to noon (12:00) 
        // If coords are missing, default to 0,0 (Greenwich) or just mock.
        const [hour, minute] = profile.birth_time ? profile.birth_time.split(':').map(Number) : [12, 0];

        // TODO: Get real lat/long from profile if stored, otherwise default or use city lookup
        const lat = profile.latitude || 0;
        const lng = profile.longitude || 0;

        // Try Real API
        // chartData = await getWesternChartData({ 
        //     year: y, month: m, date: d, 
        //     hours: hour, minutes: minute, 
        //     latitude: lat, longitude: lng, timezone: 0 
        // });

        // For MVP/Demo reliability:
        chartData = getMockChartData();
    }

    // Fallback if no data yet
    // if (!chartData) chartData = getMockChartData(); // Remove for prod

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/50 to-transparent" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse" />
            </div>

            <main className="max-w-5xl mx-auto p-6 relative z-10">

                {/* Header */}
                <AnimatedSection>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/50">
                                    <ArrowLeft className="w-6 h-6" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-serif text-white">Carta Astral para <span className="text-indigo-400">{profile?.full_name || "Ti"}</span></h1>
                                <p className="text-slate-400 text-sm flex items-center gap-2">
                                    <MapPin className="w-3 h-3" />
                                    {profile?.birth_place || "Ubicación desconocida"}
                                    <span className="opacity-30">|</span>
                                    {profile?.birth_date} {profile?.birth_time}
                                </p>
                            </div>
                        </div>

                        {!chartData ? (
                            <Link href="/dashboard">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Configurar Natal
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex gap-4">
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Sol</div>
                                    <div className="font-serif text-xl text-yellow-400">
                                        {chartData.planets.find(p => p.name === "Sun")?.sign || "--"}
                                    </div>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Luna</div>
                                    <div className="font-serif text-xl text-slate-300">
                                        {chartData.planets.find(p => p.name === "Moon")?.sign || "--"}
                                    </div>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">Asc</div>
                                    <div className="font-serif text-xl text-indigo-400">
                                        {chartData.houses[0]?.sign || "--"}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </AnimatedSection>

                {chartData ? (
                    <div className="space-y-8">
                        {/* PLANETS SECTION */}
                        <AnimatedSection delay={0.2}>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Disc className="w-5 h-5 text-indigo-500" />
                                Planetas
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chartData.planets.map((planet, i) => (
                                    <GlowingBorderCard key={planet.name} glowColor="purple" className="h-full">
                                        <div className="p-4 flex items-center justify-between h-full">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-white/10 text-lg">
                                                    {/* Planet icons mapping */}
                                                    <span>
                                                        {{
                                                            "Sun": "☀️", "Moon": "🌙", "Mercury": "☿️",
                                                            "Venus": "♀️", "Mars": "♂️", "Jupiter": "♃",
                                                            "Saturn": "♄", "Uranus": "♅", "Neptune": "♆",
                                                            "Pluto": "♇"
                                                        }[planet.name] || "🪐"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{planet.name}</div>
                                                    <div className="text-xs text-slate-400">
                                                        Casa {planet.house}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-serif text-lg text-indigo-300">
                                                    {planet.sign}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {planet.normDegree.toFixed(2)}°
                                                </div>
                                            </div>
                                        </div>
                                    </GlowingBorderCard>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* HOUSES SECTION (Simple List for now) */}
                        <AnimatedSection delay={0.3}>
                            <h2 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
                                <Star className="w-5 h-5 text-indigo-500" />
                                Casas
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {chartData.houses.map((house) => (
                                    <div key={house.house} className="bg-slate-900/50 border border-white/5 rounded-xl p-3 text-center hover:bg-slate-800/50 transition-colors">
                                        <div className="text-xs text-slate-500 uppercase mb-1">Casa {house.house}</div>
                                        <div className="font-serif text-indigo-200">{house.sign}</div>
                                    </div>
                                ))}
                            </div>
                        </AnimatedSection>

                    </div>
                ) : (
                    <AnimatedSection delay={0.1}>
                        <div className="glass p-12 text-center rounded-3xl border border-dashed border-slate-700">
                            <Star className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                            <h2 className="text-2xl font-serif text-slate-200 mb-2">Carta Astral No Disponible</h2>
                            <p className="text-slate-400 mb-6">Necesitamos tu fecha, hora y lugar de nacimiento exactos.</p>
                            <Link href="/dashboard/profile">
                                <Button variant="outline">Completar Perfil</Button>
                            </Link>
                        </div>
                    </AnimatedSection>
                )}
            </main>
        </div>
    );
}

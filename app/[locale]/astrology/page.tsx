import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Star, Disc, MapPin, Calendar, Compass } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { getWesternChartData, getMockChartData, WesternChartData } from "@/lib/astrology-api";
import { getTranslations } from "next-intl/server";

import AstrologyWheel from "@/components/astrology/AstrologyWheel";
import PlanetIcon from "@/components/astrology/PlanetIcon";
import ZodiacIcon from "@/components/astrology/ZodiacIcon";

export default async function AstrologyPage() {
    const t = await getTranslations('AstrologyPage');
    const tz = await getTranslations('Zodiac');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login" as any);
        return null;
    }

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // 2. Prepare/Fetch Chart Data
    let chartData: WesternChartData | null = null;

    if (profile?.birth_date) {
        const [y, m, d] = profile.birth_date.split('-').map(Number);
        const [hour, minute] = profile.birth_time ? profile.birth_time.split(':').map(Number) : [12, 0];
        const lat = profile.latitude || 0;
        const lng = profile.longitude || 0;

        const details = {
            year: y, month: m, date: d,
            hours: hour, minutes: minute,
            latitude: lat, longitude: lng,
            timezone: profile.timezone || 0
        };

        // Try Real API
        chartData = await getWesternChartData(details);

        // Fallback for Demo if API fails or no key
        if (!chartData || chartData.planets.length === 0) {
            chartData = getMockChartData(details);
        }
    }

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
                                <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass">
                                    <ArrowLeft className="w-6 h-6" />
                                </Button>
                            </Link>
                            <div>
                                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-1">{t('title_natal')}</h2>
                                <h1 className="text-3xl font-serif text-white">{t('chart_title', { name: profile?.full_name || "Ti" })}</h1>
                                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                    <MapPin className="w-3 h-3" />
                                    {profile?.birth_place || t('location_unknown')}
                                    <span className="opacity-30">|</span>
                                    <Calendar className="w-3 h-3" />
                                    {profile?.birth_date} {profile?.birth_time ? profile.birth_time.split(':').slice(0, 2).join(':') : ""}
                                </p>
                            </div>
                        </div>

                        {!chartData ? (
                            <Link href="/dashboard">
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {t('setup_button')}
                                </Button>
                            </Link>
                        ) : (
                            <div className="flex gap-4">
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t('sun')}</div>
                                    <div className="font-serif text-xl text-yellow-400">
                                        {tz(chartData.planets.find(p => p.name === "Sun")?.sign || "--")}
                                    </div>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t('moon')}</div>
                                    <div className="font-serif text-xl text-slate-300">
                                        {tz(chartData.planets.find(p => p.name === "Moon")?.sign || "--")}
                                    </div>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t('asc')}</div>
                                    <div className="font-serif text-xl text-indigo-400">
                                        {tz(chartData.planets.find(p => p.name === "Ascendant")?.sign || "--")}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </AnimatedSection>

                {chartData ? (
                    <div className="space-y-12">
                        {/* CHART VISUALIZATION */}
                        <AnimatedSection delay={0.1}>
                            <div className="flex justify-center py-8">
                                <AstrologyWheel planets={chartData.planets} houses={chartData.houses} size={400} />
                            </div>
                        </AnimatedSection>
                        {/* PLANETS SECTION */}
                        <AnimatedSection delay={0.2}>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Disc className="w-5 h-5 text-indigo-500" />
                                {t('planets_title')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {chartData.planets.map((planet, i) => (
                                    <GlowingBorderCard key={`${planet.name}-${i}`} glowColor="purple" className="h-full">
                                        <div className="p-4 flex items-center justify-between h-full">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-14 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/5 transition-transform hover:scale-105">
                                                    <PlanetIcon name={planet.name} size={36} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">
                                                        {t.rich(`planets.${planet.name}`, {
                                                            fallback: (chunks) => planet.name
                                                        }) as any}
                                                    </div>
                                                    <div className="text-xs text-slate-400">
                                                        {t('house_label', { number: planet.house })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-serif text-lg text-indigo-300">
                                                    {tz(planet.sign)}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {(planet.normDegree ?? 0).toFixed(2)}°
                                                </div>
                                            </div>
                                        </div>
                                    </GlowingBorderCard>
                                ))}
                            </div>
                        </AnimatedSection>

                        {/* HOUSES SECTION */}
                        <AnimatedSection delay={0.3}>
                            <h2 className="text-xl font-bold text-white mb-6 mt-12 flex items-center gap-2">
                                <Compass className="w-5 h-5 text-indigo-500" />
                                {t('houses_title')}
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                {chartData.houses.map((house) => (
                                    <GlowingBorderCard key={house.house} glowColor="indigo" className="h-full group">
                                        <div className="p-3 flex flex-col items-center text-center space-y-2">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                {t('house_label', { number: house.house })}
                                            </span>

                                            <div className="relative">
                                                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <ZodiacIcon name={house.sign} size={28} className="relative z-10 transition-transform group-hover:scale-110" />
                                            </div>

                                            <div>
                                                <div className="font-serif text-sm text-white group-hover:text-indigo-300 transition-colors">
                                                    {tz(house.sign)}
                                                </div>
                                                <div className="text-[9px] text-slate-500 font-mono mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                    {t('cusp_label', { degree: house.fullDegree.toFixed(1) })}
                                                </div>
                                            </div>
                                        </div>
                                    </GlowingBorderCard>
                                ))}
                            </div>
                        </AnimatedSection>

                    </div>
                ) : (
                    <AnimatedSection delay={0.1}>
                        <div className="glass p-12 text-center rounded-3xl border border-dashed border-slate-700">
                            <Star className="w-16 h-16 text-slate-600 mx-auto mb-6" />
                            <h2 className="text-2xl font-serif text-slate-200 mb-2">{t('no_data_title')}</h2>
                            <p className="text-slate-400 mb-6">{t('no_data_description')}</p>
                            <Link href="/dashboard/profile">
                                <Button variant="outline">{t('complete_profile_button')}</Button>
                            </Link>
                        </div>
                    </AnimatedSection>
                )}
            </main>
        </div>
    );
}


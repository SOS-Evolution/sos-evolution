"use client";

import { useState, useEffect } from "react";
import AnimatedSection from "@/components/landing/AnimatedSection";
import { ArrowLeft, Star, Disc, MapPin, Calendar, Compass, Sparkles, Wand2, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { WesternChartData } from "@/lib/astrology-api";
import AstrologyWheel from "@/components/astrology/AstrologyWheel";
import PlanetIcon from "@/components/astrology/PlanetIcon";
import ZodiacIcon from "@/components/astrology/ZodiacIcon";
import AstroInterpretation from "@/components/astrology/AstroInterpretation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AstrologyClientProps {
    profile: any;
    initialChartData: WesternChartData | null;
    initialInterpretation: any | null;
    t: any;
    tz: any;
    locale: string;
}

export default function AstrologyClient({
    profile,
    initialChartData,
    initialInterpretation,
    t,
    tz,
    locale
}: AstrologyClientProps) {
    const [interpretation, setInterpretation] = useState(initialInterpretation);
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);
    const t_interp = useTranslations('AstrologyPage.interpretation');

    // Sync state with props when server data changes (e.g. after profile update)
    useEffect(() => {
        setInterpretation(initialInterpretation);
    }, [initialInterpretation]);

    useEffect(() => {
        const fetchBalance = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.rpc('get_user_balance', { user_uuid: user.id });
                setBalance(data);
            }
        };
        fetchBalance();
    }, []);

    const handleInterpret = async () => {
        if (!initialChartData) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/astrology/interpret', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chartData: initialChartData, locale })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 402) {
                    toast.error(t_interp('insufficient_aura'));
                } else {
                    toast.error(data.error || "Error");
                }
                return;
            }

            setInterpretation(data);
            setBalance(data.newBalance);
            toast.success(t_interp('interpretation_generated'));

            // Scroll to interpretation
            setTimeout(() => {
                document.getElementById('astro-interpretation')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error(error);
            toast.error(t_interp('error_oracle'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
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
                            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-1">{t.title_natal}</h2>
                            <h1 className="text-3xl font-serif text-white">{t.chart_title.replace('{name}', profile?.full_name || "Ti")}</h1>
                            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                <MapPin className="w-3 h-3" />
                                {profile?.birth_place || t.location_unknown}
                                <span className="opacity-30">|</span>
                                <Calendar className="w-3 h-3" />
                                {profile?.birth_date} {profile?.birth_time ? profile.birth_time.split(':').slice(0, 2).join(':') : ""}
                            </p>
                        </div>
                    </div>

                    {!initialChartData ? (
                        <Link href="/dashboard">
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                {t.setup_button}
                            </Button>
                        </Link>
                    ) : (
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-4">
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t.sun}</div>
                                    <div className="font-serif text-xl text-yellow-400">
                                        {tz[initialChartData.planets.find(p => p.name === "Sun")?.sign || ""] || "--"}
                                    </div>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t.moon}</div>
                                    <div className="font-serif text-xl text-slate-300">
                                        {tz[initialChartData.planets.find(p => p.name === "Moon")?.sign || ""] || "--"}
                                    </div>
                                </div>
                                <div className="text-center px-4 py-2 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t.asc}</div>
                                    <div className="font-serif text-xl text-indigo-400">
                                        {tz[initialChartData.planets.find(p => p.name === "Ascendant")?.sign || ""] || "--"}
                                    </div>
                                </div>
                            </div>
                            {balance !== null && (
                                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mr-1 opacity-60">
                                    {t_interp('aura_label', { balance })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </AnimatedSection>

            {initialChartData ? (
                <div className="space-y-12">
                    {/* CHART VISUALIZATION */}
                    <AnimatedSection delay={0.1}>
                        <div className="flex flex-col items-center gap-8 py-8">
                            <AstrologyWheel planets={initialChartData.planets} houses={initialChartData.houses} size={400} />

                            {!interpretation && (
                                <Button
                                    onClick={handleInterpret}
                                    disabled={isLoading}
                                    className="relative group px-8 py-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        <Wand2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                                    )}
                                    {t_interp('generate_button')}
                                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-lg">
                                        <Sparkles className="w-2.5 h-2.5" /> {t_interp('aura_cost_badge')}
                                    </div>
                                </Button>
                            )}
                        </div>
                    </AnimatedSection>

                    {/* AI INTERPRETATION SECTION */}
                    {interpretation && (
                        <AnimatedSection delay={0.1}>
                            <div id="astro-interpretation">
                                <AstroInterpretation data={interpretation} locale={locale} />
                            </div>
                            <div className="flex justify-center mt-8">
                                <Button
                                    variant="outline"
                                    onClick={handleInterpret}
                                    disabled={isLoading}
                                    className="text-xs text-slate-400 border-white/5 hover:border-indigo-500/30 glass"
                                >
                                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Sparkles className="w-3 h-3 mr-2" />}
                                    {t_interp('regenerate_button')} ({t_interp('aura_cost_badge')} Aura)
                                </Button>
                            </div>
                        </AnimatedSection>
                    )}

                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

                    {/* PLANETS SECTION */}
                    <AnimatedSection delay={0.2}>
                        {/* The rest of the planets/aspects/houses UI goes here */}
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Disc className="w-5 h-5 text-indigo-500" />
                            {t.planets_title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {initialChartData.planets.map((planet, i) => (
                                <GlowingBorderCard key={`${planet.name}-${i}`} glowColor="purple" className="h-full">
                                    <div className="p-4 flex items-center justify-between h-full">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-full bg-slate-900/50 flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/5 transition-transform hover:scale-105">
                                                <PlanetIcon name={planet.name} size={36} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-white">
                                                    {t.planets[planet.name] || planet.name}
                                                </div>
                                                <div className="text-xs text-slate-400">
                                                    {t.house_label.replace('{number}', planet.house.toString())}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-serif text-lg text-indigo-300">
                                                {tz[planet.sign] || planet.sign}
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

                    {/* ASPECTS SECTION */}
                    <AnimatedSection delay={0.25}>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                            {t.aspects_title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {initialChartData.aspects?.map((aspect, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/60 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <PlanetIcon name={aspect.planet1} size={18} className="text-slate-300" />
                                            <span className="text-sm font-medium text-slate-200">{t.planets[aspect.planet1] || aspect.planet1}</span>
                                        </div>
                                        <span className="text-xs text-slate-500">vs</span>
                                        <div className="flex items-center gap-1">
                                            <PlanetIcon name={aspect.planet2} size={18} className="text-slate-300" />
                                            <span className="text-sm font-medium text-slate-200">{t.planets[aspect.planet2] || aspect.planet2}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                                            {t.aspects[aspect.type] || aspect.type}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-mono">
                                            {aspect.orb.toFixed(2)}° orb
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>

                    {/* HOUSES SECTION */}
                    <AnimatedSection delay={0.3}>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Compass className="w-5 h-5 text-indigo-500" />
                            {t.houses_title}
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {initialChartData.houses.map((house) => (
                                <GlowingBorderCard key={house.house} glowColor="indigo" className="h-full group">
                                    <div className="p-3 flex flex-col items-center text-center space-y-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {t.house_label.replace('{number}', house.house.toString())}
                                        </span>

                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <ZodiacIcon name={house.sign} size={28} className="relative z-10 transition-transform group-hover:scale-110" />
                                        </div>

                                        <div>
                                            <div className="font-serif text-sm text-white group-hover:text-indigo-300 transition-colors">
                                                {tz[house.sign] || house.sign}
                                            </div>
                                            <div className="text-[9px] text-slate-500 font-mono mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {t.cusp_label.replace('{degree}', house.fullDegree.toFixed(1))}
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
                        <h2 className="text-2xl font-serif text-slate-200 mb-2">{t.no_data_title}</h2>
                        <p className="text-slate-400 mb-6">{t.no_data_description}</p>
                        <Link href="/dashboard/profile">
                            <Button variant="outline">{t.complete_profile_button}</Button>
                        </Link>
                    </div>
                </AnimatedSection>
            )}
        </main>
    );
}

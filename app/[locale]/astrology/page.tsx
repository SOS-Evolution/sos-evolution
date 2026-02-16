import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import { getWesternChartData, getMockChartData, WesternChartData } from "@/lib/astrology-api";
import { getTranslations } from "next-intl/server";
import AstrologyClient from "@/components/astrology/AstrologyClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AstrologyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t_raw = await getTranslations('AstrologyPage');
    const tz_raw = await getTranslations('Zodiac');

    // Convert translations to plain objects for client component
    const t = {
        title_natal: t_raw('title_natal'),
        chart_title: t_raw.raw('chart_title'),
        location_unknown: t_raw('location_unknown'),
        setup_button: t_raw('setup_button'),
        sun: t_raw('sun'),
        moon: t_raw('moon'),
        asc: t_raw('asc'),
        planets_title: t_raw('planets_title'),
        aspects_title: t_raw('aspects_title'),
        houses_title: t_raw('houses_title'),
        house_label: t_raw.raw('house_label'),
        cusp_label: t_raw.raw('cusp_label'),
        no_data_title: t_raw('no_data_title'),
        no_data_description: t_raw('no_data_description'),
        complete_profile_button: t_raw('complete_profile_button'),
        planets: t_raw.raw('planets'),
        aspects: t_raw.raw('aspects'),
    };

    const zodiacSignKeys = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const tz: Record<string, string> = {};
    zodiacSignKeys.forEach(key => {
        tz[key] = tz_raw(key);
    });

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

    // 2. Fetch Existing Interpretation for current locale
    const { data: interpretation } = await supabase
        .from('astrology_interpretations')
        .select('*')
        .eq('user_id', user.id)
        .eq('language', locale)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    // 3. Prepare/Fetch Chart Data
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

        // Check Cache first, but VALIDATE IT
        let isValidCache = false;
        if (profile?.astrology_chart && Object.keys(profile.astrology_chart).length > 0) {
            const cachedPlanets = (profile.astrology_chart as WesternChartData).planets;
            const sun = cachedPlanets.find(p => p.name === "Sun");
            const moon = cachedPlanets.find(p => p.name === "Moon");
            const asc = cachedPlanets.find(p => p.name === "Ascendant");

            // Only consider cache valid if key planets have valid signs
            if (sun && sun.sign !== "---" && moon && moon.sign !== "---" && asc && asc.sign !== "---") {
                isValidCache = true;
            }
        }

        if (isValidCache) {
            console.log("Using validated cached astrology chart");
            chartData = profile.astrology_chart as WesternChartData;
        } else {
            // Cache missing or invalid (e.g. Moon was "---"), so refetch
            if (profile?.astrology_chart) {
                console.log("Cached chart found but invalid (missing signs). Refetching...");
            }
            // Try Real API
            console.log("Fetching new astrology chart from API...");
            chartData = await getWesternChartData(details);

            // Cache the result
            if (chartData) {
                const { error: cacheError } = await supabase
                    .from('profiles')
                    .update({ astrology_chart: chartData })
                    .eq('id', user.id);

                if (cacheError) console.error("Error caching chart:", JSON.stringify(cacheError, null, 2));
            }
        }

        // Fallback for Demo if API fails or no key
        if (!chartData || chartData.planets.length === 0) {
            chartData = getMockChartData(details);
        }

        // DEBUG: Log planet data to investigate Moon issue
        if (chartData) {
            console.log("[ASTROLOGY DEBUG] Chart planets:", chartData.planets.map(p => ({ name: p.name, sign: p.sign })));
            const moon = chartData.planets.find(p => p.name === "Moon");
            console.log("[ASTROLOGY DEBUG] Moon data:", moon);
        }
    }

    return (
        <div className="min-h-screen text-slate-100 pb-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950/50 to-transparent" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[100px] animate-pulse" />
            </div>

            <AstrologyClient
                profile={profile}
                initialChartData={chartData}
                initialInterpretation={interpretation}
                t={t}
                tz={tz}
                locale={locale}
            />
        </div>
    );
}


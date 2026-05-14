import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/i18n/routing";
import { getMockChartData } from "@/lib/astrology-api";
import { getOrFetchChart } from "@/lib/supabase/astrology-cache";
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
        redirect({ href: "/login", locale });
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
    const chartData = profile?.birth_date ? await getOrFetchChart(user.id, profile) : null;
    
    // Fallback for Demo if API fails
    let finalChartData = chartData;
    if (profile?.birth_date && (!finalChartData || finalChartData.planets.length === 0)) {
        const [y, m, d] = profile.birth_date.split('-').map(Number);
        const [hour, minute] = profile.birth_time ? profile.birth_time.split(':').map(Number) : [12, 0];
        finalChartData = getMockChartData({
            year: y, month: m, date: d,
            hours: hour, minutes: minute,
            latitude: profile.latitude || 0,
            longitude: profile.longitude || 0,
            timezone: profile.timezone || 0
        });
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
                initialChartData={finalChartData}
                initialInterpretation={interpretation}
                t={t}
                tz={tz}
                locale={locale}
            />
        </div>
    );
}


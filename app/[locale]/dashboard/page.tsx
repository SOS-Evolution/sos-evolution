import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLifePathNumber, getZodiacSign, getNumerologyDetails } from "@/lib/soul-math";
import DashboardClient from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();

    // PERFORMANCE: getSession() lee JWT local (0 latencia de red)
    // Se acepta el warning de consola a favor de cargar el dashboard instantáneamente.
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        redirect("/login");
    }

    // PERFORMANCE: Paralelizar profile + top card
    const [profileResult, topCardsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.rpc('get_top_card'),
    ]);

    const profile = profileResult.data;
    const topCards = topCardsResult.data;
    const stats = (topCards && topCards.length > 0) ? topCards[0] : null;

    return <DashboardClient profile={profile} stats={stats} user={session.user} />;
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLifePathNumber, getZodiacSign, getNumerologyDetails } from "@/lib/soul-math";
import DashboardClient from "@/components/dashboard/DashboardClient";

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

    return <DashboardClient profile={profile} stats={stats} user={user} />;
}

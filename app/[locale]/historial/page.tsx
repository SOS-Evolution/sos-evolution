import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OracleService } from "@/src/services/oracle.service";
import SoulJournalClient from "@/components/features/tarot/SoulJournalClient";

export default async function HistoryPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const oracle = new OracleService(supabase);
    // Recuperar las tiradas del usuario agrupadas por spread_id (hasta 50 tiradas)
    const journalEntries = await oracle.getUserSoulJournal(user.id, 50);

    return <SoulJournalClient initialEntries={journalEntries} />;
}
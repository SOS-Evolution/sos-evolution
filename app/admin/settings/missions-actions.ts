"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMissions() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("missions")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching missions:", error);
        return [];
    }

    return data;
}

export async function updateMissionReward(id: string, credits: number) {
    const supabase = await createClient();

    // Validar permisos de admin (aunque RLS debería cubrirlo, doble check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Admin role required");
    }

    const { error } = await supabase
        .from("missions")
        .update({ reward_credits: credits })
        .eq("id", id);

    if (error) {
        throw new Error(`Failed to update reward for mission ${id}: ${error.message}`);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/(locale)/dashboard"); // Para que el usuario vea cambios en su lista de misiones
    revalidatePath("/dashboard");

    return { success: true };
}

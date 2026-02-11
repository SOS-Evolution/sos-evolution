"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getSystemSettings() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("system_settings")
        .select("*");

    if (error) {
        console.error("Error fetching system settings:", error);
        return [];
    }

    return data;
}

export async function updateSystemSetting(key: string, value: any) {
    const supabase = await createClient();

    // El RLS ya protege que solo admins puedan hacer esto
    const { data, error } = await supabase
        .from("system_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key);

    if (error) {
        throw new Error(`Failed to update setting ${key}: ${error.message}`);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/", "layout"); // Revalidar todo para que el cambio de marco se refleje

    return { success: true };
}

export async function getReadingTypes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("reading_types")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching reading types:", error);
        return [];
    }

    return data;
}

export async function updateReadingTypeCost(id: string, cost: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("reading_types")
        .update({ credit_cost: cost })
        .eq("id", id);

    if (error) {
        throw new Error(`Failed to update cost for reading type ${id}: ${error.message}`);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/(locale)/dashboard", "page");
    revalidatePath("/(locale)/astrology", "page");
    revalidatePath("/(locale)/numerology", "page");

    return { success: true };
}

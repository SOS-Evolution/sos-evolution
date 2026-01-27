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

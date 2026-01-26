"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function adjustUserCredits(formData: FormData) {
    const supabase = await createClient();

    const userId = formData.get("userId") as string;
    const amount = parseInt(formData.get("amount") as string);
    const description = formData.get("description") as string;

    if (!userId || isNaN(amount)) return { error: "Datos inválidos" };

    // Usamos la funcion RPC add_credits que es SECURITY DEFINER
    const { error } = await supabase.rpc('add_credits', {
        p_user_id: userId,
        p_amount: amount,
        p_source: 'admin',
        p_description: description || "Ajuste manual por administrador"
    });

    if (error) {
        console.error("Error adjusting credits:", error);
        return;
    }

    revalidatePath(`/admin/users/${userId}`);
}

export async function updateUserRole(userId: string, newRole: 'admin' | 'user') {
    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) return { error: error.message };

    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
}

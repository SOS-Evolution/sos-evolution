"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updatePassword(formData: FormData) {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return redirect("/dashboard/profile/reset-password?error=Las contraseñas no coinciden");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return redirect(`/dashboard/profile/reset-password?error=${error.message}`);
    }

    revalidatePath("/", "layout");
    return redirect("/dashboard?message=Contraseña actualizada correctamente");
}

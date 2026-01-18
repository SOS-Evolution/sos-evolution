"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const fullName = formData.get("fullName") as string;
    const birthDate = formData.get("birthDate") as string;
    const birthPlace = formData.get("birthPlace") as string;

    console.log("Actualizando perfil:", { fullName, birthDate, birthPlace });

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            birth_date: birthDate,
            birth_place: birthPlace,
        },
    });

    if (error) {
        console.error("Error Supabase:", error);
        throw new Error("No se pudo actualizar el perfil");
    }

    revalidatePath("/dashboard");
    return { success: true };
}
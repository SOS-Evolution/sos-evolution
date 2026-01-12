"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    // 1. Obtener datos del formulario
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 2. Intentar loguearse
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // Si falla, redirigimos con un error en la URL
        return redirect("/login?error=Credenciales invalidas");
    }

    // 3. Si funciona, revalidamos la caché y vamos al inicio
    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return redirect("/login?error=Error al registrarse");
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";

export async function signInWithOAuth(provider: Provider) {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return redirect("/login?error=Error al conectar con " + provider);
    }

    if (data.url) {
        return redirect(data.url);
    }
}

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

    // Obtenemos la URL base automáticamente (localhost o vercel)
    // OJO: En Vercel a veces es necesario definir NEXT_PUBLIC_SITE_URL en variables de entorno
    // Si da problemas, puedes poner tu dominio "hardcoded" temporalmente.
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // AQUÍ ESTÁ EL CAMBIO: Le decimos a dónde volver
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return redirect("/login?error=Error al registrarse");
    }

    // CAMBIO PARA EL PUNTO 2: No redirigimos al dashboard, sino a un mensaje de éxito
    redirect("/login?message=check_email");
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/dashboard/profile/reset-password`,
    });

    if (error) {
        return redirect("/login?error=No se pudo enviar el correo de recuperación");
    }

    return redirect("/login?message=check_email");
}

export async function logout() {
    const supabase = await createClient();

    // 1. El servidor cierra la sesión y borra la cookie
    await supabase.auth.signOut();

    // 2. Redirigimos a la raíz
    // (No necesitas revalidatePath porque redirect ya fuerza una nueva navegación)
    redirect("/");
}
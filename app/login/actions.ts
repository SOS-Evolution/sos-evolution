"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { headers } from "next/headers";

/**
 * Detecta el origen (protocolo + host) de la petición de forma dinámica.
 * Esto evita redirecciones incorrectas a producción desde localhost.
 */
async function getOrigin() {
    const headerList = await headers();
    const host = headerList.get("host"); // ej: localhost:3000 o sos-evolution.com
    const proto = headerList.get("x-forwarded-proto"); // ej: https (en proxies como Vercel)

    // Si no hay host (Raro en una request), fallback al env o localhost
    if (!host) return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Detectar si es local para forzar http si no hay x-forwarded-proto
    const isLocal = host.includes("localhost") ||
        host.includes("127.0.0.1") ||
        host.startsWith("192.168.") ||
        host.startsWith("10.") ||
        host.startsWith("172.");

    const protocol = proto || (isLocal ? "http" : "https");
    return `${protocol}://${host}`;
}

export async function signInWithOAuth(provider: Provider, next: string | null = null) {
    const supabase = await createClient();
    const origin = await getOrigin();

    // Si hay next, lo adjuntamos al callback
    const redirectTo = next
        ? `${origin}/auth/callback?next=${next}`
        : `${origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
            redirectTo,
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

    // 3. Si funciona, revalidamos la caché y vamos al inicio (o donde deba ir)
    const next = formData.get("next") as string;
    revalidatePath("/", "layout");
    redirect(next || "/dashboard");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const origin = await getOrigin();

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
    redirect(`/login?message=check_email&email=${encodeURIComponent(email)}`);
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;
    const origin = await getOrigin();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/dashboard/profile/reset-password`,
    });

    if (error) {
        return redirect("/login?error=No se pudo enviar el correo de recuperación");
    }

    return redirect(`/login?message=check_email&email=${encodeURIComponent(email)}`);
}

export async function logout() {
    const supabase = await createClient();

    // 1. El servidor cierra la sesión y borra la cookie
    await supabase.auth.signOut();

    // 2. Redirigimos a la raíz
    // (No necesitas revalidatePath porque redirect ya fuerza una nueva navegación)
    redirect("/");
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
// IMPORTACIONES NUEVAS
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import ParticlesBackground from "@/components/landing/ParticlesBackground";
import { ConfigProvider } from "@/components/providers/ConfigProvider";
import { getSystemSettings } from "@/app/admin/settings/actions";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL('https://sos-evolution.com'),
    title: {
        default: "SOS Evolution | Soul Operating System",
        template: "%s | SOS Evolution"
    },
    description: "Plataforma de autodescubrimiento que combina Inteligencia Artificial y Tarot evolutivo para construir el mapa de tu alma.",
    keywords: ["Tarot", "IA", "Espiritualidad", "Autoconocimiento", "Carl Jung", "Viaje del Heroe"],
    authors: [{ name: "SOS Evolution Team" }],
    openGraph: {
        title: "SOS Evolution | Soul Operating System",
        description: "Descubre tu mapa evolutivo con Tarot e Inteligencia Artificial.",
        url: "https://sos-evolution.com",
        siteName: "SOS Evolution",
        locale: "es_ES",
        type: "website",
    },
};

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Asegurar que el locale es válido
    if (!['es', 'en'].includes(locale)) {
        notFound();
    }

    // Cargar mensajes del servidor
    const messages = await getMessages();

    // 1. Obtenemos el usuario en el servidor (una sola vez para toda la app)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1.1 Obtenemos el perfil completo
    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('role, full_name, display_name')
            .eq('id', user.id)
            .single();
        profile = data;
    }

    const role = profile?.role || 'client';

    // 2. Cargamos configuraciones globales (marco de tarot, etc)
    const settings = await getSystemSettings();

    return (
        <html lang={locale}>
            <body className={`${inter.className} bg-slate-950`}>
                <NextIntlClientProvider messages={messages} locale={locale}>
                    <ConfigProvider initialSettings={settings}>
                        <Toaster position="top-right" richColors />
                        <ParticlesBackground />

                        {/* 2. Aquí va la Barra Global */}
                        <Navbar user={user} role={role} profile={profile} />

                        {/* El contenido de cada página se renderiza aquí abajo */}
                        {children}
                    </ConfigProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORTACIONES NUEVAS
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import ParticlesBackground from "@/components/landing/ParticlesBackground";
import { ConfigProvider } from "@/components/providers/ConfigProvider";
import { getSystemSettings } from "./admin/settings/actions";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

// --- AQUÍ ESTÁ EL CAMBIO ---
export const metadata: Metadata = {
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
    url: "https://sos-evolution.com", // Pon tu dominio real si ya lo tienes
    siteName: "SOS Evolution",
    locale: "es_ES",
    type: "website",
  },
};
// ---------------------------

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Obtenemos el usuario en el servidor (una sola vez para toda la app)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1.1 Obtenemos el perfil para saber el rol
  let role = 'client';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role || 'client';
  }

  // 2. Cargamos configuraciones globales (marco de tarot, etc)
  const settings = await getSystemSettings();

  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950`}>
        <ConfigProvider initialSettings={settings}>
          <Toaster position="top-right" richColors />
          <ParticlesBackground />

          {/* 2. Aquí va la Barra Global */}
          <Navbar user={user} role={role} />

          {/* El contenido de cada página se renderiza aquí abajo */}
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
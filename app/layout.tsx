import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORTACIONES NUEVAS
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-950`}>
        {/* 2. Aquí va la Barra Global */}
        <Navbar user={user} />

        {/* El contenido de cada página se renderiza aquí abajo */}
        {children}
      </body>
    </html>
  );
}
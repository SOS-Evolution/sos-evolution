import type { Metadata } from "next";
import { Inter } from "next/font/google"; // O la fuente que estés usando
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
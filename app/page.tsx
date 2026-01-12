import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-slate-950 relative flex flex-col items-center justify-center text-center p-6 overflow-hidden">

      {/* Fondos */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />

      <div className="relative z-10 max-w-3xl space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 backdrop-blur-md text-purple-200 text-sm font-medium shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Soul Operating System v1.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
          SOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Evolution</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          Una plataforma de autodescubrimiento que combina <strong className="text-white font-semibold">Inteligencia Artificial</strong> y el lenguaje simbólico del <strong className="text-white font-semibold">Tarot</strong>.
        </p>

        <div className="pt-8">
          {/* ÚNICO BOTÓN PRINCIPAL */}
          <Link href={user ? "/dashboard" : "/login"}>
            <Button size="lg" className="bg-white text-purple-950 hover:bg-slate-200 hover:scale-105 transition-all text-lg px-10 py-7 rounded-full font-bold shadow-[0_0_30px_rgba(147,51,234,0.3)]">
              {user ? "Ir a mi Panel de Control" : "Comenzar el Viaje (Ingresar)"}
            </Button>
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-4 text-slate-500 text-xs">
        <p>© 2026 SOS Evolution.</p>
      </footer>
    </main>
  );
}
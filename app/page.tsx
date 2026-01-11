import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#1a103c] to-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">

      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-3xl space-y-8">

        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-purple-200 text-sm font-medium animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Soul Operating System v1.0</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-lg">
          SOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Evolution</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Una plataforma de autodescubrimiento que combina <span className="text-white font-semibold">Inteligencia Artificial</span> y el lenguaje simbólico del <span className="text-white font-semibold">Tarot</span> para construir el mapa de tu alma.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/lectura">
            <Button size="lg" className="bg-white text-purple-950 hover:bg-slate-200 text-lg px-8 py-6 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105">
              Iniciar El Viaje
            </Button>
          </Link>

          <Button variant="outline" size="lg" className="border-purple-500/50 text-purple-200 hover:bg-purple-900/20 hover:text-white px-8 py-6 rounded-full text-lg">
            Saber más <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-slate-600 text-sm">
        <p>© 2024 SOS Evolution. The Evolution of the Spirit.</p>
      </footer>

    </main>
  );
}
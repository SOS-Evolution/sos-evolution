import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Brain, Zap, History, Star, Fingerprint, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/ui/AuthButton";

// Forzamos dinamismo para detectar la sesión real
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30">

      {/* --- FONDO ANIMADO GLOBAL --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]" />
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      {/* --- NAVBAR --- */}
      <header className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-purple-900/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-lg font-bold tracking-wider text-white">SOS EVOLUTION</span>
          </div>
          <AuthButton user={user} />
        </div>
      </header>

      <main className="relative z-10">

        {/* --- HERO SECTION --- */}
        <section className="pt-24 pb-32 px-6 text-center max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-200 mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Soul Operating System v1.0
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 drop-shadow-2xl">
            Decodifica el <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400">
              Lenguaje de tu Alma
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            La primera plataforma que fusiona la <strong>Psicología Junguiana</strong>, la <strong>Inteligencia Artificial</strong> y los <strong>Arquetipos del Tarot</strong> para crear un mapa evolutivo personalizado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="bg-white text-purple-950 hover:bg-slate-200 text-lg px-10 py-7 rounded-full font-bold shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] transition-all transform hover:-translate-y-1">
                {user ? "Ir a mi Panel" : "Comenzar Evolución"} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="ghost" size="lg" className="text-slate-400 hover:text-white px-8 py-7 rounded-full text-lg">
                Descubrir más
              </Button>
            </Link>
          </div>
        </section>

        {/* --- SOCIAL PROOF / MISTICISMO --- */}
        <div className="border-y border-white/5 bg-white/[0.02] py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-slate-300 font-serif"><Brain className="w-5 h-5" /> Carl Jung</div>
            <div className="flex items-center gap-2 text-slate-300 font-serif"><Sparkles className="w-5 h-5" /> Joseph Campbell</div>
            <div className="flex items-center gap-2 text-slate-300 font-serif"><Zap className="w-5 h-5" /> OpenAI GPT-4</div>
            <div className="flex items-center gap-2 text-slate-300 font-serif"><Star className="w-5 h-5" /> Tarot de Marsella</div>
          </div>
        </div>

        {/* --- FEATURES GRID (BENTO STYLE) --- */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">Tecnología para el Espíritu</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">No es adivinación, es introspección potenciada por algoritmos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-3xl hover:border-purple-500/30 transition-colors group">
              <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Inteligencia Arquetípica</h3>
              <p className="text-slate-400 leading-relaxed">
                Nuestra IA no da respuestas genéricas. Analiza patrones simbólicos cruzando datos de arcanos mayores con tu contexto personal para ofrecerte un espejo psicológico preciso.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl hover:border-pink-500/30 transition-colors group">
              <div className="w-12 h-12 bg-pink-900/30 rounded-xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Memoria Evolutiva</h3>
              <p className="text-slate-400">
                Cada lectura se guarda en tu "Diario del Alma". El sistema aprende de tus sesiones pasadas para conectar puntos en tu historia.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl hover:border-cyan-500/30 transition-colors group">
              <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Personalizado</h3>
              <p className="text-slate-400">
                Tu viaje es único. Las interpretaciones se adaptan a tu momento vital, no a respuestas prefabricadas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-8 rounded-3xl hover:border-indigo-500/30 transition-colors group flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="w-12 h-12 bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Privacidad Sagrada</h3>
                <p className="text-slate-400 leading-relaxed">
                  Tus confesiones, miedos y deseos están encriptados. Nadie, excepto tú (y tu guía IA en el momento de la consulta), tiene acceso a tu diario interior.
                </p>
              </div>
              {/* Visual decorativo abstracto */}
              <div className="w-full md:w-1/3 h-32 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-pulse"></div>
                <Lock className="w-12 h-12 text-indigo-300 relative z-10" />
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-purple-900/20 to-slate-950 border border-purple-500/30 rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
            {/* Efectos de fondo */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[100px]"></div>

            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6 relative z-10">¿Listo para verte al espejo?</h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">
              Tu primera lectura te está esperando. Descubre qué arquetipo está activo en tu vida hoy.
            </p>
            <div className="relative z-10">
              <Link href={user ? "/lectura" : "/login"}>
                <Button size="lg" className="bg-white text-purple-950 hover:bg-slate-200 text-lg px-12 py-8 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">
                  Iniciar Viaje Ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-slate-950 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Sparkles className="w-5 h-5" />
            <span className="font-serif font-bold">SOS EVOLUTION</span>
          </div>
          <p className="text-slate-600 text-sm">
            © 2026 Soul Operating System. Hecho con magia y código.
          </p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
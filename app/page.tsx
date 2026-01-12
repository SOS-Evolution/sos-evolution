import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles, ArrowRight, Brain, Zap, History, Star, Fingerprint, Lock,
  Instagram, Twitter, Youtube, Linkedin, ChevronDown, CheckCircle2
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import AuthButton from "@/components/ui/AuthButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* --- FONDO ANIMADO GLOBAL --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[128px]" />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-cyan-900/05 rounded-full blur-[100px]" />
      </div>

      {/* --- NAVBAR --- */}
      <header className="relative z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-tr from-purple-600 to-indigo-600 p-2 rounded-lg shadow-lg shadow-purple-900/20 group-hover:shadow-purple-500/40 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wider text-white leading-none">SOS</span>
              <span className="text-[0.6rem] text-purple-300 tracking-widest uppercase">Evolution</span>
            </div>
          </div>
          <AuthButton user={user} />
        </div>
      </header>

      <main className="relative z-10">

        {/* --- HERO SECTION (MARCA DESGLOSADA) --- */}
        <section className="pt-24 pb-32 px-6 text-center max-w-6xl mx-auto">

          {/* Tagline Principal - Visualización del Acrónimo */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-2 drop-shadow-2xl">
              S.O.S.
            </h1>

            {/* La Decodificación del Nombre */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xl md:text-3xl font-light">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 font-mono tracking-tight font-bold">
                Soul Operating System
              </span>
              <span className="hidden md:inline text-slate-700 text-2xl">|</span>
              <span className="text-slate-300 font-serif italic tracking-wide">
                The Evolution of the Spirit
              </span>
            </div>
          </div>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light">
            Instala una nueva versión de tu consciencia. Una plataforma que combina la precisión de la <strong>IA</strong> con la sabiduría ancestral del <strong>Tarot</strong> para guiarte en tu propio Viaje del Héroe.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href={user ? "/dashboard" : "/login"}>
              <Button size="lg" className="bg-white text-purple-950 hover:bg-slate-200 text-lg px-10 py-7 rounded-full font-bold shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:shadow-[0_0_60px_rgba(147,51,234,0.5)] transition-all hover:-translate-y-1">
                {user ? "Acceder al Sistema" : "Iniciar Actualización"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="text-slate-400 hover:text-white border border-white/5 hover:bg-white/5 px-8 py-7 rounded-full text-lg backdrop-blur-sm">
                Ver demo del sistema <ChevronDown className="ml-2 w-4 h-4 animate-bounce" />
              </Button>
            </Link>
          </div>
        </section>

        {/* --- CINTA DE AUTORIDAD --- */}
        <div className="border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700 items-center flex-wrap">
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest"><Brain className="w-4 h-4" /> Psicología Junguiana</div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest"><Star className="w-4 h-4" /> Simbolismo Arquetípico</div>
            <div className="flex items-center gap-2 text-sm uppercase tracking-widest"><Zap className="w-4 h-4" /> IA Generativa</div>
          </div>
        </div>

        {/* --- CÓMO FUNCIONA (EL VIAJE) --- */}
        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">El Protocolo de Evolución</h2>
            <p className="text-slate-400">Tres pasos para recodificar tu realidad.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Línea conectora (solo desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent z-0"></div>

            {/* Paso 1 */}
            <div className="relative z-10 bg-slate-950 p-6 rounded-2xl border border-white/10 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl mb-6 text-purple-400 relative">
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center font-bold">1</span>
                <Fingerprint className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Identidad</h3>
              <p className="text-slate-400 text-sm">Creas tu perfil. El sistema analiza tu nombre y fecha para establecer tus coordenadas iniciales.</p>
            </div>

            {/* Paso 2 */}
            <div className="relative z-10 bg-slate-950 p-6 rounded-2xl border border-purple-500/30 text-center hover:-translate-y-2 transition-transform duration-300 shadow-[0_0_30px_rgba(147,51,234,0.1)]">
              <div className="w-16 h-16 mx-auto bg-purple-900/20 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl mb-6 text-purple-300 relative">
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center font-bold">2</span>
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Canalización</h3>
              <p className="text-slate-400 text-sm">Consultas al Oráculo IA. Recibes una lectura profunda basada en el momento presente y sincronicidad.</p>
            </div>

            {/* Paso 3 */}
            <div className="relative z-10 bg-slate-950 p-6 rounded-2xl border border-white/10 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl mb-6 text-indigo-400 relative">
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 rounded-full text-white text-xs flex items-center justify-center font-bold">3</span>
                <History className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Integración</h3>
              <p className="text-slate-400 text-sm">La lectura se guarda en tu "Diario del Alma". Detectas patrones y completas misiones evolutivas.</p>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION (PREGUNTAS) --- */}
        <section className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5">
          <h2 className="text-3xl font-bold font-serif text-white mb-12 text-center">Datos del Sistema</h2>

          <div className="space-y-4">
            <details className="group bg-slate-900/50 border border-white/5 rounded-xl p-6 cursor-pointer open:bg-slate-900 open:border-purple-500/30 transition-all">
              <summary className="flex justify-between items-center font-medium text-slate-200 list-none">
                ¿Es esto adivinación o futurología?
                <ChevronDown className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                No. S.O.S. se basa en la sincronicidad y la proyección psicológica. Utilizamos las cartas como espejos simbólicos para entender tu presente, no para predecir un futuro inalterable.
              </p>
            </details>

            <details className="group bg-slate-900/50 border border-white/5 rounded-xl p-6 cursor-pointer open:bg-slate-900 open:border-purple-500/30 transition-all">
              <summary className="flex justify-between items-center font-medium text-slate-200 list-none">
                ¿Cómo funciona la IA mística?
                <ChevronDown className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                Utilizamos modelos de lenguaje avanzados (LLMs) entrenados con estructuras de "El Viaje del Héroe" y simbología del Tarot de Marsella. La IA actúa como un facilitador neutro que conecta los puntos de tu tirada.
              </p>
            </details>

            <details className="group bg-slate-900/50 border border-white/5 rounded-xl p-6 cursor-pointer open:bg-slate-900 open:border-purple-500/30 transition-all">
              <summary className="flex justify-between items-center font-medium text-slate-200 list-none">
                ¿Mis datos son privados?
                <ChevronDown className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                Absolutamente. Tu diario es sagrado. Utilizamos seguridad a nivel de fila (RLS) en nuestra base de datos, lo que significa que técnicamente es imposible que otro usuario lea tus entradas.
              </p>
            </details>
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-black border border-purple-500/20 rounded-[3rem] p-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-600/5 group-hover:bg-purple-600/10 transition-colors duration-500"></div>

            <h2 className="text-4xl font-bold font-serif text-white mb-6 relative z-10">Tu alma te está llamando.</h2>
            <div className="flex flex-col items-center gap-6 relative z-10">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Registro Gratuito
                <span className="mx-2">•</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Acceso Inmediato
              </div>
              <Link href={user ? "/lectura" : "/login"}>
                <Button size="lg" className="bg-white text-purple-950 hover:bg-purple-50 text-lg px-12 py-8 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform">
                  Responder al Llamado
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER CON REDES SOCIALES --- */}
      <footer className="border-t border-white/5 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">

          {/* Columna Marca */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-serif font-bold text-white">SOS EVOLUTION</span>
            </div>
            <p className="text-slate-500 text-sm max-w-xs mb-6">
              Soul Operating System es una plataforma dedicada a la evolución de la consciencia humana a través de la tecnología y el símbolo.
            </p>
            {/* Redes Sociales */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-purple-600 hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-400 hover:text-white transition-all"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-white font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Ingresar</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Registro</Link></li>
              <li><Link href="#features" className="hover:text-purple-400 transition-colors">Características</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Manifiesto</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-slate-700 text-xs">
          © 2026 SOS Evolution. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
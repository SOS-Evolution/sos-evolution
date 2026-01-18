import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sparkles, Brain, Zap, History, Star, Fingerprint,
  Instagram, Twitter, Youtube, Linkedin, ChevronDown, CheckCircle2, Moon
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import AnimatedSection from "@/components/landing/AnimatedSection";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen text-slate-200 font-sans overflow-x-hidden">

      {/* ===== FONDO ANIMADO PREMIUM ===== */}


      {/* Aurora Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-transparent rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-indigo-900/20 via-violet-900/10 to-transparent rounded-full blur-[100px] animate-float-delayed" />
        <div className="absolute top-[30%] right-[20%] w-[25%] h-[25%] bg-cyan-900/10 rounded-full blur-[80px] animate-float" />
      </div>

      <main className="relative z-10">

        {/* ===== HERO SECTION - IMPACTO MÁXIMO ===== */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative">

          {/* Badge de novedad */}
          <div className="animate-fade-in-up mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-purple-300 border border-purple-500/20">
              <Moon className="w-4 h-4" />
              Versión Beta — En Desarrollo
            </span>
          </div>

          {/* Título Principal - Letras con efecto gradiente animado */}
          <h1 className="animate-fade-in-up text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-shift">
              S.O.S.
            </span>
          </h1>

          {/* Subtítulo con gradiente */}
          <div className="animate-fade-in-up flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-xl md:text-3xl font-light mb-8" style={{ animationDelay: "0.2s" }}>
            <span className="text-gradient-purple font-mono tracking-tight font-bold">
              Soul Operating System
            </span>
            <span className="hidden md:inline text-slate-700 text-2xl">|</span>
            <span className="text-slate-400 font-serif italic tracking-wide">
              The Evolution of the Spirit
            </span>
          </div>

          {/* Descripción */}
          <p className="animate-fade-in-up text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light" style={{ animationDelay: "0.4s" }}>
            Instala una nueva versión de tu consciencia. Una plataforma que fusiona
            <strong className="text-purple-300"> Inteligencia Artificial </strong>
            con la sabiduría ancestral del
            <strong className="text-purple-300"> Tarot </strong>
            para guiarte en tu propio Viaje del Héroe.
          </p>

          {/* CTAs - VERTICALES Y ANCHOS */}
          <div className="animate-fade-in-up flex flex-col items-center gap-4 w-full max-w-sm mx-auto" style={{ animationDelay: "0.6s" }}>
            <Link href={user ? "/dashboard" : "/login"} className="w-full">
              <Button
                size="lg"
                className="w-full bg-white text-purple-950 hover:bg-purple-50 text-lg px-8 py-7 rounded-full font-bold animate-glow-pulse hover:scale-[1.02] transition-transform group"
              >
                {user ? "ACCEDER AL SISTEMA" : "¡INICIA EL VIAJE!"}
                <Sparkles className="ml-2 w-5 h-5 text-purple-600 group-hover:rotate-12 transition-transform animate-pulse" />
              </Button>
            </Link>

            <Link href="#how-it-works" className="w-full">
              <Button
                variant="ghost"
                size="lg"
                className="w-full text-slate-400 hover:text-white border border-transparent hover:border-white/10 hover:bg-white/5 px-8 py-6 rounded-full text-lg backdrop-blur-sm transition-all"
              >
                ¿Cómo Funciona?
                <ChevronDown className="ml-2 w-4 h-4 animate-bounce" />
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* ===== CINTA DE AUTORIDAD ===== */}
        <AnimatedSection className="border-y border-white/5 bg-white/[0.02] py-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 flex justify-center gap-8 md:gap-20 items-center flex-wrap">
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-colors">
              <Brain className="w-5 h-5" /> Psicología Junguiana
            </div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-colors">
              <Star className="w-5 h-5" /> Simbolismo Arquetípico
            </div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-slate-500 hover:text-purple-400 transition-colors">
              <Zap className="w-5 h-5" /> IA Generativa
            </div>
          </div>
        </AnimatedSection>

        {/* ===== CÓMO FUNCIONA - CARDS PREMIUM ===== */}
        <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6">
              El Protocolo de <span className="text-gradient-purple">Evolución</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Tres pasos para recodificar tu realidad y despertar tu potencial oculto.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Línea conectora animada */}
            <div className="hidden md:block absolute top-20 left-[15%] w-[70%] h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent z-0" />

            {/* Paso 1 */}
            <AnimatedSection delay={0.1} direction="up">
              <GlowingBorderCard className="h-full">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600/20 to-indigo-600/20 rounded-2xl flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full text-white text-sm flex items-center justify-center font-bold shadow-lg">1</span>
                    <Fingerprint className="w-10 h-10 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Identidad</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Creas tu perfil sagrado. El sistema analiza tu nombre y fecha para establecer tus coordenadas cósmicas iniciales.
                  </p>
                </div>
              </GlowingBorderCard>
            </AnimatedSection>

            {/* Paso 2 */}
            <AnimatedSection delay={0.2} direction="up">
              <GlowingBorderCard className="h-full" glowColor="purple">
                <div className="p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-purple-600/5" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500/30 to-violet-500/30 rounded-2xl flex items-center justify-center mb-6 animate-breathe relative">
                      <span className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full text-white text-sm flex items-center justify-center font-bold shadow-lg">2</span>
                      <Sparkles className="w-10 h-10 text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Canalización</h3>
                    <p className="text-slate-400 leading-relaxed">
                      Consultas al Oráculo IA. Recibes una lectura profunda basada en el momento presente y la sincronicidad.
                    </p>
                  </div>
                </div>
              </GlowingBorderCard>
            </AnimatedSection>

            {/* Paso 3 */}
            <AnimatedSection delay={0.3} direction="up">
              <GlowingBorderCard className="h-full">
                <div className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 relative">
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 rounded-full text-white text-sm flex items-center justify-center font-bold shadow-lg">3</span>
                    <History className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Integración</h3>
                  <p className="text-slate-400 leading-relaxed">
                    La lectura se guarda en tu "Diario del Alma". Detectas patrones y completas misiones evolutivas.
                  </p>
                </div>
              </GlowingBorderCard>
            </AnimatedSection>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <AnimatedSection className="py-24 px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold font-serif text-white mb-16 text-center">
            Datos del <span className="text-gradient-purple">Sistema</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "¿Es esto adivinación o futurología?",
                a: "No. S.O.S. se basa en la sincronicidad y la proyección psicológica. Utilizamos las cartas como espejos simbólicos para entender tu presente, no para predecir un futuro inalterable."
              },
              {
                q: "¿Cómo funciona la IA mística?",
                a: "Utilizamos modelos de lenguaje avanzados entrenados con estructuras de \"El Viaje del Héroe\" y simbología del Tarot de Marsella. La IA actúa como un facilitador neutro."
              },
              {
                q: "¿Mis datos son privados?",
                a: "Absolutamente. Tu diario es sagrado. Utilizamos seguridad a nivel de fila (RLS) en nuestra base de datos, lo que significa que es técnicamente imposible que otro usuario lea tus entradas."
              }
            ].map((faq, i) => (
              <details key={i} className="group glass rounded-2xl overflow-hidden">
                <summary className="flex justify-between items-center p-6 cursor-pointer font-medium text-slate-200 list-none hover:bg-white/5 transition-colors">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-purple-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <p className="text-slate-400 px-6 pb-6 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </AnimatedSection>

        {/* ===== CTA FINAL - MÁXIMO IMPACTO ===== */}
        <AnimatedSection className="py-32 px-6 text-center">
          <div className="max-w-4xl mx-auto relative">
            <GlowingBorderCard glowColor="purple">
              <div className="p-16 relative overflow-hidden">
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-indigo-900/20 animate-aurora" />

                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6">
                    Tu alma te está <span className="text-gradient-purple">llamando</span>.
                  </h2>

                  <div className="flex items-center justify-center gap-6 text-slate-400 text-sm mb-10">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Registro Gratuito
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Acceso Inmediato
                    </span>
                  </div>

                  <Link href={user ? "/lectura" : "/login"}>
                    <Button
                      size="lg"
                      className="bg-white text-purple-950 hover:bg-purple-50 text-xl px-14 py-8 rounded-full font-bold shadow-2xl hover:scale-105 transition-all animate-breathe"
                    >
                      Responder al Llamado
                      <Sparkles className="ml-3 w-6 h-6" />
                    </Button>
                  </Link>
                </div>
              </div>
            </GlowingBorderCard>
          </div>
        </AnimatedSection>

      </main>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/5 bg-black/50 backdrop-blur-sm py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

          {/* Marca */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-white">SOS EVOLUTION</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
              Soul Operating System es una plataforma dedicada a la evolución de la consciencia humana a través de la tecnología y el símbolo.
            </p>

            {/* Redes Sociales */}
            <div className="flex gap-3">
              {[Instagram, Twitter, Youtube, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-purple-600 hover:text-white transition-all hover:scale-110">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Plataforma</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Ingresar</Link></li>
              <li><Link href="/login" className="hover:text-purple-400 transition-colors">Registro</Link></li>
              <li><Link href="#how-it-works" className="hover:text-purple-400 transition-colors">Características</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Privacidad</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Manifiesto</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-slate-700 text-xs">
          © 2026 SOS Evolution. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
"use client";

import { useState } from "react";
import { TarotCard } from "@/components/magic/TarotCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

// Definimos el tipo de datos que esperamos de la IA
interface ReadingData {
  cardName: string;
  keywords: string[];
  description: string;
  action: string;
}

export default function ReadingPage() {
  const [step, setStep] = useState<"intro" | "shuffling" | "reveal" | "reading">("intro");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [readingData, setReadingData] = useState<ReadingData | null>(null);

  const startReading = async () => {
    setStep("shuffling");
    setIsLoading(true);

    try {
      // 1. Llamamos a nuestra propia API
      const response = await fetch("/api/lectura", { method: "POST" });
      const data = await response.json();

      // 2. Guardamos los datos que trajo la IA
      setReadingData(data);

      // 3. Pasamos a la fase de revelar
      setTimeout(() => {
        setIsLoading(false);
        setStep("reveal");
      }, 2000); // Mínimo 2 seg de espera para dar emoción

    } catch (error) {
      console.error("Error conectando con el alma:", error);
      alert("Error de conexión cósmica. Intenta de nuevo.");
      setStep("intro");
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    if (step === "reveal") {
      setIsRevealed(true);
      setTimeout(() => setStep("reading"), 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">

      {/* HEADER SIMPLE */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center opacity-50">
        <h1 className="text-xl font-serif tracking-widest text-purple-300">SOS EVOLUTION</h1>
      </nav>

      {/* ZONA CENTRAL */}
      <main className="flex flex-col items-center gap-8 max-w-md w-full z-10">

        {step === "intro" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
              El Espejo del Alma
            </h2>
            <p className="text-slate-400">
              La IA sincronizará con tu energía actual para revelar el arquetipo que necesitas integrar hoy.
            </p>
            <Button
              onClick={startReading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all"
            >
              Consultar Oráculo
            </Button>
          </motion.div>
        )}

        {step === "shuffling" && (
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-purple-500" />
            </motion.div>
            <p className="text-purple-300 font-serif text-lg animate-pulse">Sintonizando frecuencia...</p>
          </div>
        )}

        {(step === "reveal" || step === "reading") && readingData && (
          <div className="flex flex-col items-center gap-6">
            <p className="text-sm text-slate-500 uppercase tracking-widest animate-fade-in">
              {isRevealed ? "Tu Mensaje" : "Toca para revelar"}
            </p>

            <TarotCard
              isRevealed={isRevealed}
              onClick={handleCardClick}
              cardName={readingData.cardName}
            // Aquí en el futuro pondremos la URL de la imagen real
            />
          </div>
        )}

        {/* INTERPRETACIÓN REAL DE LA IA */}
        {step === "reading" && readingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Card className="bg-slate-900/80 border-purple-500/20 p-6 backdrop-blur-md shadow-2xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-serif text-purple-200">{readingData.cardName}</h3>
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {readingData.keywords?.map((k, i) => (
                  <span key={i} className="text-xs bg-purple-950 text-purple-300 px-2 py-1 rounded-md border border-purple-500/20">{k}</span>
                )) || <span className="text-xs text-slate-500">Sin palabras clave</span>}
              </div>

              <p className="text-slate-300 leading-relaxed text-sm mb-6 font-light">
                {readingData.description}
              </p>

              <div className="p-4 bg-gradient-to-r from-purple-900/30 to-slate-900 rounded-lg border border-purple-500/30">
                <p className="text-xs text-purple-300 font-bold mb-2 uppercase tracking-wide">⚡ Misión Evolutiva:</p>
                <p className="text-sm text-slate-200 italic">"{readingData.action}"</p>
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-slate-500 hover:text-white hover:bg-white/5"
                onClick={() => { setStep("intro"); setIsRevealed(false); }}
              >
                Nueva Lectura
              </Button>
            </Card>
          </motion.div>
        )}

      </main>
    </div>
  );
}
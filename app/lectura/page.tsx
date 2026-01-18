"use client";

import { useState } from "react";
import { TarotCard } from "@/components/features/tarot/TarotCard";
import TarotDeck from "@/components/features/tarot/TarotDeck";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Sparkles, RotateCcw, Home, MessageCircleQuestion, ScanEye } from "lucide-react";
import { ReadingData } from "@/types";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import Link from "next/link";
import { Input } from "@/components/ui/input";

type ReadingMode = "oracle" | "question";
type Step = "selection" | "question_input" | "card_selection" | "processing" | "reveal" | "reading";

export default function ReadingPage() {
  const [step, setStep] = useState<Step>("selection");
  const [selectedMode, setSelectedMode] = useState<ReadingMode>("oracle");
  const [question, setQuestion] = useState("");
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [readingData, setReadingData] = useState<ReadingData | null>(null);

  // 1. SELECCIONAR MODO
  const selectMode = (mode: ReadingMode) => {
    setSelectedMode(mode);
    if (mode === "oracle") {
      setStep("card_selection"); // Directo a elegir carta
    } else {
      setStep("question_input"); // Primero pedir pregunta
    }
  };

  // 2. CONFIRMAR PREGUNTA -> IR A SELECCIÓN DE CARTA
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setStep("card_selection");
  };

  // 3. USUARIO ELIGE UNA CARTA DEL MAZO
  const handleCardSelect = async (cardIndex: number) => {
    setSelectedCardIndex(cardIndex);
    setStep("processing");

    try {
      const response = await fetch("/api/lectura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || null,
          cardIndex: cardIndex
        })
      });

      const data = await response.json();
      setReadingData(data);

      // Pequeña pausa para la animación de "procesando"
      setTimeout(() => {
        setStep("reveal");
      }, 1500);

    } catch (error) {
      console.error("Error conectando con el alma:", error);
      alert("Error de conexión cósmica. Intenta de nuevo.");
      setStep("selection");
    }
  };

  // 4. REVELAR CARTA (animación de flip)
  const handleCardClick = () => {
    if (step === "reveal") {
      setIsRevealed(true);
      setTimeout(() => setStep("reading"), 800);
    }
  };

  // RESET
  const resetReading = () => {
    setStep("selection");
    setQuestion("");
    setSelectedCardIndex(null);
    setIsRevealed(false);
    setReadingData(null);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Fondo animado */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-purple-900/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[80px] animate-float-delayed" />
      </div>

      <main className="flex flex-col items-center gap-8 max-w-4xl w-full z-10">

        {/* ========== PASO 1: SELECCIÓN DE TIRADA ========== */}
        {step === "selection" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full text-center">

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Elige tu <span className="text-gradient-purple">Camino</span>
            </h1>
            <p className="text-slate-400 mb-12 max-w-lg mx-auto">
              Selecciona el tipo de consulta que resuene con tu energía.
            </p>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">

              {/* Opción 1: Oráculo */}
              <div onClick={() => selectMode("oracle")} className="cursor-pointer group">
                <GlowingBorderCard className="h-full hover:scale-[1.02] transition-transform" glowColor="purple">
                  <div className="p-8 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <ScanEye className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Espejo del Alma</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      Deja que el universo te muestre el arquetipo que necesitas integrar hoy.
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 w-full">
                      <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">Elegir Carta ➜</span>
                    </div>
                  </div>
                </GlowingBorderCard>
              </div>

              {/* Opción 2: Pregunta */}
              <div onClick={() => selectMode("question")} className="cursor-pointer group">
                <GlowingBorderCard className="h-full hover:scale-[1.02] transition-transform" glowColor="cyan">
                  <div className="p-8 flex flex-col items-center text-center h-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <MessageCircleQuestion className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Pregunta al Oráculo</h3>
                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      Formula una pregunta concreta y recibe guía específica.
                    </p>
                    <div className="mt-auto pt-4 border-t border-white/5 w-full">
                      <span className="text-cyan-400 text-sm font-bold uppercase tracking-wider">Preguntar ➜</span>
                    </div>
                  </div>
                </GlowingBorderCard>
              </div>

            </div>
          </motion.div>
        )}

        {/* ========== PASO 2: INPUT DE PREGUNTA (solo modo question) ========== */}
        {step === "question_input" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg text-center">
            <div className="inline-flex p-4 rounded-full bg-cyan-900/20 mb-6">
              <MessageCircleQuestion className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-6">¿Qué inquietud tienes?</h2>

            <form onSubmit={handleQuestionSubmit} className="space-y-6">
              <Input
                autoFocus
                placeholder="Escribe tu pregunta aquí..."
                className="bg-slate-900/50 border-purple-500/30 h-14 text-lg text-center rounded-xl focus:ring-purple-500/50"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep("selection")} className="flex-1">Cancelar</Button>
                <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold" disabled={!question.trim()}>
                  Elegir Carta
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ========== PASO 3: SELECCIÓN DE CARTA (MAZO DE 22) ========== */}
        {step === "card_selection" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
            <TarotDeck onSelectCard={handleCardSelect} />
          </motion.div>
        )}

        {/* ========== PASO 4: PROCESANDO ========== */}
        {step === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="p-6 rounded-full bg-purple-900/30 border border-purple-500/30"
              >
                <Loader2 className="w-16 h-16 text-purple-400" />
              </motion.div>
              <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl animate-pulse" />
            </div>
            <p className="text-purple-300 font-serif text-xl animate-pulse">
              Canalizando tu carta...
            </p>
          </motion.div>
        )}

        {/* ========== PASO 5: REVELAR CARTA ========== */}
        {(step === "reveal" || step === "reading") && readingData && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6">
            <p className="text-sm text-slate-500 uppercase tracking-widest">
              {isRevealed ? "Tu Mensaje Cósmico" : "Toca la carta para revelar"}
            </p>
            <TarotCard
              isRevealed={isRevealed}
              onClick={handleCardClick}
              cardName={readingData.cardName}
            />
          </motion.div>
        )}

        {/* ========== PASO 6: RESULTADO ========== */}
        {step === "reading" && readingData && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full max-w-lg">
            <GlowingBorderCard glowColor={selectedMode === "question" ? "cyan" : "purple"}>
              <div className="p-6 md:p-8">
                {/* Pregunta Contextual */}
                {question && (
                  <div className="mb-6 pb-4 border-b border-white/5">
                    <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Tu Pregunta</p>
                    <p className="text-slate-300 italic">"{question}"</p>
                  </div>
                )}

                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-3xl font-serif text-white">{readingData.cardName}</h3>
                  <div className="p-2 bg-yellow-500/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {readingData.keywords?.map((k, i) => (
                    <span key={i} className="text-xs bg-purple-950/50 text-purple-300 px-3 py-1.5 rounded-lg border border-purple-500/20">
                      {k}
                    </span>
                  ))}
                </div>

                <p className="text-slate-300 leading-relaxed mb-6 font-light">
                  {readingData.description}
                </p>

                <div className="p-5 bg-gradient-to-r from-purple-900/30 to-slate-900/50 rounded-xl border border-purple-500/30">
                  <p className="text-xs text-purple-400 font-bold mb-2 uppercase tracking-wider">⚡ Misión Evolutiva</p>
                  <p className="text-sm text-slate-200 italic leading-relaxed">"{readingData.action}"</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="ghost" className="flex-1 text-slate-400 hover:text-white" onClick={resetReading}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Nueva Lectura
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Home className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </GlowingBorderCard>
          </motion.div>
        )}

      </main>
    </div>
  );
}
"use client";

import { useState, useCallback } from "react";
import { TarotCard, DECK } from "@/components/features/tarot/TarotCard";
import TarotDeck from "@/components/features/tarot/TarotDeck";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Sparkles, RotateCcw, Home, MessageCircleQuestion, ScanEye, Clock } from "lucide-react";
import { ReadingData } from "@/types";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import InsufficientAuraModal from "@/components/dashboard/InsufficientAuraModal";
import { supabase } from "@/lib/supabase/client";
import { getReadingTypes } from "@/app/admin/settings/actions";

type ReadingMode = "oracle" | "question" | "classic"; // classic = 3 cartas
type Step = "selection" | "question_input" | "card_selection" | "reveal" | "reading";

interface CardReadingData extends ReadingData {
  position?: string; // Para tiradas multi-carta
}

export default function ReadingPage() {
  const params = useParams();
  const t = useTranslations("TarotPage");
  const [step, setStep] = useState<Step>("selection");
  const [selectedMode, setSelectedMode] = useState<ReadingMode>("oracle");
  const [question, setQuestion] = useState("");
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [readingData, setReadingData] = useState<CardReadingData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);

  // New states for Insufficient AURA
  const [balance, setBalance] = useState<number>(0);
  const [readingCosts, setReadingCosts] = useState<{ [key: string]: number }>({});
  const [insufficientAuraModalOpen, setInsufficientAuraModalOpen] = useState(false);
  const [neededAmount, setNeededAmount] = useState(50);

  // Fetch initial data
  useState(() => {
    async function loadInitialData() {
      // 1. Fetch costs
      try {
        const costs = await getReadingTypes();
        const costMap = costs.reduce((acc: any, curr: any) => {
          acc[curr.code] = curr.credit_cost;
          return acc;
        }, {});
        setReadingCosts(costMap);
      } catch (err) {
        console.error("Error loading costs:", err);
      }

      // 2. Fetch balance
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: balanceData } = await supabase.rpc('get_user_balance', { user_uuid: user.id });
        setBalance(balanceData || 0);
      }
    }
    loadInitialData();
  });

  // Etiquetas para la tirada de 3 cartas (enviadas a la API)
  const CLASSIC_LABELS_KEYS = ["Pasado", "Presente", "Futuro"];

  // Número de cartas según el modo
  const getMaxCards = useCallback(() => {
    switch (selectedMode) {
      case "classic": return 3;
      default: return 1;
    }
  }, [selectedMode]);

  // 1. SELECCIONAR MODO
  const selectMode = (mode: ReadingMode) => {
    const cost = readingCosts[mode === "classic" ? "classic" : "general"] ?? 20;

    if (balance < cost) {
      setNeededAmount(cost);
      setInsufficientAuraModalOpen(true);
      return;
    }

    setSelectedMode(mode);
    if (mode === "question") {
      setStep("question_input");
    } else {
      setStep("card_selection");
    }
  };

  // 2. CONFIRMAR PREGUNTA -> IR A SELECCIÓN DE CARTA
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setStep("card_selection");
  };

  // 3. USUARIO ELIGE CARTAS DEL MAZO
  const handleCardSelect = (cardIndex: number) => {
    const newSelected = [...selectedCards, cardIndex];
    setSelectedCards(newSelected);
  };

  // 4. CUANDO SE COMPLETA LA SELECCIÓN DE CARTAS
  const handleSelectionComplete = async (cards: number[]) => {
    setIsLoading(true);
    setRevealedCards(new Array(cards.length).fill(false));

    try {
      const readings: CardReadingData[] = [];

      for (let i = 0; i < cards.length; i++) {
        const cardIndex = cards[i];
        const response = await fetch("/api/lectura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question || null,
            cardIndex: cardIndex,
            readingTypeCode: selectedMode === "classic" ? "classic" : "general",
            position: selectedMode === "classic" ? CLASSIC_LABELS_KEYS[i] : undefined,
            locale: params.locale
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 402) {
            const cost = readingCosts[selectedMode === "classic" ? "classic" : "general"] ?? 10;
            setNeededAmount(cost);
            setInsufficientAuraModalOpen(true);
            setStep("selection");
            setIsLoading(false);
            return;
          }
          throw new Error(data.error || "Error in session");
        }

        readings.push({
          ...data,
          position: selectedMode === "classic" ? t(`labels.${CLASSIC_LABELS_KEYS[i]}`) : undefined
        });

        // Update balance if returned
        if (data.newBalance !== undefined) {
          setBalance(data.newBalance);
        }
      }

      setReadingData(readings);

      setTimeout(() => {
        setStep("reveal");
        setIsLoading(false);
      }, 500);

    } catch (error: any) {
      console.error("Error conectando con el alma:", error);
      // Only show error toast if it's not a credit issue (already handled)
      if (!insufficientAuraModalOpen) {
        toast.error(error.message || "Error de conexión cósmica");
        setStep("selection");
        setIsLoading(false);
      }
    }
  };

  // 5. REVELAR CARTA
  const handleRevealCard = (index: number) => {
    const newRevealed = [...revealedCards];
    newRevealed[index] = true;
    setRevealedCards(newRevealed);

    if (newRevealed.every(r => r)) {
      setTimeout(() => setStep("reading"), 800);
    }
  };

  // Revelar todas las cartas a la vez
  const handleRevealAll = () => {
    const allRevealed = new Array(selectedCards.length).fill(true);
    setRevealedCards(allRevealed);
    setTimeout(() => setStep("reading"), 800);
  };

  // RESET
  const resetReading = () => {
    setStep("selection");
    setQuestion("");
    setSelectedCards([]);
    setRevealedCards([]);
    setReadingData(null);
    setCurrentRevealIndex(0);
    setIsLoading(false);
  };

  return (
    <LayoutGroup>
      <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">

        {/* Fondo animado */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-purple-900/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[80px] animate-float-delayed" />
        </div>

        {/* Balance Display */}
        <div className="fixed top-24 right-6 z-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-purple-500/20 shadow-lg shadow-purple-900/10"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-mono leading-none mb-1">{t('your_aura')}</span>
              <span className="text-sm font-bold text-white leading-none">{balance}</span>
            </div>
          </motion.div>
        </div>

        <main className="flex flex-col items-center gap-8 max-w-4xl w-full z-10">

          {/* ========== PASO 1: SELECCIÓN DE TIRADA ========== */}
          <AnimatePresence mode="wait">
            {step === "selection" && (
              <motion.div
                key="selection"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full text-center"
              >
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                  {t.rich('choose_path', {
                    purple: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                  }) as any}
                </h1>
                <p className="text-slate-400 mb-12 max-w-lg mx-auto">
                  {t('choose_path_desc')}
                </p>

                <div className="grid md:grid-cols-3 gap-6 w-full max-w-3xl mx-auto">

                  {/* Opción 1: Oráculo (1 carta) */}
                  <div onClick={() => selectMode("oracle")} className="cursor-pointer group">
                    <GlowingBorderCard className="h-full hover:scale-[1.02] transition-transform" glowColor="purple">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <ScanEye className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('mode_oracle_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {t('mode_oracle_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-purple-400 text-xs font-bold">{t('one_card')}</span>
                          <div className="flex items-center gap-1.5 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] font-bold text-purple-300">
                              {t('aura_cost', { cost: readingCosts['general'] ?? 20 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlowingBorderCard>
                  </div>

                  {/* Opción 2: Pregunta (1 carta) */}
                  <div onClick={() => selectMode("question")} className="cursor-pointer group">
                    <GlowingBorderCard className="h-full hover:scale-[1.02] transition-transform" glowColor="cyan">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <MessageCircleQuestion className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('mode_question_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {t('mode_question_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-cyan-400 text-xs font-bold">{t('one_card')}</span>
                          <div className="flex items-center gap-1.5 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-bold text-cyan-300">
                              {t('aura_cost', { cost: readingCosts['general'] ?? 20 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlowingBorderCard>
                  </div>

                  {/* Opción 3: Evolución Temporal (3 cartas) */}
                  <div onClick={() => selectMode("classic")} className="cursor-pointer group">
                    <GlowingBorderCard className="h-full hover:scale-[1.02] transition-transform" glowColor="amber">
                      <div className="p-6 flex flex-col items-center text-center h-full relative">
                        {/* Badge NEW */}
                        <div className="absolute top-2 right-2 bg-amber-500 text-[10px] text-black font-bold px-2 py-0.5 rounded-full uppercase">
                          {t('new_badge')}
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Clock className="w-7 h-7 text-amber-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{t('mode_classic_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {t('mode_classic_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-amber-400 text-xs font-bold">{t('three_cards')}</span>
                          <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-300">
                              {t('aura_cost', { cost: readingCosts['classic'] ?? 100 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlowingBorderCard>
                  </div>

                </div>
              </motion.div>
            )}

            {/* ========== PASO 2: INPUT DE PREGUNTA ========== */}
            {step === "question_input" && (
              <motion.div
                key="question_input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg text-center"
              >
                <div className="inline-flex p-4 rounded-full bg-cyan-900/20 mb-6">
                  <MessageCircleQuestion className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-white mb-6">{t('question_title')}</h2>

                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                  <Input
                    autoFocus
                    placeholder={t('question_placeholder')}
                    className="bg-slate-900/50 border-purple-500/30 h-14 text-lg text-center rounded-xl focus:ring-purple-500/50"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep("selection")} className="flex-1">{t('cancel')}</Button>
                    <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold" disabled={!question.trim()}>
                      {t('choose_card')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ========== PASO 3: SELECCIÓN DE CARTAS ========== */}
            {step === "card_selection" && !isLoading && (
              <motion.div
                key="card_selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <TarotDeck
                  onSelectCard={handleCardSelect}
                  onSelectionComplete={handleSelectionComplete}
                  maxSelections={getMaxCards()}
                  selectedCards={selectedCards}
                />
              </motion.div>
            )}

            {/* ========== LOADING STATE - Shows cards animating to center ========== */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-8"
              >
                <p className="text-purple-300 font-serif text-xl">
                  {t('channeling', { count: selectedCards.length })}
                </p>

                {/* Cartas seleccionadas animándose */}
                <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
                  {selectedCards.map((cardIndex, i) => (
                    <motion.div
                      key={cardIndex}
                      initial={{ opacity: 0, scale: 0.5, y: 50 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: i * 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      {selectedCards.length > 1 && (
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                          {t(`labels.${CLASSIC_LABELS_KEYS[i]}`)}
                        </span>
                      )}
                      {/* Carta con glow pulsante */}
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 20px 5px rgba(168, 85, 247, 0.3)",
                            "0 0 40px 10px rgba(168, 85, 247, 0.5)",
                            "0 0 20px 5px rgba(168, 85, 247, 0.3)"
                          ]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="relative w-[110px] h-[165px] md:w-[140px] md:h-[210px] rounded-xl overflow-hidden"
                      >
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-purple-500/50 rounded-xl flex flex-col items-center justify-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                          >
                            <Sparkles className="w-8 h-8 text-purple-400" />
                          </motion.div>
                          <span className="text-purple-400/70 text-xs font-bold tracking-[0.3em]">SOS</span>
                        </div>
                        {/* Shimmer effect */}
                        <motion.div
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Loader sutil */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-sm text-slate-500"
                >
                  {t('consulting')}
                </motion.div>
              </motion.div>
            )}

            {/* ========== PASO 4: REVELAR CARTAS ========== */}
            {step === "reveal" && readingData && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6"
              >
                <p className="text-sm text-slate-500 uppercase tracking-widest">
                  {revealedCards.every(r => r)
                    ? t('message_cosmic')
                    : t('touch_reveal', { count: selectedCards.length })
                  }
                </p>

                {/* Contenedor de cartas - horizontal para 3 cartas, centrado para 1 */}
                <div className={`flex ${selectedCards.length > 1 ? "flex-row gap-4 md:gap-8 flex-wrap justify-center" : "justify-center"}`}>
                  {selectedCards.map((cardIndex, i) => (
                    <motion.div
                      key={cardIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={selectedCards.length > 1 ? "scale-[0.8] md:scale-100" : ""}
                    >
                      <TarotCard
                        layoutId={`tarot-card-${cardIndex}`}
                        isRevealed={revealedCards[i]}
                        onClick={() => handleRevealCard(i)}
                        cardName={readingData[i]?.cardName || DECK[cardIndex]}
                        label={selectedCards.length > 1 ? t(`labels.${CLASSIC_LABELS_KEYS[i]}`) : undefined}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Botón para revelar todas */}
                {selectedCards.length > 1 && !revealedCards.every(r => r) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={handleRevealAll}
                      className="bg-purple-600/50 hover:bg-purple-600 text-white"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('reveal_all')}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ========== PASO 5: RESULTADO ========== */}
            {step === "reading" && readingData && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-5xl"
              >
                {/* Título para tirada de 3 cartas */}
                {selectedCards.length > 1 && (
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white text-center mb-8">
                    {t.rich('evolution_title', {
                      purple: (chunks) => <span className="text-gradient-purple">{chunks}</span>
                    }) as any}
                  </h2>
                )}

                {/* Layout para 1 carta: carta a la izquierda, interpretación a la derecha */}
                {selectedCards.length === 1 && (
                  <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
                    {/* Carta */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-shrink-0"
                    >
                      <TarotCard
                        layoutId={`tarot-card-${selectedCards[0]}`}
                        isRevealed={true}
                        onClick={() => { }}
                        cardName={readingData[0]?.cardName || DECK[selectedCards[0]]}
                      />
                    </motion.div>

                    {/* Interpretación */}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex-1 max-w-lg"
                    >
                      <GlowingBorderCard glowColor={selectedMode === "question" ? "cyan" : "purple"}>
                        <div className="p-5 md:p-6">
                          {/* Pregunta Contextual */}
                          {question && (
                            <div className="mb-4 pb-3 border-b border-white/5">
                              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t('your_question')}</p>
                              <p className="text-slate-300 italic text-sm">"{question}"</p>
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl md:text-2xl font-serif text-white">{readingData[0]?.cardName}</h3>
                            <div className="p-2 bg-yellow-500/10 rounded-xl">
                              <Sparkles className="w-4 h-4 text-yellow-500" />
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {readingData[0]?.keywords?.slice(0, 3).map((k, j) => (
                              <span key={j} className="text-xs bg-purple-950/50 text-purple-300 px-2 py-1 rounded-lg border border-purple-500/20">
                                {k}
                              </span>
                            ))}
                          </div>

                          <p className="text-slate-300 leading-relaxed mb-4 font-light text-sm">
                            {readingData[0]?.description}
                          </p>

                          <div className="p-4 bg-gradient-to-r from-purple-900/30 to-slate-900/50 rounded-xl border border-purple-500/30">
                            <p className="text-xs text-purple-400 font-bold mb-1 uppercase tracking-wider">⚡ {t('mission')}</p>
                            <p className="text-xs text-slate-200 italic leading-relaxed">"{readingData[0]?.action}"</p>
                          </div>
                        </div>
                      </GlowingBorderCard>
                    </motion.div>
                  </div>
                )}

                {/* Layout para 3 cartas: cartas arriba, interpretaciones abajo */}
                {selectedCards.length > 1 && (
                  <>
                    {/* Fila de cartas */}
                    <div className="flex flex-row gap-4 md:gap-8 justify-center mb-8 flex-wrap">
                      {selectedCards.map((cardIndex, i) => (
                        <motion.div
                          key={cardIndex}
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.15 }}
                          className="flex flex-col items-center gap-2"
                        >
                          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                            {t(`labels.${CLASSIC_LABELS_KEYS[i]}`)}
                          </span>
                          <div className="scale-[0.7] md:scale-[0.85]">
                            <TarotCard
                              layoutId={`tarot-card-${cardIndex}`}
                              isRevealed={true}
                              onClick={() => { }}
                              cardName={readingData[i]?.cardName || DECK[cardIndex]}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Grid de interpretaciones */}
                    <div className="grid gap-6 md:grid-cols-3">
                      {readingData.map((reading, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.15 }}
                        >
                          <GlowingBorderCard
                            glowColor={i === 0 ? "purple" : i === 1 ? "cyan" : "amber"}
                          >
                            <div className="p-4 md:p-5">
                              <div className="mb-3 pb-2 border-b border-white/5">
                                <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                                  {reading.position}
                                </span>
                              </div>

                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-serif text-white">{reading.cardName}</h3>
                                <div className="p-1.5 bg-yellow-500/10 rounded-lg">
                                  <Sparkles className="w-3 h-3 text-yellow-500" />
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-1 mb-3">
                                {reading.keywords?.slice(0, 3).map((k, j) => (
                                  <span key={j} className="text-[10px] bg-purple-950/50 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">
                                    {k}
                                  </span>
                                ))}
                              </div>

                              <p className="text-slate-300 leading-relaxed mb-3 font-light text-xs">
                                {reading.description}
                              </p>

                              <div className="p-3 bg-gradient-to-r from-purple-900/30 to-slate-900/50 rounded-lg border border-purple-500/30">
                                <p className="text-[10px] text-purple-400 font-bold mb-1 uppercase tracking-wider">⚡ {t('mission')}</p>
                                <p className="text-[10px] text-slate-200 italic leading-relaxed">"{reading.action}"</p>
                              </div>
                            </div>
                          </GlowingBorderCard>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

                {/* Botones de acción */}
                <div className="flex gap-3 mt-8 justify-center">
                  <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={resetReading}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('new_reading')}
                  </Button>
                  <Link href="/dashboard">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Home className="w-4 h-4 mr-2" />
                      {t('dashboard')}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>
      </div>
      <InsufficientAuraModal
        isOpen={insufficientAuraModalOpen}
        onClose={() => setInsufficientAuraModalOpen(false)}
        requiredAmount={neededAmount}
        currentBalance={balance}
      />
    </LayoutGroup>
  );
}

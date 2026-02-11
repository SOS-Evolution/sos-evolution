"use client";

import { useState, useCallback, useEffect } from "react";
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

type ReadingMode = "daily" | "question" | "classic"; // classic = 3 cartas, daily = 1 carta
type Step = "selection" | "question_input" | "card_selection" | "reveal" | "reading";

interface CardReadingData extends ReadingData {
  position?: string; // Para tiradas multi-carta
}

export default function ReadingPage() {
  const params = useParams();
  const t = useTranslations("TarotPage");
  const [step, setStep] = useState<Step>("selection");
  const [selectedMode, setSelectedMode] = useState<ReadingMode>("daily");
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

  useEffect(() => {
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

      // 2. Fetch initial balance via API (more reliable)
      fetch('/api/credits')
        .then(res => res.json())
        .then(data => {
          if (data && typeof data.balance === 'number') {
            setBalance(data.balance);
          }
        })
        .catch(err => console.error("Error fetching credits:", err));
    }

    loadInitialData();

    // 3. Sync balance updates via custom event
    const handleUpdate = (e: any) => {
      if (e.detail?.newBalance !== undefined) {
        setBalance(e.detail.newBalance);
      }
    };
    window.addEventListener('credits-updated', handleUpdate);
    return () => window.removeEventListener('credits-updated', handleUpdate);
  }, []);

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
    // Determine cost based on mode
    let costCode = "general"; // Default fallback
    if (mode === "classic") costCode = "classic";
    else if (mode === "daily") costCode = "daily";
    else if (mode === "question") costCode = "general";

    const cost = readingCosts[costCode] ?? 20;

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

        // Determine reading type code for API
        let readingTypeCode = "general";
        if (selectedMode === "classic") readingTypeCode = "classic";
        else if (selectedMode === "daily") readingTypeCode = "daily";

        const response = await fetch("/api/lectura", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question || null,
            cardIndex: cardIndex,
            readingTypeCode: readingTypeCode,
            position: selectedMode === "classic" ? CLASSIC_LABELS_KEYS[i] : undefined,
            locale: params.locale
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 402) {
            // Determine cost again for error handling
            let costCode = "general";
            if (selectedMode === "classic") costCode = "classic";
            else if (selectedMode === "daily") costCode = "daily";

            const cost = readingCosts[costCode] ?? 20;
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
    // Si no hay readingData aún, no hacer nada
    if (!readingData) return;

    const allRevealed = new Array(readingData.length).fill(true);
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

                  {/* Opción 1: Oráculo Diario (1 carta) */}
                  <div onClick={() => selectMode("daily")} className="cursor-pointer group">
                    <GlowingBorderCard className="h-full hover:scale-[1.02] transition-transform" glowColor="purple">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <ScanEye className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem] flex items-center justify-center">
                          {t('mode_oracle_title')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[2.5rem] flex items-start justify-center">
                          {t('mode_oracle_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-purple-400 text-xs font-bold">{t('one_card')}</span>
                          <div className="flex items-center gap-1.5 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] font-bold text-purple-300">
                              {t('aura_cost', { cost: readingCosts['daily'] ?? 20 })}
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
                        <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem] flex items-center justify-center">
                          {t('mode_question_title')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[2.5rem] flex items-start justify-center">
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
                        <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem] flex items-center justify-center">
                          {t('mode_classic_title')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[2.5rem] flex items-start justify-center">
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

            {/* ========== PASO 2: INGRESO DE PREGUNTA (SOLO MODO PREGUNTA) ========== */}
            {step === "question_input" && (
              <motion.div
                key="question_input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md"
              >
                <h2 className="text-2xl font-serif text-white text-center mb-6">
                  {t('question_title')}
                </h2>
                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t('question_placeholder')}
                    className="bg-slate-900/50 border-white/10 text-white h-12"
                    autoFocus
                  />
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep("selection")}
                      className="flex-1"
                    >
                      {t('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={!question.trim()}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {t('choose_card')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ========== PASO 3: SELECCIÓN DE CARTAS ========== */}
            {step === "card_selection" && (
              <motion.div
                key="card_selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full flex flex-col items-center"
              >
                {!isLoading ? (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-serif text-white mb-2">
                        {t('choose_card')}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        {t('channeling', { count: selectedMode === "classic" ? 3 : 1 })}
                      </p>
                    </div>

                    <TarotDeck
                      onSelectCard={handleCardSelect}
                      maxSelections={getMaxCards()}
                      onSelectionComplete={handleSelectionComplete}
                      selectedCards={selectedCards}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
                    <p className="text-purple-300 animate-pulse">{t('consulting')}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ========== PASO 4: REVELACIÓN (REVERSO) ========== */}
            {step === "reveal" && readingData && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-5xl"
              >
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-serif text-white mb-2">{t('message_cosmic')}</h2>
                  <p className="text-slate-400">
                    {t('touch_reveal', { count: readingData.length })}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                  {readingData.map((reading, index) => (
                    <div key={index} className="flex flex-col items-center gap-4">
                      {reading.position && (
                        <span className="text-purple-300 text-sm font-bold uppercase tracking-widest">
                          {reading.position}
                        </span>
                      )}

                      <div onClick={() => !revealedCards[index] && handleRevealCard(index)}>
                        <TarotCard
                          cardName={revealedCards[index] ? reading.cardName : undefined}
                          isRevealed={revealedCards[index]}
                          onClick={() => !revealedCards[index] && handleRevealCard(index)}
                          className={`w-64 h-96 cursor-pointer hover:scale-105 transition-transform duration-500 ${!revealedCards[index] && 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-12">
                  {!revealedCards.every(Boolean) && (
                    <Button onClick={handleRevealAll} variant="outline" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t('reveal_all')}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ========== PASO 5: LECTURA DETALLADA ========== */}
            {step === "reading" && readingData && (
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl space-y-12 pb-20"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b border-white/5 pb-8">
                  <Button onClick={resetReading} variant="ghost" className="text-slate-400 hover:text-white">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {t('new_reading')}
                  </Button>
                  <div className="flex-1 text-center md:text-right">
                    {selectedMode === "classic" && (
                      <h2 className="text-2xl font-serif text-white">
                        {t.rich('evolution_title', {
                          purple: (chunks) => <span className="text-purple-400">{chunks}</span>
                        }) as any}
                      </h2>
                    )}
                    {question && (
                      <div className="mt-2 text-slate-300">
                        <span className="text-slate-500 text-xs uppercase tracking-widest mr-2">{t('your_question')}:</span>
                        "{question}"
                      </div>
                    )}
                  </div>
                </div>

                {readingData.map((reading, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-8 items-start bg-slate-900/30 p-6 rounded-3xl border border-white/5">
                    <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col items-center">
                      {reading.position && (
                        <span className="mb-4 text-purple-400 font-bold uppercase tracking-widest text-sm border-b border-purple-500/30 pb-1">
                          {reading.position}
                        </span>
                      )}
                      <TarotCard
                        cardName={reading.cardName}
                        isRevealed={true}
                        onClick={() => { }}
                        className="w-full max-w-[240px] aspect-[2/3]"
                      />
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-3xl font-serif text-white mb-2">{reading.cardName}</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {reading.keywords.map(k => (
                            <span key={k} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10">
                              {k}
                            </span>
                          ))}
                        </div>
                        <p className="text-lg text-slate-300 leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
                          "{reading.description}"
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                          <h4 className="text-purple-400 text-sm font-bold uppercase mb-2 flex items-center">
                            <Sparkles className="w-3 h-3 mr-2" />
                            {t('mission')}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {reading.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center pt-8">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-slate-800 hover:bg-slate-700 text-white">
                      <Home className="w-4 h-4 mr-2" />
                      {t('dashboard')}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        <InsufficientAuraModal
          isOpen={insufficientAuraModalOpen}
          onClose={() => setInsufficientAuraModalOpen(false)}
          requiredAmount={neededAmount}
          currentBalance={balance}
        />
      </div>
    </LayoutGroup>
  );
}

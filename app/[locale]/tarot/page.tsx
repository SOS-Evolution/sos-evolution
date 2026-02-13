"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { TarotCard, DECK } from "@/components/features/tarot/TarotCard";
import TarotDeck from "@/components/features/tarot/TarotDeck";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Sparkles, RotateCcw, Home, MessageCircleQuestion, ScanEye, Clock, Moon, Star } from "lucide-react";
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
  const [loadingPhase, setLoadingPhase] = useState(0);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingMode, setPendingMode] = useState<ReadingMode | null>(null);

  // New states for Insufficient AURA
  const [balance, setBalance] = useState<number | null>(null);
  const [readingCosts, setReadingCosts] = useState<{ [key: string]: number }>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [insufficientAuraModalOpen, setInsufficientAuraModalOpen] = useState(false);
  const [neededAmount, setNeededAmount] = useState(20);

  useEffect(() => {
    async function loadInitialData() {
      setIsDataLoading(true);
      try {
        // 1. Fetch costs
        const costs = await getReadingTypes();
        const costMap = costs.reduce((acc: any, curr: any) => {
          acc[curr.code] = curr.credit_cost;
          return acc;
        }, {});
        setReadingCosts(costMap);

        // 2. Fetch initial balance via API (awaiting to avoid race conditions)
        const res = await fetch('/api/credits');
        const data = await res.json();
        if (data && typeof data.balance === 'number') {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setIsDataLoading(false);
      }
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

  // Queue pending mode if data still loading — auto-enter once loaded
  useEffect(() => {
    if (pendingMode && !isDataLoading && balance !== null) {
      enterMode(pendingMode);
      setPendingMode(null);
    }
  }, [isDataLoading, balance, pendingMode]);

  // Actually enter the mode (check credits and navigate)
  const enterMode = (mode: ReadingMode) => {
    let costCode = "general";
    if (mode === "classic") costCode = "classic";
    else if (mode === "daily") costCode = "daily";
    else if (mode === "question") costCode = "general";

    const cost = readingCosts[costCode] ?? 20;

    if (balance !== null && balance < cost) {
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

  // 1. SELECCIONAR MODO
  const selectMode = (mode: ReadingMode) => {
    if (isDataLoading || balance === null) {
      // Queue the mode — it will auto-enter when data loads
      setPendingMode(mode);
      return;
    }
    enterMode(mode);
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

  // Start loading phase animation
  const startLoadingPhases = () => {
    setLoadingPhase(0);
    // Phase 1 -> 2 after 2s
    loadingTimerRef.current = setTimeout(() => {
      setLoadingPhase(1);
      // Phase 2 -> 3 after 2 more seconds
      loadingTimerRef.current = setTimeout(() => {
        setLoadingPhase(2);
      }, 2000);
    }, 2000);
  };

  const clearLoadingTimers = () => {
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }
  };

  // 4. CUANDO SE COMPLETA LA SELECCIÓN DE CARTAS
  const handleSelectionComplete = async (cards: number[]) => {
    setIsLoading(true);
    startLoadingPhases();
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
            let costCode = "general";
            if (selectedMode === "classic") costCode = "classic";
            else if (selectedMode === "daily") costCode = "daily";

            const cost = readingCosts[costCode] ?? 20;
            setNeededAmount(cost);
            setInsufficientAuraModalOpen(true);
            setStep("selection");
            setIsLoading(false);
            clearLoadingTimers();
            return;
          }

          if (response.status === 429 || (data.error && (data.error.includes('429') || data.error.toLowerCase().includes('quota')))) {
            toast.error(t('error_quota'), {
              description: t('error_quota_desc'),
              duration: 5000,
            });
            setStep("selection");
            setIsLoading(false);
            clearLoadingTimers();
            return;
          }

          throw new Error(data.error || "Error in session");
        }

        // Defensive: ensure keywords is always an array
        const safeKeywords = Array.isArray(data.keywords) ? data.keywords : [];

        readings.push({
          ...data,
          keywords: safeKeywords,
          description: data.description || '',
          action: data.action || '',
          position: selectedMode === "classic" ? t(`labels.${CLASSIC_LABELS_KEYS[i]}`) : undefined
        });

        // Update balance if returned
        if (data.newBalance !== undefined) {
          setBalance(data.newBalance);
        }
      }

      setReadingData(readings);
      clearLoadingTimers();

      // Smooth transition: brief pause then reveal
      setLoadingPhase(3); // "ready" phase
      setTimeout(() => {
        setStep("reveal");
        setIsLoading(false);
        setLoadingPhase(0);
      }, 1200);

    } catch (error: any) {
      console.error("Error conectando con el alma:", error);
      toast.error(t('error_generic'), {
        description: error.message || t('error_generic_desc'),
      });
      setStep("selection");
      setIsLoading(false);
      clearLoadingTimers();
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
    setLoadingPhase(0);
    clearLoadingTimers();
  };

  // Loading phase messages
  const getLoadingMessage = () => {
    switch (loadingPhase) {
      case 0: return t('loading_phase_1') || "Conectando con el cosmos...";
      case 1: return t('loading_phase_2') || "Canalizando la energía de tu carta...";
      case 2: return t('loading_phase_3') || "Interpretando los símbolos...";
      case 3: return t('loading_phase_ready') || "Tu mensaje está listo...";
      default: return t('loading_phase_1') || "Conectando con el cosmos...";
    }
  };

  return (
    <LayoutGroup>
      <div className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">

        {/* Fondo animado */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-purple-900/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[80px] animate-float-delayed" />
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
                  <div onClick={() => selectMode("daily")} className="cursor-pointer group relative">
                    <GlowingBorderCard className={`h-full hover:scale-[1.02] transition-transform ${pendingMode === 'daily' ? 'ring-2 ring-purple-400/50' : ''}`} glowColor="purple">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          {pendingMode === 'daily' ? (
                            <Sparkles className="w-7 h-7 text-purple-400 animate-pulse" />
                          ) : (
                            <ScanEye className="w-7 h-7 text-purple-400" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem] flex items-center justify-center">
                          {t('mode_oracle_title')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[2.5rem] flex items-start justify-center">
                          {pendingMode === 'daily'
                            ? (t('loading_energies') || 'Canalizando energías...')
                            : t('mode_oracle_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-purple-400 text-xs font-bold">{t('one_card')}</span>
                          <div className="flex items-center gap-1.5 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span className="text-[10px] font-bold text-purple-300">
                              {isDataLoading ? '...' : t('aura_cost', { cost: readingCosts['daily'] ?? 20 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlowingBorderCard>
                  </div>

                  {/* Opción 2: Pregunta (1 carta) */}
                  <div onClick={() => selectMode("question")} className="cursor-pointer group relative">
                    <GlowingBorderCard className={`h-full hover:scale-[1.02] transition-transform ${pendingMode === 'question' ? 'ring-2 ring-cyan-400/50' : ''}`} glowColor="cyan">
                      <div className="p-6 flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          {pendingMode === 'question' ? (
                            <Sparkles className="w-7 h-7 text-cyan-400 animate-pulse" />
                          ) : (
                            <MessageCircleQuestion className="w-7 h-7 text-cyan-400" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem] flex items-center justify-center">
                          {t('mode_question_title')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[2.5rem] flex items-start justify-center">
                          {pendingMode === 'question'
                            ? (t('loading_energies') || 'Canalizando energías...')
                            : t('mode_question_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-cyan-400 text-xs font-bold">{t('one_card')}</span>
                          <div className="flex items-center gap-1.5 bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-bold text-cyan-300">
                              {isDataLoading ? '...' : t('aura_cost', { cost: readingCosts['general'] ?? 20 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlowingBorderCard>
                  </div>

                  {/* Opción 3: Evolución Temporal (3 cartas) */}
                  <div onClick={() => selectMode("classic")} className="cursor-pointer group relative">
                    <GlowingBorderCard className={`h-full hover:scale-[1.02] transition-transform ${pendingMode === 'classic' ? 'ring-2 ring-amber-400/50' : ''}`} glowColor="amber">
                      <div className="p-6 flex flex-col items-center text-center h-full relative">
                        {/* Badge NEW */}
                        <div className="absolute top-2 right-2 bg-amber-500 text-[10px] text-black font-bold px-2 py-0.5 rounded-full uppercase">
                          {t('new_badge')}
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          {pendingMode === 'classic' ? (
                            <Sparkles className="w-7 h-7 text-amber-400 animate-pulse" />
                          ) : (
                            <Clock className="w-7 h-7 text-amber-400" />
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 min-h-[3.5rem] flex items-center justify-center">
                          {t('mode_classic_title')}
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[2.5rem] flex items-start justify-center">
                          {pendingMode === 'classic'
                            ? (t('loading_energies') || 'Canalizando energías...')
                            : t('mode_classic_desc')}
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5 w-full flex items-center justify-between">
                          <span className="text-amber-400 text-xs font-bold">{t('three_cards')}</span>
                          <div className="flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span className="text-[10px] font-bold text-amber-300">
                              {isDataLoading ? '...' : t('aura_cost', { cost: readingCosts['classic'] ?? 100 })}
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
                  <motion.div
                    className="flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Mystical loading orb */}
                    <div className="relative w-32 h-32 mb-8">
                      {/* Outer glow ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-purple-500/30"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                          borderColor: loadingPhase >= 2
                            ? ['rgba(168,85,247,0.5)', 'rgba(129,140,248,0.5)', 'rgba(168,85,247,0.5)']
                            : ['rgba(168,85,247,0.3)', 'rgba(168,85,247,0.5)', 'rgba(168,85,247,0.3)']
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Middle ring */}
                      <motion.div
                        className="absolute inset-3 rounded-full border border-indigo-400/20"
                        animate={{
                          rotate: 360,
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                        }}
                      />
                      {/* Core sparkle */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 15, -15, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {loadingPhase >= 3 ? (
                          <Star className="w-10 h-10 text-purple-300" />
                        ) : loadingPhase >= 1 ? (
                          <Moon className="w-10 h-10 text-purple-400" />
                        ) : (
                          <Sparkles className="w-10 h-10 text-purple-400" />
                        )}
                      </motion.div>
                      {/* Floating particles */}
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-purple-400/60 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                          }}
                          animate={{
                            x: [0, Math.cos((i * 60) * Math.PI / 180) * 50, 0],
                            y: [0, Math.sin((i * 60) * Math.PI / 180) * 50, 0],
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>

                    {/* Phase text with crossfade */}
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={loadingPhase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className={`text-center font-serif text-lg ${loadingPhase >= 3
                            ? 'text-purple-200'
                            : 'text-purple-300/80'
                          }`}
                      >
                        {getLoadingMessage()}
                      </motion.p>
                    </AnimatePresence>

                    {/* Subtle progress dots */}
                    <div className="flex gap-2 mt-6">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full ${loadingPhase >= i + 1 ? 'bg-purple-400' : 'bg-purple-400/20'
                            }`}
                          animate={loadingPhase >= i + 1 ? {
                            scale: [1, 1.3, 1],
                          } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  </motion.div>
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
                    <motion.div
                      key={index}
                      className="flex flex-col items-center gap-4"
                      initial={{ opacity: 0, y: 40, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.2,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    >
                      {reading.position && (
                        <motion.span
                          className="text-purple-300 text-sm font-bold uppercase tracking-widest"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.2 + 0.3 }}
                        >
                          {reading.position}
                        </motion.span>
                      )}

                      <motion.div
                        onClick={() => !revealedCards[index] && handleRevealCard(index)}
                        whileHover={!revealedCards[index] ? { scale: 1.05, y: -5 } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <TarotCard
                          cardName={revealedCards[index] ? reading.cardName : undefined}
                          isRevealed={revealedCards[index]}
                          onClick={() => !revealedCards[index] && handleRevealCard(index)}
                          className={`w-64 h-96 cursor-pointer transition-shadow duration-500 ${!revealedCards[index] && 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'}`}
                        />
                      </motion.div>
                    </motion.div>
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
                  <Button
                    onClick={resetReading}
                    variant="outline"
                    className="bg-white/5 border-white/10 hover:bg-white/10 text-slate-300 hover:text-white backdrop-blur-sm transition-all duration-300"
                  >
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
                          {(Array.isArray(reading.keywords) ? reading.keywords : []).map((k: string) => (
                            <span key={k} className="px-3 py-1 bg-white/5 rounded-full text-xs text-slate-300 border border-white/10">
                              {k}
                            </span>
                          ))}
                        </div>
                        {reading.description ? (
                          <p className="text-lg text-slate-300 leading-relaxed italic border-l-2 border-purple-500/50 pl-4">
                            "{reading.description}"
                          </p>
                        ) : null}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                          <h4 className="text-purple-400 text-sm font-bold uppercase mb-2 flex items-center">
                            <Sparkles className="w-3 h-3 mr-2" />
                            {t('mission')}
                          </h4>
                          <p className="text-sm text-slate-400">
                            {reading.action || ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center pt-12 pb-8">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="relative overflow-hidden group bg-slate-900/60 hover:bg-slate-800/80 text-white border border-white/10 backdrop-blur-xl px-12 py-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <Home className="w-5 h-5 mr-3 relative z-10 transition-transform duration-500 group-hover:-translate-y-0.5" />
                      <span className="text-lg font-medium relative z-10">{t('home')}</span>
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
          currentBalance={balance ?? 0}
        />
      </div>
    </LayoutGroup>
  );
}

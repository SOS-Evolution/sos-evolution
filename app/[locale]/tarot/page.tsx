"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { TarotCard, DECK } from "@/components/features/tarot/TarotCard";
import TarotDeck from "@/components/features/tarot/TarotDeck";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Sparkles, RotateCcw, Home, MessageCircleQuestion, ScanEye, Clock, Moon, Star } from "lucide-react";
import { ReadingData } from "@/types";
import { Link } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import InsufficientAuraModal from "@/components/dashboard/InsufficientAuraModal";

import { getReadingTypes } from "@/app/admin/settings/actions";

type ReadingMode = "daily" | "question" | "classic" | "cross"; // classic = 3 cartas, cross = 5 cartas, daily = 1 carta
type Step = "selection" | "question_input" | "card_selection" | "reveal" | "reading";

interface CardReadingData extends ReadingData {
  position?: string; // Para tiradas multi-carta
}

function ReadingPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations("TarotPage");
  const [step, setStep] = useState<Step>("selection");
  const [selectedMode, setSelectedMode] = useState<ReadingMode>("daily");
  const [question, setQuestion] = useState("");
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [readingData, setReadingData] = useState<CardReadingData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        const costMap = costs.reduce((acc: Record<string, number>, curr: { code: string; credit_cost: number }) => {
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
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ newBalance?: number }>;
      if (customEvent.detail?.newBalance !== undefined) {
        setBalance(customEvent.detail.newBalance);
      }
    };
    window.addEventListener('credits-updated', handleUpdate);
    return () => window.removeEventListener('credits-updated', handleUpdate);
  }, []);

  // Etiquetas para las tiradas multi-carta (enviadas a la API)
  const CLASSIC_LABELS_KEYS = ["Pasado", "Presente", "Futuro"];
  const CROSS_LABELS_KEYS = ["Presente", "Desafio", "Pasado", "Consejo", "Desenlace"];

  // Número de cartas según el modo
  const getMaxCards = useCallback(() => {
    switch (selectedMode) {
      case "cross": return 5;
      case "classic": return 3;
      default: return 1;
    }
  }, [selectedMode]);

  // Auto-detect mode from URL query parameter (?mode=daily | classic | cross | question)
  useEffect(() => {
    const modeParam = searchParams.get("mode") as ReadingMode | null;
    if (modeParam && ["daily", "classic", "cross", "question"].includes(modeParam)) {
      setPendingMode(modeParam);
    }
  }, [searchParams]);

  // Queue pending mode if data still loading — auto-enter once loaded
  useEffect(() => {
    if (pendingMode && !isDataLoading && balance !== null) {
      enterMode(pendingMode);
      setPendingMode(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataLoading, balance, pendingMode]);

  // Actually enter the mode (check credits and navigate)
  const enterMode = (mode: ReadingMode) => {
    let costCode = "general";
    if (mode === "cross") costCode = "cross";
    else if (mode === "classic") costCode = "classic";
    else if (mode === "daily") costCode = "daily";
    else if (mode === "question") costCode = "general";

    const cost = readingCosts[costCode] ?? (mode === "cross" ? 150 : (mode === "classic" ? 100 : 20));

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

  const handleCardDeselect = (cardIndex: number) => {
    setSelectedCards(prev => prev.filter(id => id !== cardIndex));
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
      let readingTypeCode = "general";
      if (selectedMode === "cross") readingTypeCode = "cross";
      else if (selectedMode === "classic") readingTypeCode = "classic";
      else if (selectedMode === "daily") readingTypeCode = "daily";

      const positions = selectedMode === "cross"
        ? CROSS_LABELS_KEYS
        : (selectedMode === "classic" ? CLASSIC_LABELS_KEYS : undefined);

      const response = await fetch("/api/lectura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question || null,
          cardIndices: cards, // Enviamos el array completo de una vez
          readingTypeCode: readingTypeCode,
          positions: positions,
          locale: params.locale
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          const costCode = readingTypeCode;
          const cost = readingCosts[costCode] ?? (selectedMode === "cross" ? 150 : (selectedMode === "classic" ? 100 : 20));
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

      // La API ahora devolverá un array de lecturas
      const readings: CardReadingData[] = data.readings.map((r: { keywords?: string[]; description?: string; action?: string; cardName: string }, idx: number) => {
        let positionLabel: string | undefined = undefined;
        if (selectedMode === "cross") {
          const key = CROSS_LABELS_KEYS[idx];
          positionLabel = t.has(`labels.${key}`) ? t(`labels.${key}`) : key;
        } else if (selectedMode === "classic") {
          const key = CLASSIC_LABELS_KEYS[idx];
          positionLabel = t.has(`labels.${key}`) ? t(`labels.${key}`) : key;
        }

        return {
          ...r,
          keywords: Array.isArray(r.keywords) ? r.keywords : [],
          description: r.description || '',
          action: r.action || '',
          position: positionLabel
        };
      });

      // Update balance globally once
      if (data.newBalance !== undefined) {
        setBalance(data.newBalance);
        window.dispatchEvent(new CustomEvent('credits-updated', {
          detail: { newBalance: data.newBalance }
        }));
      }

      setReadingData(readings);

      // Preload card images so they're cached before reveal flip
      readings.forEach((reading: { cardName: string }) => {
        const idx = DECK.indexOf(reading.cardName);
        if (idx >= 0) {
          const img = new Image();
          img.src = `/assets/tarot/arcano-${idx}.jpg`;
        }
      });

      clearLoadingTimers();

      // Smooth transition: brief pause then reveal
      setLoadingPhase(3); // "ready" phase
      setTimeout(() => {
        setStep("reveal");
        setIsLoading(false);
        setLoadingPhase(0);
      }, 1200);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error conectando con el alma:", error);
      toast.error(t('error_generic'), {
        description: errorMessage || t('error_generic_desc'),
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
                  }) as React.ReactNode}
                </h1>
                <p className="text-slate-400 mb-12 max-w-lg mx-auto">
                  {t('choose_path_desc')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-5xl mx-auto">

                  {/* Opción 1: Oráculo Diario (1 carta) */}
                  <motion.div
                    onClick={() => selectMode("daily")}
                    className="cursor-pointer group"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-500
                      ${pendingMode === 'daily'
                        ? 'border-violet-500/60 shadow-[0_0_30px_rgba(139,92,246,0.35)]'
                        : 'border-white/8 hover:border-violet-500/40 hover:shadow-[0_0_24px_rgba(139,92,246,0.2)]'
                      }`}
                    >
                      {/* Card background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/80 via-slate-950/90 to-indigo-950/80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-violet-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Decorative circles */}
                      <div className="absolute -top-6 -right-6 w-28 h-28 bg-violet-500/10 rounded-full blur-xl group-hover:bg-violet-500/20 transition-colors duration-500" />
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-lg" />

                      {/* Price badge */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span>{isDataLoading ? '...' : (readingCosts['daily'] ?? 20)}</span>
                      </div>

                      <div className="relative z-10 p-6 flex flex-col h-full">
                        {/* Icon */}
                        <div className="mb-5">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${pendingMode === 'daily'
                              ? 'bg-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                              : 'bg-violet-500/15 group-hover:bg-violet-500/25 group-hover:shadow-[0_0_16px_rgba(139,92,246,0.3)]'}`}
                          >
                            {pendingMode === 'daily'
                              ? <Sparkles className="w-7 h-7 text-violet-300 animate-pulse" />
                              : <ScanEye className="w-7 h-7 text-violet-300" />
                            }
                          </div>
                        </div>

                        {/* Text */}
                        <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">{t('mode_oracle_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                          {pendingMode === 'daily' ? (t('loading_energies') || 'Canalizando energías...') : t('mode_oracle_desc')}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/6">
                          <span className="text-violet-400 text-xs font-semibold tracking-wide">{t('one_card')}</span>
                          <div className="flex gap-0.5">
                            {[...Array(1)].map((_, i) => (
                              <div key={i} className="w-5 h-7 rounded-sm bg-violet-500/30 border border-violet-500/40" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Opción 2: Pregunta (1 carta) */}
                  <motion.div
                    onClick={() => selectMode("question")}
                    className="cursor-pointer group"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-500
                      ${pendingMode === 'question'
                        ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.35)]'
                        : 'border-white/8 hover:border-cyan-500/40 hover:shadow-[0_0_24px_rgba(6,182,212,0.2)]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/80 via-slate-950/90 to-teal-950/80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -top-6 -right-6 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors duration-500" />
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-teal-500/10 rounded-full blur-lg" />

                      {/* Price badge */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span>{isDataLoading ? '...' : (readingCosts['general'] ?? 20)}</span>
                      </div>

                      <div className="relative z-10 p-6 flex flex-col h-full">
                        <div className="mb-5">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${pendingMode === 'question'
                              ? 'bg-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                              : 'bg-cyan-500/15 group-hover:bg-cyan-500/25 group-hover:shadow-[0_0_16px_rgba(6,182,212,0.3)]'}`}
                          >
                            {pendingMode === 'question'
                              ? <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
                              : <MessageCircleQuestion className="w-7 h-7 text-cyan-300" />
                            }
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">{t('mode_question_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                          {pendingMode === 'question' ? (t('loading_energies') || 'Canalizando energías...') : t('mode_question_desc')}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/6">
                          <span className="text-cyan-400 text-xs font-semibold tracking-wide">{t('one_card')}</span>
                          <div className="flex gap-0.5">
                            {[...Array(1)].map((_, i) => (
                              <div key={i} className="w-5 h-7 rounded-sm bg-cyan-500/30 border border-cyan-500/40" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Opción 3: Evolución Temporal (3 cartas) */}
                  <motion.div
                    onClick={() => selectMode("classic")}
                    className="cursor-pointer group"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-500
                      ${pendingMode === 'classic'
                        ? 'border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
                        : 'border-white/8 hover:border-amber-500/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-950/80 via-slate-950/90 to-orange-950/80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -top-6 -right-6 w-28 h-28 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors duration-500" />
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-orange-500/10 rounded-full blur-lg" />

                      {/* Price badge */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span>{isDataLoading ? '...' : (readingCosts['classic'] ?? 100)}</span>
                      </div>

                      <div className="relative z-10 p-6 flex flex-col h-full">
                        <div className="mb-5">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${pendingMode === 'classic'
                              ? 'bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                              : 'bg-amber-500/15 group-hover:bg-amber-500/25 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]'}`}
                          >
                            {pendingMode === 'classic'
                              ? <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
                              : <Clock className="w-7 h-7 text-amber-300" />
                            }
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">{t('mode_classic_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                          {pendingMode === 'classic' ? (t('loading_energies') || 'Canalizando energías...') : t('mode_classic_desc')}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/6">
                          <span className="text-amber-400 text-xs font-semibold tracking-wide">{t('three_cards')}</span>
                          <div className="flex gap-0.5">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-4 h-7 rounded-sm bg-amber-500/30 border border-amber-500/40" style={{ transform: `rotate(${(i - 1) * 8}deg)` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Opción 4: Cruz Guía Evolutiva (5 cartas) */}
                  <motion.div
                    onClick={() => selectMode("cross")}
                    className="cursor-pointer group"
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className={`relative h-full rounded-2xl overflow-hidden border transition-all duration-500
                      ${pendingMode === 'cross'
                        ? 'border-emerald-500/60 shadow-[0_0_30px_rgba(16,185,129,0.35)]'
                        : 'border-white/8 hover:border-emerald-500/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.2)]'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-slate-950/90 to-teal-950/80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute -top-6 -right-6 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors duration-500" />
                      <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-teal-500/10 rounded-full blur-lg" />

                      {/* Price badge */}
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span>{isDataLoading ? '...' : (readingCosts['cross'] ?? 150)}</span>
                      </div>

                      {/* "Más completo" badge */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <Star className="w-2.5 h-2.5" />
                        <span>PRO</span>
                      </div>

                      <div className="relative z-10 p-6 flex flex-col h-full">
                        <div className="mb-5 mt-3">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${pendingMode === 'cross'
                              ? 'bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                              : 'bg-emerald-500/15 group-hover:bg-emerald-500/25 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]'}`}
                          >
                            {pendingMode === 'cross'
                              ? <Sparkles className="w-7 h-7 text-emerald-300 animate-pulse" />
                              : <Star className="w-7 h-7 text-emerald-300" />
                            }
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1.5 leading-tight">{t('mode_cross_title')}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-5 flex-1">
                          {pendingMode === 'cross' ? (t('loading_energies') || 'Canalizando energías...') : t('mode_cross_desc')}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-white/6">
                          <span className="text-emerald-400 text-xs font-semibold tracking-wide">{t('five_cards')}</span>
                          {/* Cross pattern representation */}
                          <div className="relative w-9 h-9 flex items-center justify-center">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3.5 rounded-sm bg-emerald-500/40 border border-emerald-500/50" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3.5 rounded-sm bg-emerald-500/40 border border-emerald-500/50" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500/50" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500/50" />
                            <div className="w-3 h-3 rounded-sm bg-emerald-400/60 border border-emerald-400/70" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
                        {t('channeling', { count: selectedMode === "cross" ? 5 : (selectedMode === "classic" ? 3 : 1) })}
                      </p>
                    </div>

                    <TarotDeck
                      onSelectCard={handleCardSelect}
                      onDeselectCard={handleCardDeselect}
                      maxSelections={getMaxCards()}
                      onSelectionComplete={handleSelectionComplete}
                      selectedCards={selectedCards}
                      slotLabels={
                        selectedMode === "cross"
                          ? CROSS_LABELS_KEYS.map(k => (t.has(`labels.${k}`) ? t(`labels.${k}`) : k))
                          : (selectedMode === "classic" ? CLASSIC_LABELS_KEYS.map(k => (t.has(`labels.${k}`) ? t(`labels.${k}`) : k)) : undefined)
                      }
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
                          cardName={reading.cardName}
                          isRevealed={revealedCards[index]}
                          onClick={() => !revealedCards[index] && handleRevealCard(index)}
                          className={`${readingData.length >= 5 ? 'w-48 h-72 md:w-56 md:h-84' : 'w-64 h-96'} cursor-pointer transition-shadow duration-500 ${!revealedCards[index] && 'hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]'}`}
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
                        }) as React.ReactNode}
                      </h2>
                    )}
                    {selectedMode === "cross" && (
                      <h2 className="text-2xl font-serif text-white">
                        {t.rich('cross_title', {
                          purple: (chunks) => <span className="text-purple-400">{chunks}</span>
                        }) as React.ReactNode}
                      </h2>
                    )}
                    {question && (
                      <div className="mt-2 text-slate-300">
                        <span className="text-slate-500 text-xs uppercase tracking-widest mr-2">{t('your_question')}:</span>
                        &quot;{question}&quot;
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
                            &quot;{reading.description}&quot;
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

export default function ReadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0514] flex flex-col items-center justify-center text-amber-300 gap-3">
          <Sparkles className="w-8 h-8 animate-spin" />
          <span className="font-serif tracking-widest text-sm uppercase">Sintonizando el Oráculo...</span>
        </div>
      }
    >
      <ReadingPageContent />
    </Suspense>
  );
}

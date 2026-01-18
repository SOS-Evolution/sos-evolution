"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Quote } from "lucide-react";
import { LifePathDetails } from "@/lib/soul-math";
import { Button } from "@/components/ui/button";

interface MagicModalProps {
    isOpen: boolean;
    onClose: () => void;
    details: LifePathDetails | null;
}

export default function MagicModal({ isOpen, onClose, details }: MagicModalProps) {
    if (!details) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md relative overflow-hidden group"
                        >
                            {/* Card Background & Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 rounded-3xl" />
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay rounded-3xl" />

                            {/* Animated Border */}
                            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-purple-500 via-transparent to-indigo-500 opacity-50" />

                            <div className="relative p-8 md:p-10 text-center text-white rounded-3xl overflow-hidden">

                                {/* Background Orbs */}
                                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-[60px] animate-pulse" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-[60px] animate-pulse delay-700" />

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-20"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* HEADER: Number & Title */}
                                <div className="flex flex-col items-center mb-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.2 }}
                                        className="w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold font-mono shadow-xl shadow-purple-900/50 mb-4 border border-white/20"
                                    >
                                        {details.number}
                                    </motion.div>

                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-purple-300 font-bold uppercase tracking-widest text-sm"
                                    >
                                        Camino de Vida
                                    </motion.p>

                                    <motion.h2
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-3xl font-serif font-bold text-white mt-2 mb-1"
                                    >
                                        {details.title}
                                    </motion.h2>
                                </div>

                                {/* DIVIDER */}
                                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-8 opacity-50" />

                                {/* POWER WORD */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="mb-8"
                                >
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Palabra de Poder</p>
                                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-white to-purple-200 animate-gradient-shift">
                                        ✨ {details.powerWord} ✨
                                    </p>
                                </motion.div>

                                {/* ESSENCE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="mb-8 bg-white/5 p-4 rounded-xl border border-white/5"
                                >
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Esencia</p>
                                    <p className="text-slate-200 leading-relaxed font-light">
                                        {details.essence}
                                    </p>
                                </motion.div>

                                {/* QUOTE */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="relative p-6"
                                >
                                    <Quote className="absolute top-2 left-2 w-6 h-6 text-purple-600/30 rotate-180" />
                                    <p className="text-lg text-white font-serif italic relative z-10">
                                        "{details.quote}"
                                    </p>
                                    <Quote className="absolute bottom-2 right-2 w-6 h-6 text-purple-600/30" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="mt-6"
                                >
                                    <Button onClick={onClose} variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full px-6">
                                        Cerrar
                                    </Button>
                                </motion.div>

                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

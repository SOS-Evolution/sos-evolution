"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, Mail, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login, signup, signInWithOAuth } from "./actions";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

function LoginForm() {
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get("error");
    const message = searchParams.get("message");

    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
    };

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setLoading(true);
        await signInWithOAuth(provider);
    };

    return (
        <div className="w-full max-w-md animate-fade-in-up">
            <GlowingBorderCard glowColor={isSignUp ? "indigo" : "purple"}>
                <div className="p-8 md:p-10">

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br mb-6 border transition-all duration-500 ${isSignUp ? 'from-indigo-500/20 to-blue-500/20 border-indigo-500/20' : 'from-purple-500/20 to-pink-500/20 border-purple-500/20'}`}>
                            <Sparkles className={`w-8 h-8 animate-pulse ${isSignUp ? 'text-indigo-400' : 'text-purple-400'}`} />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wide mb-3 transition-all">
                            {isSignUp ? "Únete al Cosmos" : "Bienvenido de Nuevo"}
                        </h1>

                        <p className="text-slate-400 text-sm">
                            {isSignUp
                                ? "Comienza tu viaje de autodescubrimiento hoy mismo."
                                : "Ingresa tus datos para continuar con tu evolución."}
                        </p>
                    </div>

                    {/* MENSAJES DE ESTADO */}
                    {message === "check_email" && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-4 rounded-xl text-sm text-center mb-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <Mail className="w-6 h-6 mb-2 text-green-400" />
                            <p className="font-semibold">¡Portal abierto!</p>
                            <p className="text-xs opacity-80 mt-1">Revisa tu correo para confirmar tu identidad espiritual.</p>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm text-center mb-6 flex items-center justify-center gap-2 animate-shake">
                            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                            {errorMsg}
                        </div>
                    )}

                    {/* FORMULARIO */}
                    {message !== "check_email" && (
                        <div className="space-y-6">
                            <form className="space-y-5" onSubmit={handleSubmit}>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 ml-1">Correo Electrónico</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="tu@esencia.com"
                                            className="pl-12 h-14 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-slate-400 ml-1">Contraseña</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pl-12 pr-12 h-14 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <Button
                                    formAction={isSignUp ? signup : login}
                                    className={`w-full text-white h-14 rounded-xl font-medium shadow-lg transition-all hover:scale-[1.02] text-base ${isSignUp
                                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-900/30'
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-900/30'
                                        }`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            {isSignUp ? "Crear mi Cuenta" : "Iniciar Sesión"}
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>
                            </form>

                            {/* DIVIDER */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0f172a] px-2 text-slate-500">O también puedes</span>
                                </div>
                            </div>

                            {/* SOCIAL LOGIN */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleSocialLogin('google')}
                                    className="h-12 bg-slate-900/50 border-slate-700 hover:bg-white/5 hover:border-slate-500 text-white transition-all group"
                                    disabled={loading}
                                >
                                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleSocialLogin('facebook')}
                                    className="h-12 bg-slate-900/50 border-slate-700 hover:bg-white/5 hover:border-slate-500 text-white transition-all group"
                                    disabled={loading}
                                >
                                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* TOGGLE */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
                        <p className="text-slate-500 text-sm">
                            {isSignUp ? "¿Ya eres parte de nuestra comunidad?" : "¿Aún no has iniciado tu viaje?"}
                        </p>
                        <Button
                            type="button"
                            variant="link"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className={`w-full h-12 rounded-xl font-semibold transition-all border ${isSignUp
                                ? 'text-purple-400 hover:text-purple-300 border-purple-500/20 hover:bg-purple-500/5'
                                : 'bg-indigo-600/10 text-indigo-400 hover:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
                                }`}
                        >
                            {isSignUp ? "Inicia Sesión aquí" : "Registrarme Ahora Gratis"}
                        </Button>
                    </div>

                </div>
            </GlowingBorderCard>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-6 overflow-hidden relative">

            {/* Fondo animado */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-float-delayed" />
            </div>

            <Suspense fallback={<div className="text-purple-400 animate-pulse">Cargando portal...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
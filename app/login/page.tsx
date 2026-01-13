"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Lock, Mail, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { login, signup } from "./actions";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

function LoginForm() {
    const searchParams = useSearchParams();
    const errorMsg = searchParams.get("error");
    const message = searchParams.get("message");

    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Estado para ver contraseña

    const handleSubmit = () => {
        setLoading(true);
    };

    return (
        <div className="w-full max-w-md relative">

            {/* Efecto de brillo detrás de la tarjeta */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 transition duration-500 group-hover:opacity-40"></div>

            <Card className="relative w-full bg-slate-950/80 border-white/10 p-8 shadow-2xl backdrop-blur-xl rounded-2xl">

                {/* --- HEADER --- */}
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 mb-5 border border-white/5 shadow-inner">
                        <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-white tracking-wide mb-2">
                        {isSignUp ? "Únete al Oráculo" : "Bienvenido de nuevo"}
                    </h1>

                    <p className="text-slate-400 text-sm">
                        {isSignUp
                            ? "Crea tu cuenta para comenzar tu viaje evolutivo."
                            : "Ingresa tus credenciales para acceder a tu diario."}
                    </p>
                </div>

                {/* --- MENSAJES DE ESTADO --- */}
                {message === "check_email" && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-4 rounded-lg text-sm text-center mb-6 flex flex-col items-center animate-fade-in">
                        <Mail className="w-5 h-5 mb-2 text-green-400" />
                        <p className="font-semibold">¡Correo enviado!</p>
                        <p className="text-xs opacity-80 mt-1">Revisa tu bandeja de entrada para confirmar.</p>
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-lg text-sm text-center mb-6 flex items-center justify-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        {errorMsg}
                    </div>
                )}

                {/* --- FORMULARIO --- */}
                {message !== "check_email" && (
                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 ml-1">Correo Electrónico</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="ejemplo@alma.com"
                                    className="pl-10 h-12 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-400 ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                                <Input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-12 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all"
                                    required
                                    minLength={6}
                                />
                                {/* Botón Ojo (Ver/Ocultar) */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            formAction={isSignUp ? signup : login}
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white h-12 rounded-xl font-medium shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    {isSignUp ? "Crear Cuenta Sagrada" : "Acceder al Sistema"}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                )}

                {/* --- TOGGLE LOGIN/REGISTER --- */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-sm mb-2">
                        {isSignUp ? "¿Ya eres parte de la comunidad?" : "¿Aún no tienes cuenta?"}
                    </p>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-semibold hover:underline underline-offset-4 transition-colors"
                    >
                        {isSignUp ? "Inicia Sesión aquí" : "Regístrate gratis"}
                    </button>
                </div>

            </Card>
        </div>
    );
}

// COMPONENTE PRINCIPAL
export default function LoginPage() {
    return (
        // FIX CLAVE: h-[calc(100vh-5rem)] resta la altura del Navbar (5rem = 80px aprox)
        // Esto asegura que ocupe exactamente el espacio restante sin scroll.
        <div className="min-h-[calc(100vh-5rem)] bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">

            {/* Elementos de fondo decorativos fijos */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            <Suspense fallback={<div className="text-purple-400 animate-pulse">Cargando portal...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
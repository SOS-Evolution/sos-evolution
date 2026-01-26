"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, Mail, Loader2, Eye, EyeOff, ArrowRight, LockKeyhole, RotateCcwKey, UserPlus, LogIn } from "lucide-react";
import { login, signup, signInWithOAuth, resetPassword } from "./actions";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import GlowingBorderCard from "@/components/landing/GlowingBorderCard";

function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialError = searchParams.get("error");
    const initialMessage = searchParams.get("message");

    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(initialError);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

    // Actualizar error si viene de URL (ej: redirección desde server)
    useEffect(() => {
        if (initialError) {
            setErrorMsg(initialError);
            setLoading(false);
        }
    }, [initialError]);

    // Mostrar mensaje de éxito si viene de URL
    useEffect(() => {
        if (initialMessage === "check_email") {
            setSuccessMsg("¡Correo enviado! Revisa tu bandeja de entrada.");
            setErrorMsg(null);
            setFieldErrors({});
            setLoading(false);
        }
    }, [initialMessage]);

    const validateForm = (formData: FormData) => {
        const errors: { email?: string; password?: string; confirmPassword?: string } = {};
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (!email) errors.email = "Por favor, ingresa tu correo galáctico.";
        else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Formato de correo no válido.";

        if (!isForgotPassword) {
            if (!password) errors.password = "La llave de acceso es necesaria.";
            else if (password.length < 6) errors.password = "La contraseña debe tener al menos 6 caracteres.";

            if (isSignUp && password !== confirmPassword) {
                errors.confirmPassword = "Las contraseñas no coinciden en el cosmos.";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setErrorMsg(null);
        setSuccessMsg(null);
        setFieldErrors({});
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
        setErrorMsg(null);
        setSuccessMsg(null);
        setFieldErrors({});
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (!validateForm(formData)) return;

        setLoading(true);
        if (isSignUp) {
            await signup(formData);
            setLoading(false);
        } else if (isForgotPassword) {
            await resetPassword(formData);
            setLoading(false);
        } else {
            await login(formData);
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'facebook') => {
        setLoading(true);
        await signInWithOAuth(provider);
    };

    return (
        <div className="w-full max-w-md animate-fade-in-up">
            <GlowingBorderCard glowColor={isSignUp ? "indigo" : isForgotPassword ? "blue" : "purple"}>
                <div className="p-8 md:p-10">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br mb-6 border transition-all duration-500 ${isSignUp ? 'from-indigo-500/20 to-blue-500/20 border-indigo-500/20' :
                            isForgotPassword ? 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' :
                                'from-purple-500/20 to-pink-500/20 border-purple-500/20'
                            }`}>
                            <Sparkles className={`w-8 h-8 animate-pulse ${isSignUp ? 'text-indigo-400' :
                                isForgotPassword ? 'text-blue-400' :
                                    'text-purple-400'
                                }`} />
                        </div>

                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide mb-3 transition-all uppercase">
                            {isSignUp ? "Únete al Cosmos" : isForgotPassword ? "Recuperar Acceso" : "¡Bienvenido!"}
                        </h1>

                        <p className="text-slate-400 text-sm font-sans">
                            {isSignUp
                                ? "Comienza tu viaje de autodescubrimiento hoy mismo."
                                : isForgotPassword
                                    ? "Te enviaremos un enlace mágico para restaurar tu contraseña."
                                    : "Ingresa tus datos para continuar con tu evolución."}
                        </p>
                    </div>

                    {/* MENSAJES DE ESTADO */}
                    {successMsg && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-200 p-4 rounded-xl text-sm text-center mb-6 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <Mail className="w-6 h-6 mb-2 text-green-400" />
                            <div className="font-semibold font-serif space-y-1">
                                <p className="text-base">¡Correo enviado!</p>
                                {searchParams.get("email") && (
                                    <p className="text-indigo-300 break-all text-xs opacity-90">a {searchParams.get("email")}</p>
                                )}
                                <p className="pt-1">Revisa tu bandeja de entrada.</p>
                            </div>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm text-center mb-6 flex flex-col items-center justify-center gap-2 animate-shake">
                            <div className="flex items-center gap-2 font-serif">
                                <LockKeyhole className="w-4 h-4 text-red-500 animate-pulse" />
                                {errorMsg}
                            </div>
                            {!isForgotPassword && !isSignUp && (
                                <button
                                    onClick={toggleForgotPassword}
                                    className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4 mt-1 transition-colors flex items-center gap-1.5 font-serif"
                                >
                                    <RotateCcwKey className="w-3.5 h-3.5" />
                                    ¿Olvidaste tu contraseña?
                                </button>
                            )}
                        </div>
                    )}

                    {!isForgotPassword && !successMsg && (
                        /* SOCIAL LOGIN - DOS COLUMNAS */
                        <div className="space-y-6 mb-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleSocialLogin('google')}
                                    className="h-12 bg-slate-900/50 border-slate-700 hover:bg-white/5 hover:border-slate-500 text-white transition-all group rounded-full font-serif"
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
                                    className="h-12 bg-slate-900/50 border-slate-700 hover:bg-white/5 hover:border-slate-500 text-white transition-all group rounded-full font-serif"
                                    disabled={loading}
                                >
                                    <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </Button>
                            </div>

                            {/* DIVIDER */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5"></span>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-[#0f172a] px-2 text-slate-500 font-serif tracking-widest">O usa tu correo</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FORMULARIO */}
                    {successMsg ? (
                        <Button
                            onClick={() => {
                                setSuccessMsg(null);
                                setIsForgotPassword(false);
                            }}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-full h-12 font-serif"
                        >
                            Volver al inicio
                        </Button>
                    ) : (
                        <div className="space-y-6">
                            <form className="space-y-5" noValidate onSubmit={handleSubmit}>

                                {/* Email */}
                                <div className="space-y-1 relative pb-2">
                                    <div className="flex justify-between items-center min-h-[20px]">
                                        <label className="text-xs font-serif font-medium text-slate-400 ml-1 tracking-wider uppercase">Correo Electrónico</label>
                                    </div>
                                    <div className="relative group">
                                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${fieldErrors.email ? 'text-red-400' : 'text-slate-500 group-focus-within:text-purple-400'}`} />
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder="tu@esencia.com"
                                            className={`pl-12 h-14 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-2xl transition-all font-sans ${fieldErrors.email
                                                ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                                : 'border-slate-700 focus:border-purple-500/50 focus:ring-purple-500/20'
                                                }`}
                                            required
                                        />
                                        {fieldErrors.email && (
                                            <div className="absolute left-4 -bottom-6 text-[11px] text-red-400 font-medium animate-in fade-in slide-in-from-top-1 font-serif tracking-wide">
                                                ✦ {fieldErrors.email}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Password y Confirm Password - Ocultos en modo Forgot Password */}
                                {!isForgotPassword && (
                                    <>
                                        <div className="space-y-1 relative pb-2">
                                            <div className="flex justify-between items-center min-h-[20px]">
                                                <label className="text-xs font-serif font-medium text-slate-400 ml-1 tracking-wider uppercase">Contraseña</label>
                                                {!isSignUp && (
                                                    <button
                                                        type="button"
                                                        onClick={toggleForgotPassword}
                                                        className="text-xs text-purple-400 hover:text-purple-300 hover:underline transition-colors font-medium font-serif"
                                                    >
                                                        ¿Olvidaste tu contraseña?
                                                    </button>
                                                )}
                                            </div>

                                            <div className="relative group">
                                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${fieldErrors.password ? 'text-red-400' : 'text-slate-500 group-focus-within:text-purple-400'}`} />
                                                <Input
                                                    name="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className={`pl-12 pr-12 h-14 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-2xl transition-all font-sans ${fieldErrors.password
                                                        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                                        : 'border-slate-700 focus:border-purple-500/50 focus:ring-purple-500/20'
                                                        }`}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                                {fieldErrors.password && (
                                                    <div className="absolute left-4 -bottom-6 text-[11px] text-red-400 font-medium animate-in fade-in slide-in-from-top-1 font-serif tracking-wide">
                                                        ✦ {fieldErrors.password}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {isSignUp && (
                                            <div className="space-y-1 relative pb-2 animate-fade-in-up">
                                                <div className="flex justify-between items-center min-h-[20px]">
                                                    <label className="text-xs font-serif font-medium text-slate-400 ml-1 tracking-wider uppercase">Confirmar Contraseña</label>
                                                </div>
                                                <div className="relative group">
                                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-slate-500 group-focus-within:text-purple-400'}`} />
                                                    <Input
                                                        name="confirmPassword"
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        className={`pl-12 pr-12 h-14 bg-slate-900/50 text-white placeholder:text-slate-600 rounded-2xl transition-all font-sans ${fieldErrors.confirmPassword
                                                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10'
                                                            : 'border-slate-700 focus:border-purple-500/50 focus:ring-purple-500/20'
                                                            }`}
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                    </button>
                                                    {fieldErrors.confirmPassword && (
                                                        <div className="absolute left-4 -bottom-6 text-[11px] text-red-400 font-medium animate-in fade-in slide-in-from-top-1 font-serif tracking-wide">
                                                            ✦ {fieldErrors.confirmPassword}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Submit Actions */}
                                {isForgotPassword ? (
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            type="button"
                                            onClick={toggleForgotPassword}
                                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white h-12 rounded-full font-serif"
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="flex-[2] bg-gradient-to-r from-[#2d1b54] to-[#3c096c] hover:from-[#3c096c] hover:to-[#5a189a] text-white h-12 rounded-full shadow-lg shadow-purple-900/30 border border-[#5a189a]/30 font-serif"
                                            disabled={loading}
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : "Enviar Enlace Mágico"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            className={`w-full text-white h-14 rounded-full font-serif font-medium shadow-lg transition-all hover:scale-[1.02] text-base bg-gradient-to-r from-[#2d1b54] to-[#3c096c] hover:from-[#3c096c] hover:to-[#5a189a] shadow-purple-900/50 border border-[#5a189a]/50`}
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" />
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    {isSignUp ? (
                                                        <>
                                                            Crear mi Cuenta
                                                            <UserPlus className="w-6 h-6" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Iniciar Sesión
                                                            <LogIn className="w-6 h-6" />
                                                        </>
                                                    )}
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </form>

                            {/* TOGGLE MODO */}
                            {!isForgotPassword && (
                                <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-4">
                                    <p className="text-slate-500 text-sm font-sans">
                                        {isSignUp ? "¿Ya eres parte de nuestra comunidad?" : "¿Aún no has iniciado tu viaje?"}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={toggleMode}
                                        className={`w-full h-12 rounded-full font-serif font-semibold transition-all border ${isSignUp
                                            ? 'text-purple-400 hover:text-purple-300 border-purple-500/20 hover:bg-purple-500/5'
                                            : 'bg-indigo-600/10 text-indigo-400 hover:text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
                                            }`}
                                    >
                                        {isSignUp ? "Inicia Sesión aquí" : "Registrarme Ahora Gratis"}
                                    </Button>
                                </div>
                            )}

                        </div>
                    )}
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

            <Suspense fallback={<div className="text-purple-400 animate-pulse font-serif">Cargando portal...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, DollarSign, Repeat, HeartHandshake, ArrowLeft, Sparkle, Calendar, Zap, Gift, Star, ShieldCheck, Clock, Settings, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/landing/AnimatedSection";

export default function BusinessDocsPage() {
    return (
        <div className="max-w-5xl">
            <AnimatedSection>
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/admin/docs">
                        <Button variant="ghost" className="text-slate-400 hover:text-white p-2 h-12 w-12 rounded-2xl glass shrink-0">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em] mb-1">Estrategia B2C</h2>
                        <h1 className="text-4xl font-serif text-white">Modelo de <span className="text-emerald-400">Negocio</span></h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Estrategia de crecimiento, monetización y retención.
                        </p>
                    </div>
                </div>
            </AnimatedSection>

            <div className="space-y-12">


                {/* 1. Estrategia de Monetización */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Fuentes de Ingreso
                </h3>
                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Target className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">1. Freemium & Gamificación</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• <span className="text-emerald-400 font-medium">Ganar Aura de Evolución:</span> Invitar usuarios, compartir en RRSS (Earned Media).</li>
                            <li>• Lectura diaria/semanal gratuita.</li>
                            <li>• Acceso básico al mapa del alma.</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <DollarSign className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">2. Pack de Aura de Evolución</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• Compra de moneda virtual con dinero real.</li>
                            <li>• <span className="text-amber-400 text-xs uppercase bg-amber-400/10 px-1 rounded">Requiere Pasarela de Pago</span></li>
                            <li>• Desbloqueo de tiradas específicas.</li>
                            <li>• Visualización de destino (Imagen IA).</li>
                        </ul>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Repeat className="w-24 h-24" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">3. Amuleto del Alma (30 días)</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>• <span className="text-purple-400 font-medium">Acceso Premium:</span> Beneficios exclusivos.</li>
                            <li>• Pack de Aura de Evolución + Skins de cartas únicos.</li>
                            <li>• <strong>Profundización en tiradas</strong> (IA avanzada).</li>
                            <li>• <span className="text-amber-400 text-xs uppercase bg-amber-400/10 px-1 rounded">Requiere Pasarela de Pago</span></li>
                        </ul>
                    </Card>
                </div>

                {/* 2. Marketing y Nichos */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-purple-400" />
                            Nichos Objetivo
                        </h3>
                        <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                                <Badge variant="secondary" className="bg-pink-900/30 text-pink-300">Gen Z / Millennials</Badge>
                                <p className="text-sm text-slate-400">Uso no esotérico del tarot. Herramienta de introspección psicológica.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                                <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">Wellness & Growth</Badge>
                                <p className="text-sm text-slate-400">Buscadores de desarrollo personal, autoayuda y mindfulness.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 flex items-start gap-4">
                                <Badge variant="secondary" className="bg-indigo-900/30 text-indigo-300">Comunidades WitchTok</Badge>
                                <p className="text-sm text-slate-400">Consumo de contenido visual místico en TikTok/IG Reels.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-red-400" />
                            Diferenciadores de Retención (LTV)
                        </h3>
                        <Card className="p-5 bg-gradient-to-br from-slate-900 to-slate-900/50 border-slate-800">
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">Memoria Contextual (Vector Search)</p>
                                        <p className="text-xs text-slate-500">
                                            Persistencia de Contexto: El sistema utiliza memoria vectorial para identificar patrones recurrentes en el historial del usuario.
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2" />
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">Gamificación Estructural</p>
                                        <p className="text-xs text-slate-500">
                                            Progresión de Usuario: Sistema de niveles y recompensas basado en hitos de actividad (Achievement System).
                                        </p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                                    <div>
                                        <p className="font-bold text-slate-200 text-sm">Registro de Actividad (Activity Log)</p>
                                        <p className="text-xs text-slate-500">
                                            Visualización cronológica de eventos y análisis de tendencias para fomentar el uso recurrente (Daily Active Users).
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
                {/* 3. Infraestructura y Pagos */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Infraestructura de Pagos & Confianza
                </h3>
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Estrategia Tecnológica */}
                    <Card className="p-6 bg-slate-900 border-slate-800">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                            Estrategia Técnica & Fiscal
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <h5 className="text-blue-200 font-medium mb-1">Base de Datos</h5>
                                <p className="text-sm text-slate-400">
                                    Implementar tablas robustas de <code className="text-blue-300">Transactions</code> (historial) y <code className="text-blue-300">User_Wallet</code> (Aura de Evolución) para auditoría.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <h5 className="text-emerald-200 text-sm font-bold mb-1">Opción A (Actual) - Lemon Squeezy</h5>
                                    <p className="text-xs text-slate-400">
                                        <strong>Pros</strong>: Muy fácil de configurar, excelente para creadores individuales, soporte nativo de PayPal.
                                        <strong>Cons</strong>: API un poco más limitada que Paddle.
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <h5 className="text-blue-200 text-sm font-bold mb-1">Opción B (Alternativa) - Paddle</h5>
                                    <p className="text-xs text-slate-400">
                                        <strong>Pros</strong>: APIs más potentes, mejor gestión de suscripciones complejas y analíticas avanzadas.
                                        <strong>Cons</strong>: Proceso de aprobación de cuenta un poco más estricto.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Psicología de Venta */}
                    <Card className="p-6 bg-slate-900 border-slate-800">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-pink-400" />
                            Psicología de Venta
                        </h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-amber-500 font-bold">1</span>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium">Pase &quot;No Recurrente&quot;</h5>
                                    <p className="text-sm text-slate-400">
                                        Vender el Pase como <strong>Producto de Temporada</strong> (ej: &quot;Temporada de Eclipses&quot;) en lugar de suscripción automática. Elimina el miedo a &quot;olvidar cancelar&quot; y aumenta conversión.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-yellow-500 font-bold">2</span>
                                </div>
                                <div>
                                    <h5 className="text-white font-medium">Factor Confianza (PayPal)</h5>
                                    <p className="text-sm text-slate-400">
                                        En el nicho esotérico, el botón amarillo de <strong>PayPal</strong> es crítico. Reduce la fricción y el recelo de compartir datos bancarios en sitios nuevos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

                {/* 4. Estado de Integración Lemon Squeezy */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Integración Lemon Squeezy (Fase 2)
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Lo que ya existe */}
                    <Card className="p-6 bg-slate-900 border-slate-800">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            Implementado (Estado Actual)
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Interfaz de Tienda Mística</p>
                                    <p className="text-xs text-slate-500">Página de compra `/purchase` con 6 tiers diseñados y responsivos.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Internacionalización (i18n)</p>
                                    <p className="text-xs text-slate-500">Rutas y traducciones para la tienda configuradas para ES/EN.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2" />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Arquitectura de Servicios</p>
                                    <p className="text-xs text-slate-500">`BillingService` listo para provisionar créditos tras confirmación de pago.</p>
                                </div>
                            </li>
                        </ul>
                    </Card>

                    {/* Lo que falta */}
                    <Card className="p-6 bg-slate-900 border-slate-800 border-dashed">
                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-400" />
                            Pendiente (Por Implementar)
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Backend de Checkout</p>
                                    <p className="text-xs text-slate-500">API `/api/checkout` para generar el link de pago dinámico.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Webhook Handler</p>
                                    <p className="text-xs text-slate-500">Validación de firma `X-Signature` y procesamiento de `order_created`.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                                <div>
                                    <p className="text-sm text-slate-200 font-medium">Base de Datos de Ordenes</p>
                                    <p className="text-xs text-slate-500">Tablas `orders` y `subscriptions` para seguimiento post-venta.</p>
                                </div>
                            </li>
                        </ul>
                    </Card>
                </div>

                {/* Requerimientos Técnicos */}
                <Card className="p-6 bg-slate-900/50 border-purple-500/20 mt-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Settings className="w-32 h-32" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-4">Requerimientos de Configuración (Dashboard LS)</h4>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Variables de Entorno</p>
                            <div className="space-y-2">
                                <code className="block p-2 bg-black/40 rounded border border-white/5 text-[10px] text-purple-200">LEMONSQUEEZY_API_KEY</code>
                                <code className="block p-2 bg-black/40 rounded border border-white/5 text-[10px] text-purple-200">LEMONSQUEEZY_STORE_ID</code>
                                <code className="block p-2 bg-black/40 rounded border border-white/5 text-[10px] text-purple-200">LEMONSQUEEZY_WEBHOOK_SECRET</code>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-4">Productos (Variant IDs)</p>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Cada botón de la tienda debe mapearse a un <strong className="text-white">Variant ID</strong> específico en el Dashboard de Lemon Squeezy para que el webhook sepa cuánta &quot;Aura&quot; otorgar al usuario tras la compra.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* 5. Estrategia de Precios */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Precios Objetivo (Tier List)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {/* Pack Pequeño */}
                    <Card className="p-4 bg-slate-900 border-slate-800 flex flex-col items-center text-center group hover:border-slate-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors">
                            <span className="text-lg">🥉</span>
                        </div>
                        <h4 className="text-slate-300 font-medium text-sm mb-1">Pack Iniciado</h4>
                        <div className="text-2xl font-bold text-white mb-1">$4.99</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <Sparkle className="w-3.5 h-3.5 text-amber-500/80" />
                            <span>500 Aura</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 w-full">
                            Ideal para 2-3 tiradas específicas.
                        </p>
                    </Card>

                    {/* Pack Medio */}
                    <Card className="p-4 bg-slate-900 border-slate-800 flex flex-col items-center text-center relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
                        <div className="absolute top-0 right-0 bg-emerald-500 text-[10px] text-black font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                            POPULAR
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center mb-3 group-hover:bg-emerald-900/50 transition-colors">
                            <span className="text-lg">🥈</span>
                        </div>
                        <h4 className="text-emerald-400 font-medium text-sm mb-1">Pack Adepto</h4>
                        <div className="text-2xl font-bold text-white mb-1">$14.99</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <Sparkle className="w-3.5 h-3.5 text-amber-500/80" />
                            <span>1,800 Aura</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 w-full">
                            +20% Bonus. Para usuarios recurrentes.
                        </p>
                    </Card>

                    {/* Pack Grande */}
                    <Card className="p-4 bg-slate-900 border-slate-800 flex flex-col items-center text-center group hover:border-amber-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center mb-3 group-hover:bg-amber-900/50 transition-colors">
                            <span className="text-lg">🥇</span>
                        </div>
                        <h4 className="text-amber-400 font-medium text-sm mb-1">Pack Maestro</h4>
                        <div className="text-2xl font-bold text-white mb-1">$39.99</div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                            <Sparkle className="w-3.5 h-3.5 text-amber-500" />
                            <span>5,000 Aura</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 w-full">
                            +40% Bonus. Power users.
                        </p>
                    </Card>

                    {/* Suscripción */}
                    <Card className="p-4 bg-gradient-to-b from-purple-900/20 to-slate-900 border-purple-500/30 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/60 transition-colors">
                        <div className="absolute top-0 right-0 bg-purple-500 text-[10px] text-white font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                            PREMIUM
                        </div>
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                            <span className="text-lg">👑</span>
                        </div>
                        <h4 className="text-purple-300 font-medium text-sm mb-1 uppercase tracking-tight">Amuleto del Alma</h4>
                        <div className="text-2xl font-bold text-white mb-1">$11.11</div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-3 uppercase font-medium">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            <span>30 Días</span>
                        </div>
                        <p className="text-[10px] text-slate-400 border-t border-purple-500/20 pt-2 w-full">
                            Skins + Aura de Evolución Extra + AI Profunda.
                        </p>
                    </Card>

                </div>

                {/* 6. Consumo de Aura de Evolución */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Consumo por Función (Economy)
                </h3>
                <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-bold">Función</th>
                                <th className="px-6 py-4 font-bold text-center">Aura de Evolución</th>
                                <th className="px-6 py-4 font-bold">Descripción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {/* Tarot Literals */}
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Lectura Básica</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">10</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Esencia Instantánea. Una sola carta para obtener claridad inmediata sobre una energía específica (sin IA).</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Lectura Diaria (Daily)</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">50</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Tu Brújula del Día. Guía matutina de 1 carta para sintonizar con tu energía diaria (Límitada a 1/día).</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Lectura Mensual</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">100</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Ciclo de 30 Días. Análisis proyectivo sobre metas y desafíos del mes entrante.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Lectura Clásica</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">100</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Evolución Pasado-Presente-Futuro. El esquema tradicional de 3 cartas para entender trayectorias.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Herradura (Horseshoe)</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">100</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Mapa de 7 cartas en &quot;V&quot; que explora influencias, consejos y el desenlace más probable.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Lectura Profunda (Cruz Celta)</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">160</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Inmersión Total. 10 cartas para decodificar situaciones complejas, bloqueos y resultados a largo plazo.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-white font-medium">Tirada Zodiacal</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">250</td>
                                <td className="px-6 py-4 text-slate-400 text-xs">Rueda de la Vida (12 cartas). Panorámica general cubriendo todas las áreas (amor, trabajo, salud).</td>
                            </tr>
                            {/* Special Categories */}
                            <tr className="hover:bg-slate-800/30 transition-colors border-t border-slate-700/50">
                                <td className="px-6 py-4 text-emerald-300 font-bold">Universo Astrología</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">300</td>
                                <td className="px-6 py-4 text-slate-400 text-xs italic">Cálculo de Carta Astral completa y Sinastría avanzada.</td>
                            </tr>
                            <tr className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 text-emerald-300 font-bold">Universo Numerología</td>
                                <td className="px-6 py-4 text-center font-mono text-emerald-400 font-bold">100</td>
                                <td className="px-6 py-4 text-slate-400 text-xs italic">Análisis detallado de vibración personal y misión de vida.</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>

                {/* 7. Sistema de Misiones */}
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 mt-8">
                    <Gift className="w-5 h-5 text-purple-400" />
                    Sistema de Recompensas (Misiones)
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Star className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Bienvenida</p>
                                    <p className="text-xs text-slate-500">Por completar el registro inicial.</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-mono">+100</Badge>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <HeartHandshake className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Invitar Amigo</p>
                                    <p className="text-xs text-slate-500">Por cada nuevo usuario referido.</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-mono">+200</Badge>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Repeat className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Compartir Social</p>
                                    <p className="text-xs text-slate-500">Publicar resultados en redes (Diario).</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-mono">+50</Badge>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center group hover:border-purple-500/30 transition-colors">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Racha Diaria</p>
                                    <p className="text-xs text-slate-500">Conexión consecutiva de 7 días.</p>
                                </div>
                            </div>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-mono">+150</Badge>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

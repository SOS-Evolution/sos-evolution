# SYSTEM_CONTEXT: SOS EVOLUTION (Soul Operating System)
> **Propósito del documento**: Servir como la referencia maestra de contexto operativo, visión de producto y arquitectura para desarrolladores y modelos de Inteligencia Artificial (AI Assistants). Cualquier nueva sesión de chat o herramienta de IA debe leer este documento para comprender instantáneamente el 100% del sistema, su filosofía, sus reglas de ingeniería y el estado de implementación de sus módulos.

---

## 1. VISIÓN GENERAL Y PROPÓSITO DEL SISTEMA

### ¿Qué es SOS Evolution?
**SOS Evolution (Soul Operating System)** es una plataforma SaaS de bienestar espiritual y desarrollo personal que fusiona **simbología ancestral milenaria** (Tarot de Marsella/Rider-Waite, Numerología Pitagórica y Astrología Occidental) con **Inteligencia Artificial Generativa de vanguardia**, **cómputo astronómico de alta precisión** y **diseño visual inmersivo**.

### Misión y Enfoque Filosófico
- **El "Headspace de la Espiritualidad Consciente"**: SOS Evolution no es una aplicación de adivinación determinista o "adivinación del futuro". Está concebida como un santuario digital para el **autodescubrimiento**, la **introspección psicológica arquetípica** (inspirada en Carl Jung) y la **guía evolutiva diaria**.
- **Rituales Digitales**: Cada interacción en la plataforma (una consulta de tarot, la lectura de la carta natal o el horóscopo diario) está diseñada como un ritual consciente y estético que invita a la calma, la presencia y la reflexión.
- **Rigor Matemático + Misticismo Poético**: Los cálculos astronómicos y numerológicos son exactos y deterministas (fórmulas orbitales IAU 1980 y reducciones pitagóricas estrictas). La IA actúa como el **Oráculo hermenéutico**, interpretando estos datos de manera personalizada para cada consultante.

---

## 2. GLOSARIO DE DOMINIO Y CONCEPTOS CLAVE

Comprender la nomenclatura interna del proyecto es esencial para interactuar con el código:

1. **Aura de Evolución (Aura Credits)**:
   - Es la moneda virtual de la plataforma. Controla el acceso a las funciones de IA y a las consultas profundas.
   - Se gestiona mediante un **Patrón Ledger (Libro Mayor)** inmutable en PostgreSQL (`user_credits`), donde el saldo no es un valor estático modificable, sino la suma acumulada de transacciones auditadas.
2. **Diario del Alma (Soul Journal)**:
   - Módulo histórico (`/historial`) donde se preservan todas las tiradas de tarot del usuario.
   - Las lecturas se guardan y consultan agrupadas por un identificador único de tirada (`spread_id`), manteniendo el orden (`card_order`), la posición arquetípica y el consejo ritual de cada carta.
3. **Modalidades de Tiradas de Tarot**:
   - **Oráculo Diario (`daily`)**: 1 carta rápida para sintonizar con la energía del día (20 Aura).
   - **Consulta Específica (`general`)**: 1 carta enfocada en responder una inquietud o pregunta abierta formulada por el usuario (20 Aura).
   - **Evolución Temporal (`classic`)**: Tirada de 3 cartas correspondiente a los planos temporales: *Pasado*, *Presente* y *Futuro* (100 Aura).
   - **Cruz Guía Evolutiva (`cross`)**: Tirada profunda de 5 cartas: *Presente*, *Desafío/Obstáculo*, *Pasado/Origen*, *Consejo del Alma* y *Desenlace/Potencial* (150 Aura).
4. **Carta Astral Evolutiva (`/astrology`)**:
   - Mapeo tridimensional de los posicionales planetarios natales (Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón, Nodos Lunares Rahu y Ketu, y Ascendente).
   - Utiliza el sistema de **Casas Iguales (Equal Houses)** proyectado a partir del Ascendente y calcula una matriz de aspectos angulares (Conjunción, Oposición, Trígono, Cuadratura, Sextil).
   - La generación de la carta es local y gratuita; la **interpretación profunda generada por IA** (`astrology_full`) consume 20 Aura.
5. **Horóscopo Diario Evolutivo (`daily_scope`)**:
   - Cruce algorítmico diario entre la carta natal del usuario y los tránsitos planetarios actuales. Proporciona una guía mística de 40-60 palabras, una acción de poder ritual, color del día y número de poder (10 Aura, gratuito la primera vez cada día).
6. **Mapa Vibracional / Numerología Pitagórica (`/numerology`)**:
   - Análisis derivado del nombre completo y la fecha de nacimiento del consultante.
   - Calcula: **Camino de Vida (Life Path)**, **Número de Expresión/Destino**, **Deseo del Alma (Soul Urge)** y **Número de Personalidad**. Preserva intactos los **Números Maestros** (`11`, `22`, `33`).
7. **El Amuleto del Alma**:
   - Nivel de suscripción premium recurrente ($11.11 USD/mes) gestionado vía Lemon Squeezy que otorga beneficios exclusivos, como tiradas diarias ilimitadas, reportes astrales periódicos y memoria contextual del oráculo.
8. **Misiones Evolutivas & Rachas (`/missions`)**:
   - Sistema de gamificación que incentiva el hábito diario del usuario (completar perfil, realizar lecturas, racha de días consecutivos), recompensándolo con Aura gratuita.

---

## 3. MAPA DE ARQUITECTURA Y ORGANIZACIÓN DEL REPOSITORIO

El proyecto sigue una arquitectura **Clean Architecture / Domain-Driven Design (DDD)** sobre **Next.js 15 (App Router)** y **TypeScript estricto**:

```
sos-evolution/
├── app/                               # Capa de Presentación y API (Next.js App Router)
│   ├── [locale]/                      # Rutas localizadas dinámicas (i18n con next-intl)
│   │   ├── astrology/                 # Página de Carta Astral interactiva
│   │   ├── credits/                   # Páginas de confirmación de saldo y éxito
│   │   ├── dashboard/                 # Panel principal del usuario (bento grid místico)
│   │   ├── historial/                 # El Diario del Alma (tiradas agrupadas por spread_id)
│   │   ├── login/                     # Autenticación con Supabase Auth
│   │   ├── missions/                  # Panel de misiones y recompensas
│   │   ├── numerology/                # Mapa Vibracional y cálculo de números de poder
│   │   ├── purchase/                  # Tienda mística (6 tiers de Aura y suscripción)
│   │   ├── tarot/                     # Oráculo interactivo de Tarot (abanico y tiradas)
│   │   └── page.tsx                   # Landing page inmersiva de bienvenida
│   ├── admin/                         # Portal de Administración (acceso restringido is_admin)
│   │   ├── docs/                      # Centro de Conocimiento interno (visión, negocio, arquitectura)
│   │   ├── prompts/                   # Editor en caliente de Prompts de IA con invalidación de caché
│   │   ├── readings/                  # Explorador de tiradas agrupadas con visor JSONB
│   │   ├── settings/                  # Ajuste de precios de Aura y selección de marcos de cartas
│   │   ├── transactions/              # Registro de auditoría del Ledger de créditos
│   │   ├── users/                     # Directorio de usuarios y gestión de saldos
│   │   └── page.tsx                   # Dashboard administrativo con analítica en tiempo real
│   ├── api/                           # Route Handlers (Serverless Backend)
│   │   ├── admin/prompts/             # Endpoint para lectura de prompts del sistema
│   │   ├── astrology/daily/           # GET y POST de horóscopos diarios evolutivos
│   │   ├── astrology/interpret/       # Generación de interpretación de carta natal con IA
│   │   ├── credits/                   # Consulta de saldo y transacciones recientes
│   │   ├── lectura/                   # Endpoint maestro de lecturas de Tarot (1, 3 o 5 cartas)
│   │   ├── missions/                  # Consulta y reclamo de misiones y racha diaria
│   │   ├── payments/checkout/         # Creación de sesiones de pago con Lemon Squeezy
│   │   ├── payments/webhook/          # Webhook seguro HMAC SHA-256 e idempotente
│   │   └── profile/                   # Consulta y actualización de datos de perfil y coordenadas
│   └── globals.css                    # Definición de tokens Tailwind v4, Glassmorphism y CSS variables
│
├── src/                               # Capa de Dominio y Lógica de Negocio (Clean Architecture)
│   ├── domain/                        # Entidades, Contratos y Errores puros
│   │   ├── errors.ts                  # Jerarquía tipada de excepciones (AppError, InsufficientCredits, etc.)
│   │   └── schemas.ts                 # Esquemas de validación Zod, baraja de Tarot y ApiEnvelope
│   ├── gateways/                      # Adaptadores a servicios externos
│   │   └── ai-gateway.ts              # Gateway de IA sobre Groq SDK con failover gpt-oss-120b -> 20b
│   ├── services/                      # Servicios de aplicación y orquestación
│   │   ├── auth.service.ts            # Utilidades de autenticación segura (requireAuth)
│   │   ├── billing.service.ts         # Single Source of Truth para consulta y deducción de Aura
│   │   ├── lemonsqueezy.service.ts    # Checkout de pagos y validación criptográfica HMAC SHA-256
│   │   └── oracle.service.ts          # Orquestador maestro de Tarot, Astrología y Diario del Alma
│   └── utils/                         # Utilidades de infraestructura
│       └── route-handler.ts           # Manejador centralizado de errores para Route Handlers
│
├── lib/                               # Motores matemáticos, prompts y clientes de base de datos
│   ├── astrology-api.ts               # Motor astronómico local con astronomy-engine (efemérides y casas)
│   ├── soul-math.ts                   # Motor de cálculo numerológico Pitagórico puro
│   ├── prompts.ts                     # Gestor de prompts dinámicos con caché en memoria (TTL 10 min)
│   └── supabase/                      # Clientes de Supabase (browser, server SSR, service_role admin, cache)
│
├── components/                        # Componentes UI organizados por dominio (Atomic / Feature Design)
│   ├── admin/                         # Componentes de la suite administrativa
│   ├── astrology/                     # Rueda astral SVG interactiva, iconos planetarios y horóscopo
│   ├── dashboard/                     # Perfil, modales de onboarding, Aura insuficiente, misiones
│   ├── features/tarot/                # Baraja interactiva en abanico, cartas 3D y marcos coleccionables
│   ├── landing/                       # Secciones animadas, tarjetas con borde resplandeciente, partículas
│   ├── layout/                        # Barra de navegación cósmica y selector de idioma (LocaleSwitcher)
│   ├── numerology/                    # Resultados vibracionales y desglose de números de poder
│   └── ui/                            # Primitivas de UI basadas en Radix y Tailwind
│
├── supabase/migrations/               # 42 scripts de migración SQL ordenados y modulares
├── messages/                          # Diccionarios de traducción estructurada: es.json y en.json
├── i18n/                              # Configuración de rutas localizadas y middleware (next-intl)
├── types/                             # Definiciones e interfaces globales de TypeScript (index.ts)
└── docs/                              # Documentos de visión y arquitectura a escala global (MASTER_PLAN.md)
```

---

## 4. FLUJOS PRINCIPALES DEL USUARIO (DIGITAL RITUALS)

### A. El Ritual de Onboarding y Nacimiento
1. El usuario se registra o inicia sesión mediante Supabase Auth (correo o magic link).
2. Se despliega el modal de onboarding místico ([OnboardingModal.tsx](file:///c:/Proyects/sos-evolution/components/dashboard/OnboardingModal.tsx)).
3. El usuario ingresa su Nombre Completo, Fecha de Nacimiento, Hora exacta y Lugar de Nacimiento (con coordenadas geográficas).
4. El sistema ejecuta en tiempo real:
   - El cálculo de su **Camino de Vida** y **Signo Solar** ([soul-math.ts](file:///c:/Proyects/sos-evolution/lib/soul-math.ts)).
   - El cálculo y almacenamiento en caché de su **Carta Astral** ([astrology-cache.ts](file:///c:/Proyects/sos-evolution/lib/supabase/astrology-cache.ts)).
   - La asignación automática de créditos de bienvenida (Aura) y la activación de su perfil.

### B. El Flujo de una Consulta de Tarot
1. **Selección de Modalidad**: El usuario elige entre Oráculo Diario (1 carta), Consulta Específica (1 carta), Evolución Temporal (3 cartas) o Cruz Guía Evolutiva (5 cartas).
2. **Verificación de Aura**: El cliente y el servidor verifican que el usuario posea saldo suficiente (`ensureSufficientBalance`). Si no cuenta con los créditos necesarios, se abre el modal [InsufficientAuraModal.tsx](file:///c:/Proyects/sos-evolution/components/dashboard/InsufficientAuraModal.tsx) invitándolo a adquirir Aura en `/purchase`.
3. **Pregunta e Intención**: Si la modalidad lo requiere, el usuario escribe su consulta abierta.
4. **Selección Manual en Abanico**: El usuario interactúa con la baraja extendida en abanico ([TarotDeck.tsx](file:///c:/Proyects/sos-evolution/components/features/tarot/TarotDeck.tsx)) seleccionando visualmente las cartas de su tirada.
5. **Orbe Místico de Inferencia**: Durante la comunicación con la API, se muestra una animación de orbe místico con 4 fases progresivas de canalización energética.
6. **Inferencia en Paralelo e Ingesta Atómica**:
   - `OracleService` invoca a Groq (`openai/gpt-oss-120b`) procesando todas las cartas de la tirada en paralelo con un `spreadId` común.
   - Las respuestas son validadas con Zod.
   - Las cartas se insertan en `public.lecturas` con sus posiciones y órdenes relativos.
   - Se deduce el coste de la tirada una única vez en el Ledger (`spend_credits_v2`).
7. **Revelación y Lectura**: El usuario voltea interactivamente las cartas una a una o de manera global y accede a la interpretación arquetípica, palabras clave y acción ritual sugerida.
8. **Preservación en el Diario**: La tirada queda inmediatamente archivada en el Diario del Alma (`/historial`).

### C. El Flujo de la Carta Astral y Horóscopo Diario
1. Al acceder a `/astrology`, el sistema verifica si existe caché en `profiles.astrology_chart`. Si no existe, invoca la función local `getWesternChartData()` basada en `astronomy-engine`, calculando posiciones planetarias, casas y aspectos en <5 ms sin latencia de red.
2. El usuario explora su Rueda Zodiacal interactiva ([AstrologyWheel.tsx](file:///c:/Proyects/sos-evolution/components/astrology/AstrologyWheel.tsx)) y puede solicitar una interpretación evolutiva completa con IA (`POST /api/astrology/interpret`).
3. En el Horóscopo Diario, el sistema calcula los tránsitos celestes del día actual, los contrasta con los planetas natales del usuario y ofrece un mensaje personalizado con una acción de poder diaria.

### D. El Flujo de Monetización (Compra de Aura)
1. En `/purchase`, el usuario selecciona uno de los 6 paquetes de Aura o la suscripción "El Amuleto del Alma".
2. Se solicita un checkout a `POST /api/payments/checkout`, comunicando con la API de Lemon Squeezy e inyectando `user_id` y `credits` en la metadata personalizada.
3. El usuario completa el pago de manera segura en la pasarela de Lemon Squeezy.
4. El servidor de Lemon Squeezy emite un webhook firmado a `POST /api/payments/webhook`.
5. SOS Evolution valida la firma criptográfica HMAC SHA-256, comprueba la idempotencia de la orden y acredita atómicamente el Aura al usuario mediante la función SQL `add_credits`.

---

## 5. REGLAS DE ORO Y GUÍA PARA AGENTES DE IA (AI ASSISTANT RULES)

Cuando trabajes, programes, refactorices o agregues características en este repositorio, **debes cumplir estrictamente estas 10 directrices**:

### 🎨 Regla 1: Diseño Visualmente Deslumbrante (Aesthetic Excellence)
- Este proyecto **jamás debe verse plano, utilitario o genérico**. Toda pantalla o componente nuevo debe respetar la atmósfera cósmica y mística:
  - Uso de gradientes oscuros profundos (`from-slate-950 via-purple-950/20 to-slate-950`).
  - Efectos vítreos (*Glassmorphism*) con `backdrop-blur-xl`, fondos semi-translúcidos y bordes finos con brillo tenue (`border-white/10` o `border-purple-500/20`).
  - Micro-animaciones fluidas con Framer Motion en botones, tarjetas, transiciones de estado y modales.
  - Tipografía mística y elegante: uso de fuentes serifadas para títulos y display (`font-serif`) y sans-serif legible para cuerpo.

### 🔒 Regla 2: Seguridad Inquebrantable & Respeto al RLS
- Toda tabla en PostgreSQL debe contar con **Row Level Security (RLS)** activado.
- Las consultas en Route Handlers y Server Components deben realizarse a través del cliente autenticado de Supabase (`createClient()` de `@/lib/supabase/server`), el cual transmite la sesión JWT del usuario.
- **Bajo ninguna circunstancia expongas `createAdminClient()` o la clave `SUPABASE_SERVICE_ROLE_KEY` al cliente o en componentes que se ejecuten en el navegador.** Su uso está estrictamente restringido a tareas background, endpoints administrativos protegidos y el webhook de pagos.

### 🛡️ Regla 3: Tipado Estricto con TypeScript (Zero `any` Tolerance)
- El proyecto opera bajo `strict: true`. Queda terminantemente prohibido el uso de `any`.
- Si una entidad o estructura de datos existe, debe estar tipada en [types/index.ts](file:///c:/Proyects/sos-evolution/types/index.ts) o en [src/domain/schemas.ts](file:///c:/Proyects/sos-evolution/src/domain/schemas.ts).

### 🤖 Regla 4: Contratos de IA Estructurados y Resiliencia Multicapa
- Ninguna llamada a un LLM debe devolver texto libre sin estructura. Debe solicitarse estrictamente `response_format: { type: "json_object" }`.
- Las respuestas deben validarse inmediatamente contra los esquemas **Zod** de dominio (`TarotAiResponseSchema`, `AstrologyInterpretationSchema`, etc.).
- Toda llamada a IA debe contemplar la conmutación al modelo de fallback (`openai/gpt-oss-20b`) y disponer de respuestas estructuradas por defecto (`buildTarotFallback`) en caso de agotamiento de cuota o indisponibilidad del proveedor.

### 💰 Regla 5: Arquitectura Transaccional del Ledger en Dos Fases
- Toda acción que consuma Aura debe seguir inexorablemente este orden:
  1. **Fase 1 (Verificación Previa)**: Llamar a `billing.ensureSufficientBalance(userId, cost)` antes de invocar a la IA o realizar el cómputo costoso. Si el saldo es insuficiente, se lanza `InsufficientCreditsError` (HTTP 402) y la operación se cancela de inmediato sin coste.
  2. **Fase 2 (Deducción Posterior)**: Llamar a `billing.spendCredits(...)` **únicamente después** de que la inferencia de IA o el cálculo se haya completado y guardado con éxito. Si la IA falla, al usuario jamás se le descuentan sus créditos.

### 🌐 Regla 6: Internacionalización Integral (i18n de Primera Clase)
- Toda cadena de texto dirigida al usuario debe existir en [messages/es.json](file:///c:/Proyects/sos-evolution/messages/es.json) y [messages/en.json](file:///c:/Proyects/sos-evolution/messages/en.json).
- No introduzcas cadenas en español o inglés cableadas (*hardcoded*) en componentes de UI. Utiliza `useTranslations` o `getTranslations`.
- Para navegación y enlaces internos, importa siempre `Link`, `redirect`, `useRouter` y `usePathname` desde `@/i18n/routing`.
- Los prompts de IA deben respetar el idioma del usuario (`locale === 'en' ? 'English' : 'Spanish'`).

### 🪐 Regla 7: Cómputo Astronómico Local Puro
- **Nunca añadas dependencias de APIs HTTP externas para calcular efemérides planetarias**. Todo cálculo orbital debe realizarse localmente en [lib/astrology-api.ts](file:///c:/Proyects/sos-evolution/lib/astrology-api.ts) utilizando la librería `astronomy-engine`. Esto asegura disponibilidad 100%, 0 ms de latencia externa y 0 costes recurrentes de APIs de terceros.

### 📝 Regla 8: Gestión de Prompts Dinámicos e Invalidación de Caché
- Los prompts para los modelos de lenguaje residen en la tabla `system_prompts`.
- Si modificas o creas nuevos prompts a través de migraciones o en el código, asegúrate de mantener actualizados los fallbacks en `lib/prompts.ts` y de invocar `invalidatePromptCache()` para que los cambios se reflejen de inmediato en las instancias en memoria.

### 💳 Regla 9: Idempotencia en Pasarelas de Pago
- El procesamiento de pagos por webhook debe ser estrictamente idempotente: una orden de Lemon Squeezy identificada por su `order_id` solo puede acreditar saldo una única vez, previniendo duplicaciones ante reintentos de red del proveedor.

### ⚡ Regla 10: Rendimiento y Límites de Memoria Serverless
- Configura siempre `export const maxDuration = 60;` en Route Handlers que interactúen con modelos de IA para evitar cierres prematuros de conexión por el timeout predeterminado de Vercel.
- Mantén el script de desarrollo con `--max-old-space-size=4096`.

---

## 6. ESTADO ACTUAL DE DESARROLLO Y ROADMAP (v2.0)

### ✅ Funcionalidades Completamente Implementadas y Operativas
- [x] **Arquitectura Clean Architecture / DDD** con separación de Dominio, Gateways, Servicios y Controladores.
- [x] **Motor Astronómico Local**: Efemérides tridimensionales, retrogresiones, nodos lunares Rahu/Ketu, casas iguales y aspectos mayores sin API externa (`astronomy-engine`).
- [x] **Motor de Numerología Pitagórica**: Reducción recursiva y Números Maestros (11, 22, 33).
- [x] **Gateway de IA Resiliente con Groq SDK**: Modelo primario `openai/gpt-oss-120b` con conmutación automática ante errores 429/timeout a `openai/gpt-oss-20b`.
- [x] **Sistema Dinámico de Prompts**: Persistencia en base de datos (`system_prompts`), caché en memoria (TTL 10 min) y panel de edición en caliente (`/admin/prompts`).
- [x] **4 Modalidades de Tarot**: Oráculo Diario (1 carta), Consulta Específica (1 carta), Evolución Temporal (3 cartas) y Cruz Guía Evolutiva (5 cartas).
- [x] **Tiradas Multi-Carta Paralelas**: Generación concurrente en paralelo, vinculadas mediante `spread_id` y secuenciadas por `card_order` (Migración 40).
- [x] **El Diario del Alma (`/historial`)**: Explorador interactivo de consultas pasadas agrupadas por tirada con desglose de posiciones.
- [x] **Economía Ledger Inmutable**: Tablas `user_credits` y `payments`, funciones RPC atómicas (`get_user_balance_v2`, `spend_credits_v2`, `add_credits`).
- [x] **Integración Lemon Squeezy**: Tienda de créditos (`/purchase`) con 6 tiers, endpoint de checkout y webhook con firma criptográfica HMAC SHA-256 e idempotencia.
- [x] **Gamificación & Rachas**: Misiones evolutivas automáticas, bono por racha diaria (`check_daily_streak`) y popups de recompensas.
- [x] **Suite Administrativa (`/admin`)**: Dashboard analítico, explorador de tiradas con JSONB agrupado, administración de usuarios, auditoría de transacciones, editor de prompts y configuración de costes y marcos.
- [x] **Internacionalización Completa (`next-intl`)**: Soporte bilingüe inglés/español con rutas traducidas y prompts contextuales.
- [x] **Marcos de Cartas Coleccionables**: 4 diseños únicos (`Celestial`, `GoldenClassic`, `GoldenOrnate`, `MysticSilver`).

### ⏳ Funcionalidades en Desarrollo o Planificadas para el Roadmap v2.0
- [ ] **Memoria Contextual a Largo Plazo para el Oráculo (RAG Vectorial)**:
  - Integrar pgvector en Supabase para incrustar (*embeddings*) las reflexiones y lecturas históricas del usuario, permitiendo que la IA recuerde consultas pasadas ("Como vimos en tu tirada del pasado martes sobre tus miedos...").
  - Ya existe el método preparatorio `getUserEvolutionaryHistoryContext()` en `OracleService`.
- [ ] **Reporte Astral Semanal / Mensual en PDF**:
  - Generación descargable automatizada con los tránsitos astrológicos personalizados del usuario y ejercicios de meditación recomendados.
- [ ] **Misiones Evolutivas Estacionales**:
  - Eventos de temporada vinculados a efemérides cósmicas reales (Temporada de Eclipses, Mercurio Retrógrado, Solsticios y Equinoccios).
- [ ] **Desbloqueo de Cosméticos por Nivel**:
  - Posibilidad de que los usuarios elijan y desbloqueen marcos de cartas y temas visuales según su nivel de experiencia y constancia en la plataforma.

---

## 7. GUÍA RÁPIDA PARA NUEVAS SESIONES DE CHAT (AI FAST ONBOARDING)

Si eres un modelo de Inteligencia Artificial iniciando una nueva conversación sobre este repositorio:
1. **Identifica la Capa**: Si te piden modificar lógica de negocio o IA, ve a `src/services/` o `src/gateways/`. Si es UI, ve a `components/` o `app/[locale]/`. Si es base de datos, revisa `supabase/migrations/`.
2. **Revisa las Dependencias**: Recuerda que la IA funciona con **Groq SDK** (`openai/gpt-oss-120b`), la astrología con **`astronomy-engine`** local y los pagos con **Lemon Squeezy**.
3. **No Rompas el Ledger**: Verifica siempre que el saldo se consulte antes y se deduzca después del éxito de la operación.
4. **Mantén el Estilo**: Gradientes profundos, bordes místico-vítreos, tipografía serif en títulos y componentes bilingües (`messages/es.json` y `messages/en.json`).

---
*SOS Evolution — Soul Operating System. Documento de Contexto Operativo Maestro.*

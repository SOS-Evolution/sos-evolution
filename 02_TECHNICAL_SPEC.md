# DOCUMENTACIÓN TÉCNICA Y ESPECIFICACIÓN DE ARQUITECTURA: SOS EVOLUTION
> **Propósito del documento**: Servir como especificación técnica integral, base de conocimiento exhaustiva y manual de ingeniería para desarrolladores, arquitectos de software y modelos de Inteligencia Artificial. Este documento refleja con fidelidad absoluta la implementación real del repositorio SOS Evolution (Soul Operating System).

---

## 1. RESUMEN EJECUTIVO Y FICHA TÉCNICA DEL PROYECTO

- **Nombre del Sistema**: SOS Evolution (Soul Operating System)
- **Categoría**: Plataforma SaaS Full-Stack con Inteligencia Artificial Generativa, Cómputo Astronómico/Efemérides Local, Modelado Matemático de Numerología Pitagórica, Economía Transaccional tipo Ledger y Gamificación Evolutiva.
- **Tipo de Arquitectura**: Serverless Web Application basada en Clean Architecture / Domain-Driven Design (DDD), Next.js App Router (React 19), Serverless Functions y Base de Datos Relacional PostgreSQL gestionada con Supabase.
- **Modelo de Negocio**: SaaS basado en una economía de créditos virtuales ("Aura de Evolución") con 6 tiers de compra única y suscripción recurrente mensual ("El Amuleto del Alma"), integrado con la pasarela internacional Lemon Squeezy mediante Webhooks idempotentes validados con criptografía HMAC SHA-256.
- **Entorno de Ejecución**: Node.js v20+ optimizado con asignación de memoria heap (`--max-old-space-size=4096`), Next.js 15.1.12, React 19.2.3, TypeScript 5.

---

## 2. STACK TECNOLÓGICO COMPLETO Y DEPENDENCIAS

### A. Frontend & UI/UX Frameworks
- **Framework Core**: [Next.js 15.1.12](file:///c:/Proyects/sos-evolution/package.json#L25) (App Router, Server Components, Client Components, Dynamic Route Handlers, Middleware).
- **Librería de Renderizado**: [React 19.2.3](file:///c:/Proyects/sos-evolution/package.json#L27) y `react-dom` 19.2.3.
- **Lenguaje**: [TypeScript 5](file:///c:/Proyects/sos-evolution/package.json#L42) configurado en modo estricto (`strict: true`), con tipado exhaustivo de dominio sin uso de `any`.
- **Estilos & Diseño Visual**: [Tailwind CSS v4](file:///c:/Proyects/sos-evolution/package.json#L40) (`@tailwindcss/postcss`), CSS Variables nativas, efectos avanzados de *Glassmorphism*, gradientes profundos en paleta cósmica (violeta, índigo, dorado, pizarra).
- **Animaciones & Interactividad**: [Framer Motion 12.34.0](file:///c:/Proyects/sos-evolution/package.json#L22), `tw-animate-css` 1.4.0. Animaciones de diseño líquido, transiciones de layout (`LayoutGroup`, `AnimatePresence`), orbe cósmico multifase y volteo 3D de cartas de tarot.
- **Primitivas Accesibles UI**: Radix UI ([`@radix-ui/react-dialog`](file:///c:/Proyects/sos-evolution/package.json#L13), [`@radix-ui/react-dropdown-menu`](file:///c:/Proyects/sos-evolution/package.json#L14), [`@radix-ui/react-slot`](file:///c:/Proyects/sos-evolution/package.json#L15)), [Lucide React 0.562.0](file:///c:/Proyects/sos-evolution/package.json#L24) (iconografía vectorial).
- **Utilidades de Estilos**: `clsx` 2.1.1, `tailwind-merge` 3.4.0, `class-variance-authority` 0.7.1.
- **Internacionalización (i18n)**: [`next-intl` 4.8.2](file:///c:/Proyects/sos-evolution/package.json#L26). Soporte nativo para Inglés (`en`) y Español (`es`), con slugs de ruta localizados, middleware dinámico y diccionarios estructurados en [messages/es.json](file:///c:/Proyects/sos-evolution/messages/es.json) y [messages/en.json](file:///c:/Proyects/sos-evolution/messages/en.json).
- **Notificaciones & Feedback**: [Sonner 2.0.7](file:///c:/Proyects/sos-evolution/package.json#L29) (toasts contextuales animados con soporte para estados de error, cuotas y éxito).
- **Validación de Datos**: [Zod 4.3.6](file:///c:/Proyects/sos-evolution/package.json#L32) para validación en tiempo de ejecución de esquemas de IA y contratos de API.

### B. Backend, Serverless & Capa de Servicios
- **Runtime Serverless**: Next.js Route Handlers (`app/api/*`) con tiempos de ejecución configurados (`maxDuration = 60s` para operaciones con IA).
- **Patrón Arquitectónico**: Clean Architecture / Domain-Driven Design (DDD) organizado en [src/domain](file:///c:/Proyects/sos-evolution/src/domain), [src/gateways](file:///c:/Proyects/sos-evolution/src/gateways), [src/services](file:///c:/Proyects/sos-evolution/src/services) y [src/utils](file:///c:/Proyects/sos-evolution/src/utils).
- **Control de Memoria en Node.js**: Script `npm run dev` configurado con `set NODE_OPTIONS=--max-old-space-size=4096` para evitar saturación de memoria durante la compilación en caliente y el procesamiento de efemérides.

### C. Base de Datos & Capa de Persistencia
- **Motor de Base de Datos**: PostgreSQL 15+ administrado en la nube vía **Supabase**.
- **Acceso a Datos & Sesiones**: [`@supabase/supabase-js` 2.90.1](file:///c:/Proyects/sos-evolution/package.json#L17) y [`@supabase/ssr` 0.8.0](file:///c:/Proyects/sos-evolution/package.json#L16) para sincronización segura de cookies y autenticación en Server Components y Route Handlers.
- **Seguridad en BD**: Row Level Security (RLS) habilitado en el 100% de las tablas públicas con aislamiento por `auth.uid()`.
- **Arquitectura de Migraciones**: 42 archivos de migración SQL versionados y modulares en [supabase/migrations/](file:///c:/Proyects/sos-evolution/supabase/migrations), incluyendo triggers de automatización, funciones almacenadas RPC y vistas agregadas de analítica.
- **Patrón Ledger (Libro Mayor)**: Tabla `user_credits` y `payments` inmutables, con funciones transaccionales atómicas (`spend_credits_v2`, `add_credits`).

### D. Inteligencia Artificial Generativa (AI & LLM Ops)
- **SDK & Proveedor de IA**: [Groq SDK (`groq-sdk` 0.37.0)](file:///c:/Proyects/sos-evolution/package.json#L23).
- **Modelo Primario**: `openai/gpt-oss-120b` (ejecutado en la infraestructura LPU de Groq, proporcionando gran profundidad hermenéutica, riqueza mística y estricto apego a instrucciones en formato JSON).
- **Modelo de Fallback Automático**: `openai/gpt-oss-20b` (modelo ultrarrápido con latencia de inferencia inferior a 600 ms, invocado automáticamente ante fallos HTTP 429, límites de tasa o timeouts de la función serverless).
- **Contratos Estructurados**: Invocación con `response_format: { type: "json_object" }` y validación estricta en runtime con Zod schemas.
- **Gestión Dinámica de Prompts**: Sistema de prompts externalizados en la tabla `system_prompts`, con caché en memoria en Node.js (TTL 10 minutos) e invalidación granular desde el panel de administración.

### E. Motor Matemático & Computación Astronómica Local
- **Biblioteca de Efemérides**: [`astronomy-engine` 2.1.19](file:///c:/Proyects/sos-evolution/package.json#L18).
- **Cálculo Local sin Dependencias Externas**: Algoritmos de trigonometría esférica y física orbital para derivar longitudes eclípticas geocéntricas (0°-360°), detección de movimiento retrógrado, nodos lunares (Rahu/Ketu), Tiempo Sideral de Greenwich y Local, Ascendente y Sistema de Casas Iguales sin realizar llamadas a APIs externas.

### F. Pasarela de Pagos & Fintech
- **SDK**: [`@lemonsqueezy/lemonsqueezy.js` 4.0.0](file:///c:/Proyects/sos-evolution/package.json#L12).
- **Seguridad Criptográfica**: Validación estricta del header `x-signature` mediante algoritmo HMAC SHA-256 con tiempo constante (`crypto.timingSafeEqual`).
- **Idempotencia Transaccional**: Registro en tabla `payments` indexada por `order_id` único con resolución `ON CONFLICT (order_id) DO UPDATE` para evitar cargos dobles por reintentos de red.

---

## 3. ARQUITECTURA DEL SISTEMA Y CLEAN ARCHITECTURE (DDD)

El sistema implementa una arquitectura limpia y desacoplada que separa estrictamente la lógica de dominio, la orquestación de servicios, los adaptadores de infraestructura y los controladores de presentación.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN (CLIENTE & SSR)                            │
│  - Next.js 15 App Router (React 19 Server & Client Components)                         │
│  - Middleware Híbrido: i18n (next-intl es/en) + Supabase SSR Session Refresh           │
│  - Módulos UI: /dashboard, /tarot, /astrology, /numerology, /historial, /purchase      │
│  - Suite Administrativa Completa: /admin (Dashboard, Readings, Users, Prompts, Config) │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / JSON (API Envelope)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE CONTROLADORES / API HANDLERS                            │
│  - Route Handlers: app/api/lectura, app/api/astrology/*, app/api/payments/*, etc.      │
│  - Manejo de Errores Unificado: route-handler.ts (Mapeo a HTTP 400, 401, 402, 429, 500)│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE SERVICIOS (APPLICATION SERVICES)                        │
│  - AuthService: Autenticación, validación de sesiones JWT y perfiles                   │
│  - BillingService: Single Source of Truth para consulta y deducción de Aura en Ledger  │
│  - OracleService: Orquestador de Tarot (Single & Spreads), Carta Astral y Horóscopo    │
│  - LemonSqueezyService: Generación de Checkout y Verificación HMAC SHA-256             │
└───────┬───────────────────────────┬──────────────────────────┬─────────────────────────┘
        │                           │                          │
        ▼                           ▼                          ▼
┌──────────────────┐    ┌────────────────────────┐    ┌──────────────────────────────────┐
│   CAPA DOMINIO   │    │  GATEWAYS & ADAPTERS   │    │     MOTOR MATEMÁTICO LOCAL       │
│ - schemas.ts     │    │ - ai-gateway.ts        │    │ - astronomy-engine               │
│   (Zod, Deck)    │    │   Groq: gpt-oss-120b   │    │   (Efemérides, Casas, Aspectos)  │
│ - errors.ts      │    │   Fallback: oss-20b    │    │ - soul-math.ts                   │
│   (AppError hierarchy││ - prompts.ts           │    │   (Numerología Pitagórica pura)  │
│ - ApiEnvelope<T> │    │   (Cache TTL 10 min)   │    │                                  │
└───────┬──────────┘    └───────────┬────────────┘    └────────────────┬─────────────────┘
        │                           │                                  │
        └───────────────────────────┼──────────────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    CAPA DE INFRAESTRUCTURA & PERSISTENCIA (SUPABASE)                   │
│  - Cliente Server: createClient() vía @supabase/ssr                                    │
│  - Cliente Admin: createAdminClient() vía Service Role (Webhooks & Background)         │
│  - Tablas con RLS: profiles, lecturas, user_credits, payments, daily_horoscopes, etc.  │
│  - Funciones Almacenadas PL/pgSQL: spend_credits_v2, add_credits, get_readings_list    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Organización del Código Fuente (`src/` y `lib/`)

- **[src/domain/](file:///c:/Proyects/sos-evolution/src/domain)**:
  - [`schemas.ts`](file:///c:/Proyects/sos-evolution/src/domain/schemas.ts): Esquemas Zod para respuestas de IA (`TarotAiResponseSchema`, `AstrologyInterpretationSchema`, `DailyHoroscopeSchema`), baraja de 22 Arcanos Mayores (`TAROT_DECK`), costes de referencia (`READING_COSTS`), respuestas estructuradas por defecto (fallbacks) y envoltorio genérico `ApiEnvelope<T>`.
  - [`errors.ts`](file:///c:/Proyects/sos-evolution/src/domain/errors.ts): Jerarquía tipada de errores de dominio heredada de `AppError`: `InsufficientCreditsError` (HTTP 402), `NotFoundError` (HTTP 404), `UnauthorizedError` (HTTP 401), `ConfigurationError` (HTTP 500), `AiProviderError` (HTTP 502/429) y `DatabaseError` (HTTP 500).
- **[src/gateways/](file:///c:/Proyects/sos-evolution/src/gateways)**:
  - [`ai-gateway.ts`](file:///c:/Proyects/sos-evolution/src/gateways/ai-gateway.ts): Implementación del Gateway de IA con Groq SDK. Timeout de 10 segundos para prevenir bloqueos en entornos serverless. Conmutación automática en captura de errores 429/5xx hacia el modelo alternativo `openai/gpt-oss-20b`.
- **[src/services/](file:///c:/Proyects/sos-evolution/src/services)**:
  - [`auth.service.ts`](file:///c:/Proyects/sos-evolution/src/services/auth.service.ts): Función utilitaria `requireAuth(supabase)` que valida y retorna el usuario autenticado o lanza `UnauthorizedError`.
  - [`billing.service.ts`](file:///c:/Proyects/sos-evolution/src/services/billing.service.ts): Abstracción transaccional del Ledger. Métodos `getBalance(userId)`, `ensureSufficientBalance(userId, cost)` (verificación previa obligatoria) y `spendCredits(userId, amount, description, referenceId)`.
  - [`oracle.service.ts`](file:///c:/Proyects/sos-evolution/src/services/oracle.service.ts): Orquestador maestro de consultas espirituales. Resuelve costes dinámicos, inyecta contexto astrológico y numerológico en prompts, realiza reintentos con validación Zod, guarda tiradas en base de datos bajo un `spreadId` común y ensambla el Diario del Alma (`getUserSoulJournal`).
  - [`lemonsqueezy.service.ts`](file:///c:/Proyects/sos-evolution/src/services/lemonsqueezy.service.ts): Abstracción de pasarela para generación de checkouts con metadata personalizada (`user_id`, `credits`), consulta de órdenes y validación de firmas criptográficas HMAC SHA-256.
- **[src/utils/](file:///c:/Proyects/sos-evolution/src/utils)**:
  - [`route-handler.ts`](file:///c:/Proyects/sos-evolution/src/utils/route-handler.ts): Manejador unificado de excepciones para endpoints de Next.js. Mapea instancias de `AppError` a respuestas JSON estructuradas con el código HTTP correspondiente.
- **[lib/](file:///c:/Proyects/sos-evolution/lib)**:
  - [`astrology-api.ts`](file:///c:/Proyects/sos-evolution/lib/astrology-api.ts): Motor de cálculo astronómico basado en `astronomy-engine`.
  - [`soul-math.ts`](file:///c:/Proyects/sos-evolution/lib/soul-math.ts): Motor de cálculo numerológico Pitagórico puro.
  - [`prompts.ts`](file:///c:/Proyects/sos-evolution/lib/prompts.ts): Sistema de prompts dinámicos con caché en memoria e interpolación de variables.

---

## 4. PERSISTENCIA & MODELO DE DATOS (POSTGRESQL / SUPABASE)

La base de datos relacional de SOS Evolution está estructurada mediante **42 scripts de migración SQL** ejecutados en Supabase, diseñados para garantizar integridad referencial, transaccionalidad inmutable y consultas de alta velocidad.

### Catálogo de Tablas del Sistema

| Tabla | Propósito y Estructura Clave | Políticas RLS |
| :--- | :--- | :--- |
| **`public.profiles`** | Perfil de usuario extendido (`id` PK referencing `auth.users.id`). Almacena `full_name`, `display_name`, `birth_date`, `birth_time`, `birth_place`, `latitude`, `longitude`, `timezone`, `gender`, `life_path_number`, `zodiac_sign`, `astrology_chart` (JSONB cache), `unlocked_features` (text[]), `is_admin` (boolean). | Lectura y actualización restringidas a `auth.uid() = id`. |
| **`public.lecturas`** | Registro histórico de cartas de tarot consultadas. Almacena `id`, `user_id`, `reading_type_id`, `card_name`, `keywords` (text[]), `description`, `action`, `question`, `position`, `spread_id` (UUID para agrupar cartas de una misma tirada), `card_order` (INTEGER para secuenciación), `created_at`. | Lectura e inserción para `auth.uid() = user_id`. Acceso total para administradores. |
| **`public.user_credits`** | Libro Mayor (Ledger inmutable) de transacciones de Aura. Columnas: `id` (UUID), `user_id`, `amount` (positivo para recargas, negativo para consumos), `source` (`'reading'`, `'purchase'`, `'mission'`, `'bonus'`, `'admin'`), `description`, `reference_id`, `created_at`. | Lectura para `auth.uid() = user_id`. Modificación directa bloqueada para usuarios (solo mediante funciones `SECURITY DEFINER`). |
| **`public.payments`** | Registro de órdenes de pasarela Lemon Squeezy. Columnas: `id` (UUID), `user_id`, `order_id` (TEXT UNIQUE), `variant_id`, `amount` (en centavos), `currency`, `status` (`'pending'`, `'paid'`, `'refunded'`), `credits_awarded`, `created_at`, `updated_at`. | Lectura restringida a `auth.uid() = user_id`. Modificación exclusiva mediante `service_role` (webhooks). |
| **`public.missions`** | Catálogo de misiones evolutivas y tareas diarias. Columnas: `id`, `code` (UNIQUE), `title`, `description`, `reward_credits`, `trigger_type` (`'manual'`, `'auto_profile'`, `'auto_reading'`, `'auto_streak'`), `trigger_config` (JSONB), `icon`, `is_active`, `sort_order`. | Lectura pública para usuarios autenticados. Edición solo administradores. |
| **`public.user_missions`** | Estado de progreso de misiones por usuario. Columnas: `id`, `user_id`, `mission_id`, `progress`, `target`, `completed` (boolean), `completed_at`, `created_at`. | Lectura y actualización para `auth.uid() = user_id`. |
| **`public.reading_types`** | Configuración dinámica de modalidades de consulta. Columnas: `id`, `code` (UNIQUE: `'daily'`, `'general'`, `'classic'`, `'cross'`, `'daily_scope'`, `'astrology_full'`), `name`, `description`, `credit_cost`, `icon`, `sort_order`, `is_active`. | Lectura pública para autenticados. Modificación administradores. |
| **`public.astrology_interpretations`** | Interpretaciones generadas por IA de la carta natal. Columnas: `id`, `user_id`, `summary`, `core_personality`, `strengths` (text[]), `challenges` (text[]), `evolutionary_advice`, `chart_snapshot` (JSONB), `language`, `created_at`. | CRUD para `auth.uid() = user_id`. |
| **`public.daily_horoscopes`** | Caché de horóscopos diarios generados por IA. Columnas: `id`, `user_id`, `date` (DATE), `content` (JSONB), `transits_snapshot` (JSONB), `language`, `created_at`. Índice único: `(user_id, date, language)`. | Lectura e inserción para `auth.uid() = user_id`. |
| **`public.daily_transits`** | Caché planetario diario general. Columnas: `id`, `date` (DATE UNIQUE), `planets_data` (JSONB), `created_at`. | Lectura pública. Inserción background/serverless. |
| **`public.system_prompts`** | Repositorio de prompts de IA en caliente. Columnas: `id`, `code` (UNIQUE), `description`, `template` (TEXT), `required_variables` (text[]), `group`, `language`, `updated_at`. | Lectura para usuarios autenticados. Edición administradores. |
| **`public.system_settings`** | Claves de configuración del sistema (`key` PK, `value` JSONB, `description`, `updated_at`). Ej: `tarot_frame`. | Lectura pública. Edición administradores. |

### Catálogo de Funciones Almacenadas (RPC) y Triggers

1. **`get_user_balance_v2(p_user_id UUID)`**:
   - Calcula el saldo neto sumando todos los registros de la tabla `user_credits` (`COALESCE(SUM(amount), 0)`).
   - Ejecución: `SECURITY DEFINER` con `search_path = public`.
2. **`spend_credits_v2(p_user_id UUID, p_amount INTEGER, p_description TEXT, p_reference_id TEXT)`**:
   - Verifica atómicamente que `p_amount > 0` y que el saldo disponible sea suficiente.
   - Inserta un registro con valor negativo (`-p_amount`) en `user_credits`.
   - Lanza excepción SQL si el saldo es insuficiente, impidiendo carreras críticas (*race conditions*).
3. **`add_credits(p_user_id UUID, p_amount INTEGER, p_source TEXT, p_description TEXT, p_reference_id TEXT)`**:
   - Añade saldo positivo al usuario desde orígenes autorizados (compra, recompensa, misión o ajuste manual).
4. **`get_readings_list_admin(p_limit INTEGER DEFAULT 50)`** *(Migración 40)*:
   - Consulta administrativa que agrupa las lecturas por `spread_id`.
   - Ensambla un resumen en texto (`cards_summary` con formato `"Posición: Carta 1 → Posición: Carta 2"`) y una estructura JSONB agregada (`cards_detail`) con el detalle completo de cada carta de la tirada.
   - Vincula datos del perfil y correo electrónico de `auth.users`.
5. **`get_admin_stats()`**:
   - Retorna en un solo llamado optimizado: `total_users`, `total_credits` (en circulación) y `total_readings`.
6. **`get_recent_activity_admin()`**:
   - Une en una sola línea de tiempo los últimos registros de nuevos usuarios y las consultas de lecturas realizadas.
7. **`check_daily_streak(p_user_id UUID)`**:
   - Valida la racha de días consecutivos de conexión del usuario y otorga Aura de bonificación automática.
8. **`complete_mission(p_user_id UUID, p_mission_code TEXT)`**:
   - Marca una misión como completada en `user_missions` y llama a `add_credits` con la recompensa configurada.

---

## 5. MOTOR DE INTELIGENCIA ARTIFICIAL (AI & LLM OPS)

### Arquitectura del Gateway de IA (`src/gateways/ai-gateway.ts`)

La interacción con modelos de lenguaje está centralizada en la factoría `createAiGateway()`, implementada sobre el SDK oficial de Groq (`groq-sdk`).

```typescript
// Configuración de Resiliencia del Gateway
const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY,
    timeout: 10000 // Timeout estricto de 10s para funciones Serverless
});
```

- **Estrategia de Doble Nivel (Fallback Dinámico)**:
  1. **Nivel Primario**: Envío de la consulta a `openai/gpt-oss-120b`. Si el modelo responde dentro del margen de 10 segundos con JSON válido, la respuesta es procesada inmediatamente.
  2. **Nivel Secundario (Fallback)**: Si ocurre un error de cuota (HTTP 429), saturación de tasa, timeout de red o error 5xx, el bloque `catch` conmuta instantáneamente al modelo `openai/gpt-oss-20b` incrementando levemente la temperatura (`temperature + 0.1`) para garantizar diversidad creativa con una latencia de inferencia inferior a 600 ms.

### Sistema de Prompts Dinámicos y Caché en Memoria (`lib/prompts.ts`)

Los prompts de SOS Evolution no están cableados en el código ejecutable:
1. **Persistencia en Base de Datos**: Almacenados en la tabla `system_prompts` organizados por código único (`tarot_system`, `tarot_user`, `tarot_retry`, `astro_natal_system_es`, `astro_natal_user_es`, `astro_daily_system_es`, etc.).
2. **Caché en Memoria con TTL**: Para evitar consultas repetitivas a la base de datos en cada invocación de IA, `lib/prompts.ts` mantiene un mapa en memoria con un tiempo de vida (TTL) de 10 minutos (`CACHE_TTL_MS = 600000`).
3. **Invalidación Reactiva**: La función `invalidatePromptCache(code?)` permite limpiar la memoria de forma selectiva o total inmediatamente después de que un administrador guarda cambios en `/admin/prompts`.
4. **Interpolación de Variables**: Algoritmo de reemplazo regex `/{{\s*variable\s*}}/g` que inyecta los datos dinámicos del consultante (`selectedCard`, `userContext`, `typeContext`, `positionContext`, `language`, `schemaJSON`, etc.).
5. **Fallbacks en Código**: Si la base de datos no está disponible momentáneamente, el sistema recurre al diccionario constante `FALLBACK_PROMPTS` para asegurar una disponibilidad ininterrumpida.

### Validación de Contratos JSON con Zod

Toda inferencia recibida del LLM se somete a validación de esquemas:
- **`TarotAiResponseSchema`**: Requiere `cardName` (string), `keywords` (array de 1 a 10 strings), `description` (string de mínimo 20 caracteres) y `action` (string de mínimo 10 caracteres).
- **Mecanismo de Auto-Recuperación (Retry con Prompt Especializado)**: Si la respuesta del LLM no cumple con el esquema Zod, `OracleService` ejecuta un reintento enviando el prompt `tarot_retry`. Si el reintento también fallara, el sistema ensambla una respuesta mística garantizada utilizando los fallbacks curados (`buildTarotFallback`).

---

## 6. MOTOR MATEMÁTICO & PIPELINE ASTROLÓGICO

### A. Motor de Numerología Pitagórica (`lib/soul-math.ts`)
Implementación en TypeScript puro sin dependencias externas:
- **Normalización de Texto**: Tratamiento de cadenas mediante `normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "")` para eliminar diacríticos, acentos y caracteres especiales.
- **Mapeo Pitagórico**: Mapeo alfabético canónico (1 a 9) con inclusión especial de la letra 'ñ'.
- **Reducción Recursiva con Protección de Números Maestros**: La función `reduceNumber(num)` descompone el número en dígitos sumados iterativamente, deteniendo la reducción si alcanza un solo dígito (1-9) o preservando intactos los **Números Maestros**: `11`, `22` y `33`.
- **Cálculos Disponibles**:
  - **Camino de Vida (Life Path Number)**: Suma individual reducida de día, mes y año según el método tradicional.
  - **Número de Destino / Expresión**: Reducción de todos los caracteres del nombre completo.
  - **Deseo del Alma (Soul Urge)**: Filtrado algebraico exclusivo sobre vocales (`a, e, i, o, u`).
  - **Número de Personalidad**: Filtrado algebraico exclusivo sobre consonantes.

### B. Motor Astronómico y Efemérides Locales (`lib/astrology-api.ts`)
El sistema no depende de servicios web de terceros para el cálculo de cartas astrales. Utiliza la librería de precisión astronómica `astronomy-engine`:
1. **Conversión Temporal UTC**: Convierte año, mes, día, hora, minuto y huso horario del usuario en una coordenada universal de tiempo `Astronomy.AstroTime`.
2. **Coordenadas Eclípticas Geocéntricas**: Obtiene la longitud eclíptica tridimensional (`eclLon`) de 10 cuerpos celestes: Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno y Plutón.
3. **Cálculo de Retrogresión**: Algoritmo que calcula la variación de longitud eclíptica en un intervalo de 24 horas ($t + 1\text{ día} - t - 1\text{ día}$). Una tasa angular negativa determina inequívocamente que el planeta está en fase retrógrada (`isRetro: true`).
4. **Nodos Lunares (Rahu y Ketu)**: Longitud del nodo lunar ascendente (Rahu) computada mediante la fórmula analítica IAU 1980 en función de los siglos julianos desde la época J2000. El nodo descendente (Ketu) se calcula como el punto exactamente opuesto ($(\text{Rahu} + 180^\circ) \pmod{360^\circ}$).
5. **Ascendente Trigonométrico**: Calculado mediante el Tiempo Sideral de Greenwich (`gst`), derivando el Tiempo Sideral Local (`lst = gst \times 15^\circ + \text{longitud}`), y aplicando la proyección trigonométrica con la oblicuidad de la eclíptica terrestre (`eps`):
   $$\text{Asc} = \arctan2(-\cos(\text{lst}), \sin(\text{lst})\cos(\text{eps}) + \tan(\text{lat})\sin(\text{eps}))$$
6. **Sistema de Casas Iguales (Equal House)**: Cada una de las 12 casas abarca un arco exacto de $30^\circ$ proyectado a partir del grado exacto del Ascendente.
7. **Matriz de Aspectos Planetarios**: Algoritmo $O(N^2)$ que evalúa la distancia angular mínima en el círculo entre cada par de planetas ($360^\circ - \text{diff}$) para identificar aspectos mayores:
   - **Conjunción**: $0^\circ$ (Orbe $8^\circ$)
   - **Oposición**: $180^\circ$ (Orbe $8^\circ$)
   - **Trígono**: $120^\circ$ (Orbe $8^\circ$)
   - **Cuadratura**: $90^\circ$ (Orbe $8^\circ$)
   - **Sextil**: $60^\circ$ (Orbe $6^\circ$)
8. **Caché en Perfil**: Los resultados de la carta astral se almacenan en el campo JSONB `profiles.astrology_chart` a través de [lib/supabase/astrology-cache.ts](file:///c:/Proyects/sos-evolution/lib/supabase/astrology-cache.ts) para lograr latencia 0 ms en visitas subsecuentes.

---

## 7. FINTECH, ECONOMÍA DE CRÉDITOS & WEBHOOKS

### Catálogo de Tiers de Compra de Aura (`app/[locale]/purchase/page.tsx`)

| Tier ID | Nombre en Plataforma | Precio (USD) | Aura Otorgada | Coste por Crédito | Modalidad |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `explorador` | Explorador Cósmico | $1.99 | 150 Aura | ~$0.0132 | Pago Único |
| `iniciado` | Iniciado del Templo | $4.99 | 500 Aura | ~$0.0099 | Pago Único |
| `adepto` | Adepto Místico | $19.99 | 2,500 Aura | ~$0.0079 | Pago Único |
| `maestro` | Maestro Alquimista | $44.99 | 6,500 Aura | ~$0.0069 | Pago Único |
| `avatar` | Avatar de la Consciencia | $99.99 | 15,000 Aura | ~$0.0066 | Pago Único |
| `amuleto` | El Amuleto del Alma | $11.11 / mes | Membresía recurrente | Suscripción | Recurrente |

### Costes de Consumo de Aura por Operación (`reading_types`)

- **Oráculo Diario** (`daily`): 20 Aura (1 carta).
- **Consulta Específica** (`general`): 20 Aura (1 carta con pregunta).
- **Evolución Temporal** (`classic`): 100 Aura (3 cartas: Pasado, Presente, Futuro).
- **Cruz Guía Evolutiva** (`cross`): 150 Aura (5 cartas: Presente, Desafío, Origen, Consejo, Desenlace).
- **Horóscopo Diario Evolutivo** (`daily_scope`): 10 Aura (Gratis la primera lectura diaria).
- **Interpretación Astral Completa** (`astrology_full`): 20 Aura (Cálculo de carta es gratuito; interpretación de IA consume 20).

### Flujo Criptográfico del Webhook de Lemon Squeezy (`app/api/payments/webhook/route.ts`)

```
Lemon Squeezy Server                     SOS Evolution Serverless Webhook Route
       │                                                      │
       │── POST /api/payments/webhook (x-signature header) ──>│
       │                                                      │
       │                                        1. Leer rawBody (req.text())
       │                                        2. Validar firma criptográfica:
       │                                           crypto.createHmac('sha256', SECRET)
       │                                           crypto.timingSafeEqual(digest, signature)
       │                                           Si no coincide -> 401 Unauthorized
       │                                                      │
       │                                        3. Parsear JSON & Extraer custom_data:
       │                                           user_id, credits, order_id, status
       │                                                      │
       │                                        4. Control de Idempotencia:
       │                                           SELECT status, credits_awarded FROM payments
       │                                           WHERE order_id = :order_id
       │                                           Si ya fue 'paid' -> Retornar { alreadyProcessed: true }
       │                                                      │
       │                                        5. Upsert en tabla `payments`:
       │                                           status = 'paid', credits_awarded = credits
       │                                                      │
       │                                        6. Otorgamiento Atómico de Créditos:
       │                                           SELECT add_credits(user_id, credits, 'purchase', ...)
       │                                                      │
       │<────────────── 200 OK { received: true } ────────────│
```

---

## 8. FRONTEND, UI/UX & SISTEMA DE DISEÑO

### Estética y Sistema de Diseño Cósmico
- **Filosofía**: La interfaz trasciende el concepto de una aplicación utilitaria tradicional; está concebida como un santuario digital interactivo.
- **Glassmorphism y Efectos de Resplandor**:
  - Paneles traslúcidos con bordes semi-invisibles (`border-white/10`, `backdrop-blur-xl`).
  - Componente [GlowingBorderCard.tsx](file:///c:/Proyects/sos-evolution/components/landing/GlowingBorderCard.tsx): Genera gradientes perimetrales que reaccionan dinámicamente al puntero o adoptan colores temáticos (púrpura, cian, ámbar, esmeralda, dorado).
  - Fondo reactivo con partículas estelares ([ParticlesBackground.tsx](file:///c:/Proyects/sos-evolution/components/landing/ParticlesBackground.tsx)).
- **Marcos de Cartas de Tarot (Tarot Card Frames)**:
  - Sistema modular de marcos coleccionables ubicados en [components/features/tarot/frames/](file:///c:/Proyects/sos-evolution/components/features/tarot/frames):
    1. `CelestialFrame`: Marco cósmico con constelaciones y runas estelares.
    2. `GoldenClassicFrame`: Marco tradicional dorado con cenefas renacentistas.
    3. `GoldenOrnateFrame`: Marco barroco con filigrana dorada y gemas reflectivas.
    4. `MysticSilverFrame`: Marco etéreo de plata líquida.
  - El marco activo para la plataforma puede conmutarse globalmente desde `/admin/settings`.
- **Experiencia de Carga Ritualística en Tarot**:
  - Al completar la selección en abanico interactivo de cartas ([TarotDeck.tsx](file:///c:/Proyects/sos-evolution/components/features/tarot/TarotDeck.tsx)), la interfaz despliega un orbe místico animado con partículas orbitales que atraviesa 4 fases guiadas:
    1. *"Conectando con el cosmos..."* (0 a 2s)
    2. *"Canalizando la energía de tu carta..."* (2s a 4s)
    3. *"Interpretando los símbolos..."* (4s en adelante)
    4. *"Tu mensaje está listo..."* (Transición suave previa a la revelación).
- **El Diario del Alma ([SoulJournalClient.tsx](file:///c:/Proyects/sos-evolution/components/features/tarot/SoulJournalClient.tsx))**:
  - Vista histórica en `/historial` donde las consultas ya no se muestran como filas aisladas, sino agrupadas coherentemente por su `spread_id`. Permite visualizar la pregunta original, la fecha, las posiciones de las cartas (Pasado, Presente, Futuro, etc.) y la interpretación completa guardada.

### Internacionalización Avanzada (i18n)
- **Middleware Unificado ([middleware.ts](file:///c:/Proyects/sos-evolution/middleware.ts))**:
  - Coordina `next-intl` con la actualización de sesiones de Supabase Auth (`updateSession`), resolviendo el problema de bloqueo de cookies en Server Components.
- **Rutas Localizadas ([i18n/routing.ts](file:///c:/Proyects/sos-evolution/i18n/routing.ts))**:
  - Soporte de URLs adaptadas al idioma del usuario:
    - `/dashboard` $\rightarrow$ `/en/home` | `/es/inicio`
    - `/numerology` $\rightarrow$ `/en/numerology` | `/es/numerologia`
    - `/astrology` $\rightarrow$ `/en/astrology` | `/es/astrologia`
    - `/missions` $\rightarrow$ `/en/missions` | `/es/misiones`
    - `/historial` $\rightarrow$ `/en/history` | `/es/historial`
    - `/purchase` $\rightarrow$ `/en/purchase` | `/es/comprar`
    - `/credits/success` $\rightarrow$ `/en/credits/success` | `/es/creditos/exito`

---

## 9. SUITE ADMINISTRATIVA (/admin)

El portal de administración de SOS Evolution es un centro de comando integral accesible únicamente para perfiles con `is_admin = true`:

1. **Dashboard General ([app/admin/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/page.tsx))**:
   - Métricas en tiempo real: total de usuarios registrados, volumen de Aura de Evolución en circulación y total de lecturas despachadas.
   - Panel de actividad reciente en tiempo real.
2. **Explorador de Lecturas ([app/admin/readings/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/readings/page.tsx))**:
   - Visualización de tiradas agrupadas mediante la función RPC `get_readings_list_admin`.
   - Muestra el correo y nombre del consultante, la pregunta formulada, el resumen visual de cartas y un modal con el desglose JSONB de cada posición.
3. **Gestión de Usuarios ([app/admin/users/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/users/page.tsx))**:
   - Búsqueda de usuarios, consulta de saldos individuales, otorgamiento manual de Aura y asignación de privilegios de administrador.
4. **Auditoría del Ledger ([app/admin/transactions/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/transactions/page.tsx))**:
   - Registro cronológico inmutable de todas las transacciones de créditos (compras, consumos, bonificaciones, misiones).
5. **Editor de Prompts en Vivo ([app/admin/prompts/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/prompts/page.tsx))**:
   - Interfaz gráfica para inspeccionar y editar las plantillas de prompts de sistema y de usuario para Tarot y Astrología en inglés y español.
   - Cuenta con botón de guardado con invalidación automática de la caché en memoria del servidor.
6. **Configuración del Sistema ([app/admin/settings/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/settings/page.tsx))**:
   - Ajuste dinámico de los precios en Aura para cada tipo de lectura (`reading_types`).
   - Selector visual de marco de cartas de tarot activo globalmente.
7. **Centro de Conocimiento ([app/admin/docs/page.tsx](file:///c:/Proyects/sos-evolution/app/admin/docs/page.tsx))**:
   - Módulos interactivos de documentación integrados en la aplicación: Visión & Filosofía, Arquitectura Técnica, Contenido Base, Modelo de Negocio e Ideas del Sistema.

---

## 10. ESPECIFICACIÓN DE LA API REST (ROUTE HANDLERS)

### Formato Estándar de Respuesta (`ApiEnvelope<T>`)
Todos los endpoints devuelven o encapsulan sus respuestas bajo el siguiente formato de contrato:
```typescript
interface ApiEnvelope<T> {
    data: T | null;
    error: string | null;
    meta?: {
        creditsUsed?: number;
        newBalance?: number;
        [key: string]: unknown;
    };
}
```

### Catálogo de Endpoints

#### `POST /api/lectura`
- **Descripción**: Genera una tirada de tarot interpretada con IA (single o multi-carta), descuenta el coste en Aura y guarda el registro en la BD.
- **Autenticación**: Requerida (Cookie de sesión JWT).
- **Request Body**:
  ```json
  {
    "question": "¿Hacia dónde debo enfocar mi propósito este mes?",
    "cardIndices": [0, 4, 19],
    "readingTypeCode": "classic",
    "positions": ["Pasado", "Presente", "Futuro"],
    "locale": "es"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "spreadId": "d8e3c540-8b43-41a6-b519-7e21a24d2938",
    "readings": [
      {
        "id": 104,
        "cardName": "El Loco",
        "keywords": ["Comienzo", "Espontaneidad", "Fe"],
        "description": "El Loco irrumpe en tu pasado señalando un salto al vacío...",
        "action": "Dedica 10 minutos a escribir qué ataduras del pasado estás listo para soltar.",
        "position": "Pasado"
      }
    ],
    "creditsUsed": 100,
    "newBalance": 450
  }
  ```
- **Códigos de Error**: `401 Unauthorized`, `402 Payment Required` (Aura insuficiente), `429 Too Many Requests` (Cuota de IA saturada), `500 Internal Error`.

#### `POST /api/astrology/interpret`
- **Descripción**: Interpreta la carta natal completa del usuario basándose en sus datos planetarios y aspectos.
- **Request Body**: `{ "chartData": { "planets": [...], "houses": [...], "aspects": [...] }, "locale": "es" }`
- **Response (200 OK)**: Objeto con `summary`, `core_personality`, `strengths`, `challenges`, `evolutionary_advice`, `id`, `creditsUsed: 20`, `newBalance`.

#### `GET /api/astrology/daily?locale=es&date=YYYY-MM-DD`
- **Descripción**: Consulta si el usuario ya tiene un horóscopo diario generado para la fecha solicitada.
- **Response**: Devuelve el JSON del horóscopo si existe o `null` con status 200 si aún no ha sido generado.

#### `POST /api/astrology/daily`
- **Descripción**: Cruza la carta natal del usuario con los tránsitos planetarios del día actual calculados con `astronomy-engine` y genera el horóscopo diario evolutivo.
- **Response**: `{ "headline": "...", "message": "...", "power_action": "...", "lucky_color": "...", "lucky_number": 7, "creditsUsed": 10, "newBalance": ... }`.

#### `GET /api/credits`
- **Descripción**: Obtiene el saldo actual de Aura y el listado de las últimas transacciones del usuario.

#### `POST /api/missions/daily`
- **Descripción**: Valida la racha diaria de conexión e incrementa el contador de días consecutivos otorgando recompensas.

#### `POST /api/payments/checkout`
- **Descripción**: Crea una sesión de compra en Lemon Squeezy y devuelve la URL de pago.
- **Request Body**: `{ "variantId": "...", "credits": 500, "amount": 499 }`.
- **Response**: `{ "url": "https://sos-evolution.lemonsqueezy.com/checkout/buy/..." }`.

#### `POST /api/payments/webhook`
- **Descripción**: Endpoint de recepción de eventos de Lemon Squeezy con validación criptográfica HMAC SHA-256 e ingesta idempotente.

---

## 11. GUÍA DE DESPLIEGUE, ENTORNO Y SCRIPTS

### Variables de Entorno Requeridas (`.env.local`)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Groq AI Credentials
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Lemon Squeezy Fintech
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOi...
LEMONSQUEEZY_STORE_ID=123456
LEMONSQUEEZY_WEBHOOK_SECRET=tu_secreto_de_webhook_configurado_en_ls

# Lemon Squeezy Variants (Product IDs)
NEXT_PUBLIC_LS_VARIANT_PACK_1=111111 # Explorador ($1.99 - 150 Aura)
NEXT_PUBLIC_LS_VARIANT_PACK_2=222222 # Iniciado ($4.99 - 500 Aura)
NEXT_PUBLIC_LS_VARIANT_PACK_3=333333 # Adepto ($19.99 - 2500 Aura)
NEXT_PUBLIC_LS_VARIANT_PACK_4=444444 # Maestro ($44.99 - 6500 Aura)
NEXT_PUBLIC_LS_VARIANT_PACK_5=555555 # Avatar ($99.99 - 15000 Aura)
NEXT_PUBLIC_LS_VARIANT_SUSCRIPCION_PREMIUM=666666 # Amuleto ($11.11/mo)

# App URL
NEXT_PUBLIC_APP_URL=https://sos-evolution.com
```

### Scripts de NPM
- `npm run dev`: Inicia el servidor de desarrollo con asignación de 4GB de memoria heap (`NODE_OPTIONS=--max-old-space-size=4096 next dev`).
- `npm run build`: Compila el bundle de producción para Vercel o Node.js Serverless.
- `npm run start`: Inicia el servidor optimizado de producción.
- `npm run lint`: Ejecuta las validaciones de ESLint.

---

## 12. LOGROS TÉCNICOS & BULLET POINTS PARA CURRICULUM VITAE (CV)

### 🚀 Para Perfiles de Software Engineer (Full-Stack / Backend)
- **Diseñó e implementó la arquitectura Clean Architecture / DDD** de una plataforma web SaaS sobre **Next.js 15 (App Router, React 19) y TypeScript**, desacoplando la lógica de negocio en capas independientes de Dominio, Gateways y Servicios.
- **Desarrolló un Gateway de IA de alta disponibilidad con Groq SDK**, implementando conmutación automática por fallo (*failover*) entre modelos (`openai/gpt-oss-120b` $\rightarrow$ `openai/gpt-oss-20b`), reintentos inteligentes y contratos fuertemente tipados con esquemas **Zod** para garantizar un 100% de respuestas en JSON estructurado.
- **Implementó un sistema de Prompts Dinámicos en caliente** persistido en PostgreSQL (`system_prompts`) con **caché en memoria en Node.js (TTL 10 min)** e invalidación reactiva inmediata desde la suite de administración.
- **Construyó una pasarela de cobros segura con Lemon Squeezy**, validando webhooks con firmas criptográficas **HMAC SHA-256** (`crypto.timingSafeEqual`) y garantizando **idempotencia** transaccional mediante `ON CONFLICT` en PostgreSQL.
- **Desarrolló un sistema de internacionalización integral (i18n)** con `next-intl`, enrutamiento localizado multilingüe (español/inglés) y un middleware híbrido que coordina la persistencia de sesiones de Supabase SSR.

### 📊 Para Perfiles de Data Engineer / Backend de Datos
- **Diseñó e implementó el modelo relacional en PostgreSQL (Supabase)** estructurado en **42 migraciones SQL limpias y modulares**, aplicando políticas de **Row-Level Security (RLS)** y un patrón de **Ledger (Libro Mayor)** inmutable para auditoría financiera.
- **Construyó un motor de cómputo astronómico local con `astronomy-engine`**, procesando coordenadas eclípticas tridimensionales geocéntricas de 10 planetas, cálculo de nodos lunares (Rahu/Ketu con fórmula IAU 1980), Ascendente y aspectos angulares ($0^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ$) eliminando totalmente la dependencia de APIs externas y reduciendo la latencia de cómputo a 0 ms.
- **Creó funciones almacenadas en PL/pgSQL (`SECURITY DEFINER`)** para la gestión atómica de saldos financieros (`spend_credits_v2`, `add_credits`), impidiendo condiciones de carrera (*race conditions*), y agregaciones analíticas complejas con **JSONB** (`get_readings_list_admin`).
- **Implementó estrategias de caché de datos a nivel de base de datos** (`astrology_chart`, `daily_transits`, `daily_horoscopes`) para optimizar costos de cómputo e inferencia.

---
*Documentación Técnica Oficial de SOS Evolution — Actualizada y validada contra el código fuente del proyecto.*

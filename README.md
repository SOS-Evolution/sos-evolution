# SOS Evolution — Soul Operating System

> **Plataforma SaaS de bienestar espiritual y desarrollo personal** que fusiona simbología ancestral (Tarot, Numerología Pitagórica y Astrología Occidental) con Inteligencia Artificial Generativa, cómputo astronómico local de alta precisión y diseño visual inmersivo.

---

## ✨ ¿Qué es SOS Evolution?

SOS Evolution no es una app de adivinación. Es un **santuario digital para el autodescubrimiento**, la introspección psicológica arquetípica (inspirada en Carl Jung) y la guía evolutiva diaria. El objetivo es convertirse en el **"Headspace de la Espiritualidad Consciente"**.

Cada interacción — una consulta de tarot, la carta natal o el horóscopo diario — está diseñada como un **ritual digital**: estético, consciente y personalizado.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 15.1.12 (App Router, React 19) |
| **Lenguaje** | TypeScript 5 — modo `strict: true`, zero `any` |
| **Estilos** | Tailwind CSS v4, Glassmorphism, gradientes cósmicos |
| **Animaciones** | Framer Motion 12 (layouts líquidos, orbe multifase, flip 3D) |
| **UI Primitivas** | Radix UI, Lucide React, Sonner (toasts) |
| **i18n** | next-intl 4 — Español / Inglés con rutas traducidas |
| **Base de datos** | PostgreSQL 15 vía Supabase (RLS en 100% de tablas) |
| **Auth** | Supabase Auth + @supabase/ssr (cookies seguras SSR) |
| **IA / LLM** | Groq SDK — `openai/gpt-oss-120b` (fallback: `oss-20b`) |
| **Validación** | Zod 4 — todos los contratos de IA y API |
| **Pagos** | Lemon Squeezy — Webhooks HMAC SHA-256, idempotentes |
| **Astronomía** | `astronomy-engine` 2.1.19 — cálculo local sin APIs externas |
| **Numerología** | Motor Pitagórico puro en TypeScript (`lib/soul-math.ts`) |

---

## 🏛️ Arquitectura

El proyecto implementa **Clean Architecture / DDD** sobre Next.js App Router:

```
┌───────────────────────────────────────────────────┐
│           PRESENTACIÓN (Next.js App Router)        │
│   app/[locale]/*  ·  components/*  ·  middleware   │
└────────────────────────┬──────────────────────────┘
                         │ HTTP / ApiEnvelope<T>
┌────────────────────────▼──────────────────────────┐
│              API HANDLERS  (app/api/*)              │
│   lectura · astrology · missions · payments        │
└────────────────────────┬──────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────┐
│           SERVICIOS DE APLICACIÓN (src/services/)  │
│   OracleService · BillingService                   │
│   AuthService  · LemonSqueezyService               │
└──────┬───────────────────────────┬────────────────┘
       │                           │
┌──────▼──────────┐   ┌────────────▼───────────────┐
│  DOMINIO        │   │  GATEWAYS & ADAPTERS        │
│  schemas.ts     │   │  ai-gateway.ts (Groq)       │
│  errors.ts      │   │  prompts.ts (cache TTL 10m) │
└─────────────────┘   └────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────┐
│           INFRAESTRUCTURA (Supabase / PostgreSQL)   │
│   42 migraciones SQL · RLS · RPCs SECURITY DEFINER │
└───────────────────────────────────────────────────┘
```

### Capas del código fuente

| Directorio | Responsabilidad |
|---|---|
| `src/domain/` | Esquemas Zod, baraja de Tarot, jerarquía de errores |
| `src/gateways/` | Gateway de IA (Groq SDK, failover automático) |
| `src/services/` | OracleService, BillingService, AuthService, LemonSqueezyService |
| `src/utils/` | `route-handler.ts` — manejo unificado de errores HTTP |
| `lib/` | Motor astronómico, numerología Pitagórica, gestor de prompts |
| `app/api/` | Route Handlers (serverless, `maxDuration = 60s` para IA) |
| `app/[locale]/` | Páginas UI localizadas (es/en) |
| `components/` | UI por dominio: tarot, astrology, dashboard, admin, landing |
| `supabase/migrations/` | 42 scripts SQL versionados y modulares |
| `messages/` | Diccionarios i18n: `es.json` y `en.json` |
| `.agents/` | Contexto operativo para IA: System Context, Technical Spec, Competitor Analysis |

---

## 🚀 Puesta en Marcha

### Prerrequisitos
- Node.js v20+
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Groq](https://console.groq.com)
- Cuenta en [Lemon Squeezy](https://www.lemonsqueezy.com)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea `.env.local` en la raíz con las siguientes variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Groq AI
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Lemon Squeezy
LEMONSQUEEZY_API_KEY=eyJ0eXAi...
LEMONSQUEEZY_STORE_ID=123456
LEMONSQUEEZY_WEBHOOK_SECRET=tu_secreto_de_webhook

# Variants de Lemon Squeezy (IDs de producto)
NEXT_PUBLIC_LS_VARIANT_PACK_1=111111   # Explorador  $1.99  - 150 Aura
NEXT_PUBLIC_LS_VARIANT_PACK_2=222222   # Iniciado    $4.99  - 500 Aura
NEXT_PUBLIC_LS_VARIANT_PACK_3=333333   # Adepto      $19.99 - 2500 Aura
NEXT_PUBLIC_LS_VARIANT_PACK_4=444444   # Maestro     $44.99 - 6500 Aura
NEXT_PUBLIC_LS_VARIANT_PACK_5=555555   # Avatar      $99.99 - 15000 Aura
NEXT_PUBLIC_LS_VARIANT_SUSCRIPCION_PREMIUM=666666  # Amuleto $11.11/mes

# URL de la app
NEXT_PUBLIC_APP_URL=https://sos-evolution.com
```

### 3. Ejecutar migraciones de base de datos

Aplicar los 42 scripts de `supabase/migrations/` en orden desde el dashboard de Supabase o con la CLI de Supabase.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

> El script ya incluye `--max-old-space-size=4096` para evitar saturación de memoria durante la compilación en caliente y el procesamiento de efemérides.

Abre [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts NPM

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con 4 GB de heap (Node.js) |
| `npm run build` | Compilación del bundle de producción |
| `npm run start` | Servidor optimizado de producción |
| `npm run lint` | Validaciones ESLint |

---

## 💎 Módulos Principales

### 🃏 Tarot — El Oráculo
Cuatro modalidades de tirada con generación paralela de cartas:

| Modalidad | Código | Cartas | Coste |
|---|---|---|---|
| Oráculo Diario | `daily` | 1 | 20 Aura |
| Consulta Específica | `general` | 1 | 20 Aura |
| Evolución Temporal | `classic` | 3 (Pasado/Presente/Futuro) | 100 Aura |
| Cruz Guía Evolutiva | `cross` | 5 (Presente/Desafío/Origen/Consejo/Desenlace) | 150 Aura |

Toda respuesta de IA es validada con **Zod** y cuenta con sistema de reintento y fallbacks garantizados.

### 🪐 Astrología — Carta Natal & Horóscopo Diario
- Cálculo local con `astronomy-engine` (0 ms de latencia externa): 10 planetas, nodos lunares Rahu/Ketu (fórmula IAU 1980), Ascendente trigonométrico y matriz de aspectos mayores.
- Interpretación con IA: 20 Aura.
- Horóscopo diario personalizado cruzando tránsitos del día con la carta natal: 10 Aura.

### 🔢 Numerología — Mapa Vibracional
Motor Pitagórico puro en TypeScript: Camino de Vida, Destino/Expresión, Deseo del Alma, Personalidad. Preserva Números Maestros (11, 22, 33). Sin dependencias externas.

### 🎮 Gamificación — Misiones & Rachas
Sistema de misiones evolutivas automáticas (`check_daily_streak` en PL/pgSQL) que recompensa con Aura gratuita y construye el hábito diario del usuario.

### 💰 Economía — Aura de Evolución
Patrón **Ledger inmutable** en PostgreSQL: el saldo es la suma de transacciones auditadas, no un campo mutable. Funciones RPC atómicas `SECURITY DEFINER` previenen race conditions.

---

## 🔐 Reglas de Ingeniería (Resumen)

1. **Zero `any`** — Todo tipado en `src/domain/schemas.ts` o `types/index.ts`.
2. **RLS en todas las tablas** — Sin excepción. `createAdminClient()` solo en webhooks y background tasks.
3. **Ledger en dos fases** — Verificar balance ANTES de llamar a la IA; deducir DESPUÉS del éxito.
4. **IA estructurada siempre** — `response_format: json_object` + validación Zod + fallback garantizado.
5. **Astronomía local** — Nunca añadir APIs externas para efemérides.
6. **i18n de primera clase** — Todas las strings en `messages/es.json` y `messages/en.json`. Nunca hardcoded.
7. **Idempotencia en pagos** — Una `order_id` solo acredita Aura una vez (`ON CONFLICT DO UPDATE`).
8. **`maxDuration = 60`** — En todo Route Handler que llame a un LLM.

> Para el contexto completo de arquitectura, reglas y estado de implementación, ver `.agents/01_SYSTEM_CONTEXT.md` y `.agents/02_TECHNICAL_SPEC.md`.

---

## 🗺️ Rutas de la Aplicación

| Ruta (ES) | Ruta (EN) | Descripción |
|---|---|---|
| `/es/inicio` | `/en/home` | Dashboard principal (bento grid místico) |
| `/es/tarot` | `/en/tarot` | Oráculo interactivo de Tarot |
| `/es/astrologia` | `/en/astrology` | Carta Astral y Horóscopo Diario |
| `/es/numerologia` | `/en/numerology` | Mapa Vibracional Pitagórico |
| `/es/misiones` | `/en/missions` | Panel de Misiones Evolutivas |
| `/es/historial` | `/en/history` | Diario del Alma (historial de tiradas) |
| `/es/comprar` | `/en/purchase` | Tienda Mística de Aura |
| `/admin` | `/admin` | Suite administrativa (solo `is_admin = true`) |

---

## 🧩 Contexto para IA (`.agents/`)

Los archivos en `.agents/` son la fuente de verdad para trabajar con asistentes de IA en este repositorio:

| Archivo | Contenido |
|---|---|
| `01_SYSTEM_CONTEXT.md` | Visión del producto, glosario de dominio, arquitectura, flujos principales, reglas de oro para IA |
| `02_TECHNICAL_SPEC.md` | Stack completo, modelo de datos (42 tablas/migraciones), especificación de API, UI/UX, deployment |
| `03_COMPETITOR_ANALYSIS_TAROTOO.md` | Análisis competitivo de referencia |

---

## 📄 Licencia

Proyecto privado — Todos los derechos reservados.

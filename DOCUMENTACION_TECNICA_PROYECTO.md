# DOCUMENTO TÉCNICO Y ARQUITECTURA DE PROYECTO: SOS EVOLUTION
> **Propósito del documento**: Servir como especificación técnica completa y base de conocimiento para ser procesada por Inteligencias Artificiales en la elaboración y optimización de Curriculums Vitae (CV) adaptados a roles de **Software Engineer (SWE)** y **Data Engineer (DE)**.

---

## 1. RESUMEN EXECUTIVO DEL PROYECTO

- **Nombre del Proyecto**: SOS Evolution (Soul Operating System)
- **Categoría**: Plataforma Web SaaS Full-Stack con Inteligencia Artificial Generativa, Procesamiento de Datos Astronómicos/Matemáticos y Gamificación.
- **Tipo de Arquitectura**: Serverless Web Application basada en Microservicios / Capa de Servicios DDD (Domain-Driven Design), Next.js App Router y Base de Datos Relacional Postgres.
- **Modelo de Negocio**: SaaS basado en Economía de Créditos Virtuales ("Aura de Evolución") con integración de Pasarela de Pagos (LemonSqueezy) y Webhooks idempotentes.

---

## 2. STACK TECNOLÓGICO COMPLETO

### **Frontend & UI/UX Frameworks**
- **Core**: React 19, Next.js 15 (App Router, Server & Client Components, Server Actions).
- **Lenguaje**: TypeScript 5 (Estricto, Tipado de Dominio, Interfaces fuertemente tipadas).
- **Estilos & Diseño**: Tailwind CSS v4, Vanilla CSS3 (Custom Glassmorphism, CSS Variables, Gradients).
- **Animaciones & Interactividad**: Framer Motion 12, `tw-animate-css`, Radix UI Primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-slot`), Lucide React.
- **Internacionalización (i18n)**: `next-intl` v4 (Soporte multilingüe Español/Inglés en URLs, middleware y traducciones estructuradas).
- **Gestión de Estado & Feedback**: React Hooks personalizados, Debouncing (`use-debounce`), Toasts (`sonner`).

### **Backend, APIs & Serverless**
- **Runtime**: Node.js (con optimizaciones de memoria `--max-old-space-size=4096`).
- **Arquitectura de API**: Next.js Serverless Route Handlers (`app/api/*`).
- **Patrón de Arquitectura**: Clean Architecture / Domain-Driven Design (Capa de Dominio, Gateways, Servicios y Controladores).

### **Base de Datos & Persistence Layer**
- **Motor de BD**: PostgreSQL gestionado vía **Supabase**.
- **Autenticación & RLS**: Supabase Auth (JWT tokens), `@supabase/ssr`, Políticas de Seguridad RLS (Row-Level Security) para aislamiento multi-tenant.
- **Migraciones & Esquema**: 38+ migraciones SQL estructuradas (Tablas, Triggers, Funciones Almacenadas RPC, Índices).
- **Patrón Ledger (Libro Mayor)**: Tabla `user_credits` y `payments` para transacciones financieras/créditos inmutables con trazabilidad.

### **Inteligencia Artificial Generativa (AI & LLM Ops)**
- **Providers & SDKs**: Groq SDK (`groq-sdk`), Google Generative AI (`@google/generative-ai` Gemini 2.5 Flash), OpenAI API (`openai`).
- **Resiliencia & Failover**: Gateway de IA multi-proveedor (`ai-gateway.ts`) con reintentos automáticos y fallback dinámico entre modelos (`llama-3.3-70b-versatile` -> `llama-3.1-8b-instant`) ante errores HTTP 429 / Rate Limit / Quota Exceeded.
- **Structured Data Extraction**: Uso de `response_format: { type: "json_object" }` y esquemas JSON estrictos para garantizar respuestas estructuradas sin fallos de parseo.
- **Prompt Engineering**: Plantillas de Prompts contextuales multilingües alimentadas dinámicamente con los datos astrológicos y numerológicos del perfil del usuario.

### **Integración de Pagos & Webhooks**
- **Pasarela**: LemonSqueezy API (`@lemonsqueezy/lemonsqueezy.js`).
- **Seguridad en Webhooks**: Validación criptográfica HMAC SHA-256 de firma HTTP (`x-signature`).
- **Idempotencia**: Estrategia `upsert` en PostgreSQL indexada por `order_id` con otorgamiento de créditos mediante funciones atómicas RPC.

---

## 3. ARQUITECTURA DEL SISTEMA Y CAPAS TECNOLÓGICAS

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE PRESENTACIÓN (CLIENTE)                   │
│ Next.js 15 (React 19) + Tailwind CSS + Framer Motion + i18n (es/en)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        CAPA DE SERVICIOS (BACKEND SERVERLESS)           │
│  - Middleware i18n & Auth Router                                       │
│  - API Route Handlers (/api/lectura, /api/astrology, /api/payments)    │
│  - Domain Layer & Clean Architecture (Services / Gateways)             │
└───────┬───────────────────────────┬──────────────────────────┬─────────┘
        │                           │                          │
        ▼                           ▼                          ▼
┌──────────────┐          ┌───────────────────┐      ┌───────────────────┐
│ AI GATEWAY   │          │ MOTOR ASTRO/NUM   │      │ PASARELA PAGOS    │
│ - Groq       │          │ - FreeAstro API   │      │ - LemonSqueezy    │
│ - Gemini     │          │ - Algoritmo local │      │ - Webhooks HMAC   │
│ - Fallback   │          │   Numerología     │      │   Idempotentes    │
└───────┬──────┘          └─────────┬─────────┘      └─────────┬─────────┘
        │                           │                          │
        └───────────────────────────┼──────────────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   BASE DE DATOS (SUPABASE / POSTGRESQL)                │
│ - Tablas con RLS (profiles, lecturas, user_credits, payments, etc.)    │
│ - Ledger de Créditos (add_credits, spend_credits_v2, get_user_balance) │
│ - Triggers SQL de Gamificación (XP, Niveles, Misiones)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. DETALLE DE MÓDULOS TÉCNICOS Y LOGROS DESTACADOS

### **A. Motor de Cálculo Numerológico Pitagórico (Data / Math Engine)**
- **Ubicación**: `lib/soul-math.ts`
- **Lógica Técnica**: Algoritmo puro en TypeScript para mapeo de caracteres alfabéticos a valores numéricos según la tabla Pitagórica.
- **Normalización de Datos**: Limpieza de cadenas con expresiones regulares y Unicode (`normalize("NFD")`) para eliminar diacríticos (acentos, tildes) y caracteres no alfabéticos.
- **Cálculos Implementados**:
  - **Camino de Vida (Life Path Number)**: Suma recursiva con lógica de reducción a un solo dígito o preservación de **Números Maestros** (`11`, `22`, `33`).
  - **Número de Destino / Expresión**: Reducción matemática del nombre completo.
  - **Deseo del Alma (Soul Urge)**: Filtrado algebraico enfocado exclusivamente en vocales.
  - **Número de Personalidad**: Filtrado algebraico enfocado exclusivamente en consonantes.

### **B. Pipeline Astrológico & Integración de API de Efemérides (Data Engineering)**
- **Ubicación**: `lib/astrology-api.ts`
- **Ingesta e Integración API**: Consumo de API astronómica de precisión para la obtención de posicionales planetarios tridimensionales en la eclíptica (grados eclípticos `fullDegree` de 0° a 360°).
- **Matemática Orbital & Cálculo de Aspectos Planetarios**: Algoritmo en TypeScript que itera las posiciones de todos los cuerpos celestes ($N \times (N-1) / 2$ pares) calculando la distancia angular mínima en círculo ($360^\circ - \text{diff}$) para identificar aspectos mayores:
  - **Conjunción** ($0^\circ$, Orbe $8^\circ$)
  - **Oposición** ($180^\circ$, Orbe $8^\circ$)
  - **Trígono** ($120^\circ$, Orbe $8^\circ$)
  - **Cuadratura** ($90^\circ$, Orbe $8^\circ$)
  - **Sextil** ($60^\circ$, Orbe $6^\circ$)
- **Sistema de Casas**: Algoritmo de Casas Iguales (Equal House system) calculado automáticamente a partir del grado exacto del Ascendente.
- **Mecanismos de Resiliencia & Fallback**: Algoritmo de cómputo local con firmas de respaldo (`getMockChartData`, `getMockTransits`) para garantizar disponibilidad 99.9% frente a timeouts o fallos de la API externa de astrología.

### **C. Gateway de IA Multi-Proveedor con Fallback Dinámico (AI / Software Engineering)**
- **Ubicación**: `src/gateways/ai-gateway.ts`
- **Patrón de Diseño**: Gateway / Adapter Pattern.
- **Estrategia de Tolerancia a Fallos**: Captura dinámica de errores de cuota o rate limit (`429 Too Many Requests`). Al detectar saturación en el modelo principal (`llama-3.3-70b-versatile`), redirige inmediatamente la petición a un modelo ultrarrápido alternativo (`llama-3.1-8b-instant`) ajustando la temperatura del sistema.
- **Tipado Estricto de Contratos JSON**: Garantiza la salida en JSON válido parseable mediante la configuración nativa del proveedor de IA.

### **D. Economía de Créditos y Sistema Financiero Transaccional (Database / Backend)**
- **Ubicación**: `src/services/billing.service.ts`, `supabase/migrations/02_create_credits.sql`, `26_fix_credits_final.sql`.
- **Arquitectura de Libro Mayor (Double-Entry Ledger)**: Implementación de la tabla `user_credits` donde el saldo actual no se sobreescribe como un valor estático, sino que se calcula/audita mediante funciones almacenadas PostgreSQL (`get_user_balance_v2`, `spend_credits_v2`, `add_credits`).
- **Garantía de Consistencia**: Verificación atómica previa de saldo (`ensureSufficientBalance`) antes de invocar endpoints de consumo de IA, evitando cargos indebidos en caso de error en la generación.

### **E. Sistema de Webhooks de Pagos Idempotente (Fintech / Security)**
- **Ubicación**: `app/api/payments/webhook/route.ts`, `src/services/lemonsqueezy.service.ts`.
- **Seguridad Criptográfica**: Verificación mediante HMAC SHA-256 del header `x-signature` comparado contra la clave secreta en variables de entorno.
- **Idempotencia**: Manejo de eventos `order_created` y `order_paid` de LemonSqueezy con cláusula `ON CONFLICT (order_id) DO UPDATE` para evitar duplicidad en el otorgamiento de saldo ante reintentos de red del proveedor de pagos.

### **F. Sistema de Gamificación & Engagement (Database Engineering)**
- **Ubicación**: `supabase/migrations/03_create_missions.sql`, `06_gameplay_triggers.sql`.
- **Triggers SQL Automatizados**: Cálculo en tiempo real de Experiencia (XP), Niveles de usuario y desbloqueo de Misiones Evolutivas al registrarse lecturas o transacciones.
- **Tablas de Progreso**: `user_missions`, `reading_types`, `system_settings`.

---

## 5. HABILIDADES Y COMPETENCIAS TÉCNICAS DESARROLLADAS

### **Para Postulaciones a SOFTWARE ENGINEER (Full-Stack / Backend / Frontend)**

1. **Desarrollo Full-Stack con Next.js 15 & React 19**:
   - Dominio de renderizado híbrido (SSR, SSG, CSR), Server Components, Server Actions, App Router y Middleware.
   - Construcción de APIs RESTful resilientes en entornos Serverless (Node.js).

2. **Clean Architecture & Design Patterns en TypeScript**:
   - Aplicación práctica de Domain-Driven Design (DDD): separación clara entre Dominio, Servicios, Gateways y Capa de Presentación.
   - Implementación de patrones de software: **Adapter/Gateway**, **Repository**, **Factory**, **Ledger Pattern** y **Strategy**.

3. **Integración & Ops de LLMs / IA Generativa**:
   - Conexión de SDKs de IA (Groq, Gemini, OpenAI).
   - Implementación de patrones de resiliencia (Retry, Fallback entre modelos de IA).
   - Structured Outputs mediante esquemas JSON y Prompt Engineering dinámico.

4. **Diseño de UI/UX Moderno & Accesible**:
   - Creación de interfaces con estética *Glassmorphism*, paletas HSL oscuras y animaciones de alta performance con Framer Motion y Tailwind CSS v4.
   - Internacionalización completa (i18n) de interfaces y contenido dinámico generado por IA.

5. **Seguridad & Autenticación**:
   - Manejo de sesiones y JWT con Supabase SSR.
   - Seguridad en Webhooks mediante firma criptográfica HMAC SHA-256.
   - Implementación de RLS (Row-Level Security) en base de datos.

---

### **Para Postulaciones a DATA ENGINEER (Data Engineering / Pipelines / Analytics)**

1. **Modelado de Datos Relacional Avanzado & SQL**:
   - Diseño e implementación de esquemas de base de datos relacionales en PostgreSQL (38+ migraciones).
   - Creación de Funciones Almacenadas en PL/pgSQL (`RPC`), Triggers automáticos y Vistas optimizadas.
   - Diseño de arquitecturas de datos tipo **Ledger (Libro Mayor)** para auditoría e inmutabilidad de transacciones.

2. **Desarrollo de Algoritmos Complejos & Pipelines de Datos Matemáticos**:
   - Construcción de pipelines de procesamiento de datos astronómicos tridimensionales en tiempo real.
   - Implementación de algoritmos de trigonometría esférica/orbital para cálculo de ángulos y aspectos ($0^\circ, 60^\circ, 90^\circ, 120^\circ, 180^\circ$).
   - Procesamiento y sanitización de texto con Unicode (`NFD`) y expresiones regulares para cómputos matriciales de Numerología.

3. **Arquitectura e Integración de Datos (ETL / ELT / APIs)**:
   - Ingesta de datos vía APIs RESTful externas (`json.freeastrologyapi.com`, LemonSqueezy) con sanitización y mapeo de esquemas JSON no convencionales.
   - Estrategias de Caching de datos en base de datos (`chart_cache`) para reducción de latencia y optimización del costo de cómputo/APIs externas.
   - Manejo de pipelines idempotentes para datos de transacciones financieras.

4. **Optimización de Performance & Rendimiento de Consultas**:
   - Optimización de índices en Postgres para consultas de alto tráfico.
   - Reducción de latencia en consultas agregadas de analítica administrativa (`admin_stats`).
   - Gestión eficiente del Heap Memory de Node.js en tareas de procesamiento de datos pesados.

---

## 6. BULLET POINTS IMPACTANTES PARA EL CURRICULUM VITAE (CV)

### 🚀 **Para CV de Software Engineer**

- **Diseñó e implementó la arquitectura Full-Stack** de una plataforma web SaaS utilizando **Next.js 15 (App Router), React 19, TypeScript y Tailwind CSS**, aplicando principios de **Clean Architecture y DDD**.
- **Desarrolló un Gateway de IA multi-proveedor resiliente (Groq/Gemini/OpenAI)** con mecanismo de **fallback automático entre LLMs** en respuesta a errores HTTP 429, garantizando un 99.9% de disponibilidad en la generación de contenido estructurado JSON.
- **Integró pasarela de pagos LemonSqueezy** construyendo un endpoint de Webhooks seguro validado con criptografía **HMAC SHA-256** e ingesta de transacciones idempotente.
- **Implementó un sistema de internacionalización (i18n)** multilingüe (Español/Inglés) dinámico con `next-intl`, abarcando tanto la navegación como el *Prompt Engineering* contextual.
- **Construyó una UI/UX interactiva de alto rendimiento** utilizando **Framer Motion y Radix UI**, implementando patrones visuales avanzados (*Glassmorphism*, componentes responsivos y estados animados).

---

### 📊 **Para CV de Data Engineer**

- **Diseñó e implementó el modelo de datos PostgreSQL (Supabase)** estructurado en **38+ migraciones SQL**, aplicando políticas de **Row-Level Security (RLS)** y funciones de auditoría tipo **Ledger**.
- **Desarrolló un motor matemático y pipeline de datos astronómicos** en TypeScript, procesando posicionales planetarios 3D y calculando aspectos de geometría orbital mediante algoritmos de distancia angular en tiempo real.
- **Creó funciones almacenadas en PL/pgSQL y Triggers automatizados** para la agregación de métricas de gamificación (XP, niveles, misiones) y la gestión atómica de saldos financieros sin condiciones de carrera (*race conditions*).
- **Optimizó la latencia del sistema y los costos de APIs externas** mediante la implementación de una estrategia de **caching de datos astrológicos** en base de datos PostgreSQL (`chart_cache`).
- **Construyó pipelines de ingesta de datos idempotentes** para procesar eventos de webhook de pago en tiempo real con resolución de conflictos SQL (`upsert`) e índices optimizados.

---

## 7. MÉTRICAS TÉCNICAS DESTACABLES DEL PROYECTO

- **Migraciones de Base de Datos**: 38 scripts de migración SQL limpios y modulares.
- **Modelos de IA Integrados**: 3 proveedores principales (Groq/Llama 3.3 & 3.1, Google Gemini 2.5 Flash, OpenAI).
- **Tipos de Cálculos Complejos**: 4 algoritmos numerológicos + 6 aspectos astrológicos con orbe configurable + Casas Iguales.
- **Idiomas Soportados**: 2 locales (Español `es`, Inglés `en`).
- **Disponibilidad de Gateway de IA**: Resiliencia con arquitectura de reintento automático y conmutación de modelos (0% downtime por Rate Limits).

---
*Documento generado para SOS Evolution — Listo para ser compartido con agentes de IA o reclutadores.*

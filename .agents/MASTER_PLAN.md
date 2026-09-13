# Plan Maestro SOS Evolution v2.0: Arquitectura de Escala Global

Este documento redefine la hoja de ruta para **SOS Evolution**, transformándola de un MVP funcional a una plataforma SaaS de clase mundial.
**Objetivo**: Convertirse en el "Headspace de la Espiritualidad", combinando misticismo con tecnología de punta para maximizar el LTV (Lifetime Value) y la retención.

---

## 1. Arquitectura de Software: "Clean Hexagonal Magic"

Actualmente, la lógica de negocio está acoplada a los controladores de Next.js (`/api/*`). Vamos a desacoplarla usando una arquitectura por capas.

### A. Capa de Dominio (Core)
*Objetivo: Lógica de negocio pura, agnóstica del framework.*
- **Entidades Tipadas (\`src/domain\`):**
    - Definir interfaces estrictas con Zod para todo: `TarotReading`, `p_user_id`, `Mission`, `CreditTransaction`.
    - **NO MÁS `any`**. "If it's not typed, it doesn't exist."
- **Servicios (\`src/services\`):**
    - `OracleService`: Orquestador de lecturas. Recibe contexto, selecciona modelo (Llama/Groq/OpenAI), y devuelve JSON validado.
    - `BillingService`: Abstracción sobre créditos y pasarelas de pago. *Single Source of Truth* para el saldo del usuario.
    - `GamificationService`: Motor de misiones, rachas y logros.

### B. Capa de Infraestructura (Adapters)
*Objetivo: Conectar el dominio con el mundo exterior.*
- **Repositorios (\`src/repositories\`):**
    - Abstracción sobre Supabase. `TarotRepository.saveReading()`, `UserRepository.getBalance()`.
    - Permite inyectar mocks para tests unitarios (que hoy no existen).
- **Gateways de IA:**
    - `AiGateway`: Interfaz común para Groq, OpenAI, Claude. Permite fallback automático si un proveedor cae (Error 429).

### C. Base de Datos & Migraciones
- **Estandarización de UUIDs**: Migrar tablas legacy (`lecturas`) de IDs enteros a UUID v4 para consistencia global.
- **Sistema de Créditos v3 (Atomicidad Financiera)**:
    - Uso exclusivo de RPCs (`spend_credits_v3`) con transaccionalidad asegurada.
    - Logs de auditoría inmutables para cada transacción.

---

## 2. Estrategia de Monetización: "The Soul Economy"

### A. Pasarela de Pagos Global (Lemon Squeezy)
- **Implementación**:
    - Webhooks seguros para provisionamiento automático de créditos/suscripciones.
    - Manejo automático de impuestos (VAT/GST) para vender legalmente en Europa/LATAM.
    - Recuperación de carritos abandonados.

### B. "El Amuleto del Alma" (Suscripción Recurrente)
Un modelo SaaS (Software as a Service) para espiritualidad.
- **Tier Gratuito (El Iniciado)**:
    - Carta diaria básica.
    - 1 Misión diaria.
- **Tier Premium (El Alquimista - $11.11/mo)**:
    - **IA con Memoria**: El oráculo recuerda tus sesiones de la semana pasada ("Como vimos en tu lectura de amor del martes...").
    - **Tiradas Ilimitadas**: Acceso libre a tiradas de 1 carta.
    - **Cosméticos**: Dorsos de cartas exclusivos y temas de UI.
    - **Reporte Astral Semanal**: PDF generado automáticamente con tránsitos personales.

---

## 3. Experiencia de Usuario (UX): "Digital Rituals"

### A. Onboarding Ritualístico
El registro no es un formulario; es un ritual de nacimiento.
- **Animaciones**: Usar Framer Motion para que cada input (Nombre, Fecha) genere una respuesta visual (constelaciones que se unen).
- **Personalización Inmediata**: Al terminar el registro, el sistema ya debe saludar al usuario por su Ascendente o Signo Solar.

### B. Gamificación (Hook Model)
- **Trigger**: Notificación push "La Luna entró en Escorpio, descubre qué significa para ti".
- **Action**: Abrir la app y reclamar la recompensa diaria.
- **Variable Reward**: Créditos gratis (RNG) o una frase inspiradora única.
- **Investment**: El usuario completa una misión ("Meditar 5 min") y sube su nivel de "Consciencia".

---

## 4. Roadmap de Ejecución (Q1 - Q2 2026)

### Fase 1: Refactor & Estabilidad (Semanas 1-2)
- [ ] Implementar `BillingService` y migrar a Créditos v3.
- [ ] Crear `OracleService` con sistema de retries y validación Zod.
- [ ] Estandarizar respuestas de API (Envelope Pattern: `{ data, error, meta }`).

### Fase 2: Monetización & Conversión (Semanas 3-4)
- [ ] Integrar checkout de Lemon Squeezy.
- [ ] Implementar Webhooks de Supabase para activar compras.
- [ ] UI de "Tienda Mística" (diseño premium).

### Fase 3: Engagement & IA Avanzada (Mes 2)
- [ ] Implementar "Memoria Contextual" en el `OracleService` (RAG simple con Vectores).
- [ ] Lanzar "Misiones de Temporada" (ej: Temporada de Eclipses).

### Fase 4: Escala y Calidad (Mes 3)
- [ ] Tests E2E con Playwright (Critical Paths: Registro, Lectura, Compra).
- [ ] Caché de borde (Edge Caching) para horóscopos diarios.

---

**Filosofía**: Código limpio, UI hipnótica, Negocio sólido.

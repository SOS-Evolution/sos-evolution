# SYSTEM_CONTEXT: SOS Evolution

Este documento sirve como referencia rápida para desarrolladores e Inteligencias Artificiales sobre la arquitectura, el propósito y el estado del sistema SOS Evolution.

## 1. Visión General
**SOS Evolution (Soul Operating System)** es una plataforma de bienestar espiritual que integra IA Generativa con simbología ancestral (Tarot, Numerología, Astrología) para guiar el autodescubrimiento humano.

## 2. Tecnologías Principales (Stack)
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Framer Motion.
- **Backend/API**: Next.js Serverless Functions, Node.js.
- **Base de Datos**: Supabase (PostgreSQL) con RLS (Row Level Security).
- **IA**: Google Gemini 2.5 Flash (Integración vía schema JSON).
- **Lógica Específica**: Numerología Pitagórica y APIs de Astrología.

## 3. Arquitectura y Módulos

### A. Módulo de Identidad
- **Archivos Clave**: `lib/soul-math.ts`, `components/dashboard/UserProfile.tsx`.
- **Función**: Calcula datos basados en nombre y fecha de nacimiento (Camino de Vida, Signos, etc.).

### B. Oráculo de IA (Tarot)
- **Ruta API**: `app/api/lectura/route.ts`.
- **Componentes**: `app/lectura/page.tsx`, `components/features/tarot/`.
- **Lógica**: Utiliza Gemini para interpretar una carta elegida por el usuario basándose en su pregunta o contexto actual.

### C. Economía de Créditos
- **Tablas**: `user_credits` (Patrón Ledger/Libro mayor).
- **Funciones SQL**: `get_user_balance`, `spend_credits`, `add_credits`.
- **Propósito**: Controlar el uso de Aura de Evolución (recursos de IA).

### D. Sistema Administrativo
- **Portal**: `/admin`.
- **Funcionalidades**: Estadísticas globales, lista de usuarios, historial de lecturas y transacciones.

## 4. Guía para Inteligencias Artificiales (AI-Assistant Context)
Cuando trabajes en este proyecto, sigue estas reglas:
1. **Diseño Premium**: El CSS debe usar gradientes profundos, efectos vítreos (glassmorphism) y animaciones fluidas (Framer Motion).
2. **Seguridad**: Siempre verifica que las consultas a la DB respeten el RLS y pasen por el cliente de Supabase autenticado.
3. **Escritura Estricta**: Usa TypeScript con interfaces claras (`types/index.ts` o archivos locales específicos).
4. **Respuesta en JSON**: Las APIs que consumen IA deben usar esquemas de respuesta estructurados para evitar errores de parseo.

## 5. Próximos Pasos y Roadmap (Documentar aquí nuevos desarrollos)
- [x] Implementación de Admin Dashboard.
- [x] Historial de Lecturas.
- [ ] Implementación de nuevas "Misiones Evolutivas".
- [ ] Conexión profunda con API de Cartas Natales avanzadas.
- [ ] Sistema de compras de Aura de Evolución y Amuleto del Alma (Webhooks).

---
*Última actualización: 26 de Enero, 2026*

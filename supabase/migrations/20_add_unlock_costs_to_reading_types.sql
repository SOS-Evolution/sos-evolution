-- =============================================
-- 20: ADD UNLOCK COSTS TO READING TYPES
-- =============================================

-- Add special reading types for one-time feature unlocks
-- This allows managing their AURA cost from the admin panel

INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order)
VALUES 
    ('unlock_astrology', 'Desbloqueo de Astrología', 'Costo único para desbloquear la sección de Astrología', 50, '🪐', 100),
    ('unlock_numerology', 'Desbloqueo de Numerología', 'Costo único para desbloquear la sección de Numerología', 50, '🔢', 101),
    ('numerology_full', 'Análisis Numerológico Completo', 'Interpretación profunda de tu misión y números maestros', 20, '✨', 20)
ON CONFLICT (code) DO UPDATE 
SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    credit_cost = EXCLUDED.credit_cost;

-- Ensure RLS allows admin to update these
-- Assuming there's already an admin policy or we need to add it if it's missing for reading_types
-- Migration 04 added SELECT policy for everyone. Let's add admin policies.

CREATE POLICY "Admins can manage reading types"
    ON public.reading_types FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

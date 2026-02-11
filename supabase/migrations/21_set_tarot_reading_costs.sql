-- =============================================
-- 21: SET TAROT READING COSTS
-- =============================================

-- Update costs for Tarot reading types
-- 'general' covers both 'Oracle' and 'Question' modes in the current UI
-- 'classic' covers the 3-card temporal evolution

UPDATE public.reading_types
SET credit_cost = 20
WHERE code = 'general';

UPDATE public.reading_types
SET credit_cost = 100
WHERE code = 'classic';

-- Ensure they are active and have icons
UPDATE public.reading_types
SET is_active = TRUE,
    icon = CASE 
        WHEN code = 'general' THEN '🔮'
        WHEN code = 'classic' THEN '⏳'
        ELSE icon
    END
WHERE code IN ('general', 'classic');

-- Verify or Insert if they don't exist (safety)
INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order)
VALUES 
    ('general', 'Consulta General', 'Respuesta a cualquier pregunta o mensaje del espejo', 20, '🔮', 2),
    ('classic', 'Evolución Temporal', 'Tirada de 3 cartas: Pasado, Presente y Futuro', 100, '⏳', 3)
ON CONFLICT (code) DO UPDATE SET
    credit_cost = EXCLUDED.credit_cost;

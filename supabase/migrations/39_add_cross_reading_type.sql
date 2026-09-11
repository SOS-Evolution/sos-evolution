-- =================================================================
-- 39: ADD CROSS (5 CARDS) READING TYPE
-- =================================================================

INSERT INTO public.reading_types (code, name, description, credit_cost, icon, sort_order, is_active)
VALUES 
    ('cross', 'Cruz Guía Evolutiva', 'Tirada de 5 cartas: Presente, Desafío, Origen, Consejo y Desenlace', 150, '✨', 4, TRUE)
ON CONFLICT (code) DO UPDATE SET
    credit_cost = EXCLUDED.credit_cost,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_active = TRUE;

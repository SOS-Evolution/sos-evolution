-- Set cost and details for 'daily' reading type (Oráculo Diario)
UPDATE public.reading_types
SET 
    name = 'Oráculo Diario',
    description = 'Tu mensaje del universo para hoy',
    credit_cost = 20,
    icon = '☀️',
    is_active = TRUE
WHERE code = 'daily';

-- Ensure 'general' is still active if needed, or deactivate if replaced. 
-- For now, we keep it but the UI will switch to use 'daily' for the first card.

-- =============================================
-- 05: MIGRATE EXISTING DATA
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- IMPORTANTE: Ejecutar DESPUÉS de los scripts 01-04
-- =============================================

-- Migrar usuarios existentes a profiles
-- Solo inserta si no existe ya el perfil
INSERT INTO public.profiles (id, full_name, birth_date, birth_place)
SELECT 
    u.id,
    COALESCE(u.raw_user_meta_data->>'full_name', ''),
    CASE 
        WHEN u.raw_user_meta_data->>'birth_date' ~ '^\d{4}-\d{2}-\d{2}$' 
        THEN (u.raw_user_meta_data->>'birth_date')::DATE
        ELSE NULL
    END,
    COALESCE(u.raw_user_meta_data->>'birth_place', '')
FROM auth.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- Calcular life_path_number y zodiac_sign para perfiles existentes
-- (Esto se hará desde la aplicación para usar la lógica de JS existente)

-- Actualizar FK de lecturas existentes
UPDATE public.lecturas l
SET reading_type_id = rt.id
FROM public.reading_types rt
WHERE rt.code = 'general'
AND l.reading_type_id IS NULL;

-- Verificar migración
DO $$
DECLARE
    profile_count INTEGER;
    user_count INTEGER;
    lectura_count INTEGER;
    lectura_with_type INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    SELECT COUNT(*) INTO user_count FROM auth.users;
    SELECT COUNT(*) INTO lectura_count FROM public.lecturas;
    SELECT COUNT(*) INTO lectura_with_type FROM public.lecturas WHERE reading_type_id IS NOT NULL;
    
    RAISE NOTICE '=== MIGRACIÓN COMPLETADA ===';
    RAISE NOTICE 'Usuarios en auth.users: %', user_count;
    RAISE NOTICE 'Perfiles creados: %', profile_count;
    RAISE NOTICE 'Lecturas totales: %', lectura_count;
    RAISE NOTICE 'Lecturas con tipo asignado: %', lectura_with_type;
    RAISE NOTICE '============================';
END $$;

-- Dar créditos de bienvenida a usuarios existentes que no los tienen
INSERT INTO public.user_credits (user_id, amount, source, description)
SELECT p.id, 50, 'bonus', 'Créditos de bienvenida (migración)'
FROM public.profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_credits c 
    WHERE c.user_id = p.id AND c.source = 'bonus' AND c.description LIKE '%bienvenida%'
);

-- Inicializar misiones para usuarios existentes que no las tienen
INSERT INTO public.user_missions (user_id, mission_id, progress, target)
SELECT p.id, m.id, 0, 
    CASE 
        WHEN m.code = 'five_readings' THEN 5
        WHEN m.code = 'daily_streak_3' THEN 3
        ELSE 1
    END
FROM public.profiles p
CROSS JOIN public.missions m
WHERE m.is_active = TRUE
AND NOT EXISTS (
    SELECT 1 FROM public.user_missions um 
    WHERE um.user_id = p.id AND um.mission_id = m.id
);

-- Actualizar progreso de misiones basado en datos existentes
-- Misión: first_reading (si tiene al menos 1 lectura)
UPDATE public.user_missions um
SET progress = 1, completed = TRUE, completed_at = NOW()
FROM public.missions m
WHERE um.mission_id = m.id
AND m.code = 'first_reading'
AND um.completed = FALSE
AND EXISTS (
    SELECT 1 FROM public.lecturas l WHERE l.user_id = um.user_id
);

-- Misión: five_readings (contar lecturas existentes)
UPDATE public.user_missions um
SET progress = LEAST(sub.count, 5),
    completed = (sub.count >= 5),
    completed_at = CASE WHEN sub.count >= 5 THEN NOW() ELSE NULL END
FROM (
    SELECT user_id, COUNT(*)::INTEGER as count
    FROM public.lecturas
    GROUP BY user_id
) sub, public.missions m
WHERE um.user_id = sub.user_id
AND um.mission_id = m.id
AND m.code = 'five_readings';

-- Misión: complete_profile (si tiene todos los datos)
UPDATE public.user_missions um
SET progress = 1, completed = TRUE, completed_at = NOW()
FROM public.profiles p, public.missions m
WHERE um.user_id = p.id
AND um.mission_id = m.id
AND m.code = 'complete_profile'
AND um.completed = FALSE
AND p.full_name IS NOT NULL AND p.full_name != ''
AND p.birth_date IS NOT NULL
AND p.birth_place IS NOT NULL AND p.birth_place != '';

-- Dar recompensas por misiones ya completadas (retroactivo)
INSERT INTO public.user_credits (user_id, amount, source, description, reference_id)
SELECT um.user_id, m.reward_credits, 'mission', 'Misión completada: ' || m.title, m.id
FROM public.user_missions um
JOIN public.missions m ON um.mission_id = m.id
WHERE um.completed = TRUE
AND NOT EXISTS (
    SELECT 1 FROM public.user_credits c
    WHERE c.user_id = um.user_id 
    AND c.source = 'mission' 
    AND c.reference_id = m.id
);

DO $$ BEGIN
    RAISE NOTICE 'Migración de datos completada exitosamente.';
END $$;

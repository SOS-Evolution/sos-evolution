-- =============================================
-- 06: GAMEPLAY TRIGGERS
-- =============================================
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Función para manejar progreso de misiones de lectura
CREATE OR REPLACE FUNCTION public.handle_reading_mission_progress()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_total_readings INTEGER;
BEGIN
    v_user_id := NEW.user_id;
    
    -- Contar lecturas totales del usuario
    SELECT COUNT(*) INTO v_total_readings FROM public.lecturas WHERE user_id = v_user_id;

    -- 1. Misión: first_reading
    IF v_total_readings >= 1 THEN
        PERFORM public.complete_mission(v_user_id, 'first_reading');
    END IF;

    -- 2. Misión: five_readings
    IF v_total_readings >= 5 THEN
        PERFORM public.complete_mission(v_user_id, 'five_readings');
    ELSE
        -- Actualizar progreso si no está completa
        UPDATE public.user_missions um
        SET progress = v_total_readings
        FROM public.missions m
        WHERE um.mission_id = m.id 
        AND m.code = 'five_readings'
        AND um.user_id = v_user_id
        AND um.completed = FALSE;
    END IF;

    -- 3. Misión: explore_love (Si el tipo es 'love')
    IF NEW.reading_type_id IS NOT NULL THEN
        DECLARE
            v_type_code TEXT;
        BEGIN
            SELECT code INTO v_type_code FROM public.reading_types WHERE id = NEW.reading_type_id;
            
            IF v_type_code = 'love' THEN
                PERFORM public.complete_mission(v_user_id, 'explore_love');
            END IF;
            
            IF v_type_code = 'career' THEN
                PERFORM public.complete_mission(v_user_id, 'explore_career');
            END IF;
        END;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger al crear lectura
DROP TRIGGER IF EXISTS on_lectura_created_missions ON public.lecturas;
CREATE TRIGGER on_lectura_created_missions
    AFTER INSERT ON public.lecturas
    FOR EACH ROW EXECUTE FUNCTION public.handle_reading_mission_progress();

-- Comentarios
COMMENT ON FUNCTION public.handle_reading_mission_progress IS 'Actualiza automáticamente el progreso de las misiones relacionadas con lecturas';

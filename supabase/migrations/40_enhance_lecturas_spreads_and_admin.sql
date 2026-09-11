-- =================================================================
-- 40: ENHANCE LECTURAS WITH SPREAD_ID AND AGGREGATED ADMIN RPC
-- =================================================================

-- 1. Asegurar columnas spread_id y card_order en public.lecturas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'spread_id'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN spread_id UUID DEFAULT gen_random_uuid();
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'card_order'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN card_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- 2. Asignar spread_id único a lecturas anteriores que lo tengan nulo
UPDATE public.lecturas 
SET spread_id = gen_random_uuid() 
WHERE spread_id IS NULL;

-- 3. Índices para acelerar consultas agrupadas por tirada y usuario
CREATE INDEX IF NOT EXISTS idx_lecturas_spread_id ON public.lecturas(spread_id);
CREATE INDEX IF NOT EXISTS idx_lecturas_user_spread ON public.lecturas(user_id, spread_id);
CREATE INDEX IF NOT EXISTS idx_lecturas_user_created ON public.lecturas(user_id, created_at DESC);

-- 4. Actualizar función RPC para el panel de administración
DROP FUNCTION IF EXISTS public.get_readings_list_admin(INTEGER);

CREATE OR REPLACE FUNCTION public.get_readings_list_admin(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
    spread_id UUID,
    reading_type_name TEXT,
    reading_type_code TEXT,
    question TEXT,
    created_at TIMESTAMPTZ,
    full_name TEXT,
    email TEXT,
    cards_count BIGINT,
    cards_summary TEXT,
    cards_detail JSONB
) AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    WITH spread_cards AS (
        SELECT 
            l.spread_id,
            l.user_id,
            l.reading_type_id,
            l.question,
            MAX(l.created_at) as created_at,
            COUNT(*) as cards_count,
            string_agg(
                CASE 
                    WHEN l.position IS NOT NULL AND l.position <> '' THEN l.position || ': ' || l.card_name
                    ELSE l.card_name
                END, 
                ' → ' ORDER BY l.card_order ASC, l.id ASC
            ) as cards_summary,
            jsonb_agg(
                jsonb_build_object(
                    'id', l.id,
                    'card_name', l.card_name,
                    'position', l.position,
                    'card_order', l.card_order,
                    'keywords', l.keywords,
                    'description', l.description,
                    'action', l.action
                ) ORDER BY l.card_order ASC, l.id ASC
            ) as cards_detail
        FROM public.lecturas l
        GROUP BY l.spread_id, l.user_id, l.reading_type_id, l.question
    )
    SELECT 
        sc.spread_id,
        COALESCE(rt.name, 'Consulta General')::TEXT as reading_type_name,
        COALESCE(rt.code, 'general')::TEXT as reading_type_code,
        sc.question::TEXT,
        sc.created_at::TIMESTAMPTZ,
        COALESCE(p.full_name, 'Místico')::TEXT as full_name,
        u.email::TEXT,
        sc.cards_count,
        sc.cards_summary::TEXT,
        sc.cards_detail
    FROM spread_cards sc
    JOIN public.profiles p ON sc.user_id = p.id
    JOIN auth.users u ON p.id = u.id
    LEFT JOIN public.reading_types rt ON sc.reading_type_id = rt.id
    ORDER BY sc.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_readings_list_admin(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_readings_list_admin(INTEGER) TO service_role;

COMMENT ON FUNCTION public.get_readings_list_admin IS 'Returns readings grouped by spread_id for clean admin representation';

-- =============================================
-- 23: FIX LECTURAS COLUMNS AND RLS
-- =============================================

-- 1. Asegurar que las columnas necesarias existan en public.lecturas
DO $$ 
BEGIN
    -- Column keywords (Array de strings)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'keywords'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN keywords TEXT[];
    END IF;

    -- Column description (Texto largo para la interpretación)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'description'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN description TEXT;
    END IF;

    -- Column action (Texto para el ritual/acción sugerida)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'lecturas' 
        AND column_name = 'action'
    ) THEN
        ALTER TABLE public.lecturas ADD COLUMN action TEXT;
    END IF;
END $$;

-- 2. Asegurar que el RLS permita a los usuarios insertar sus propias lecturas
-- (Muchas veces falla el cobro porque el insert inicial falla por permisos)
DROP POLICY IF EXISTS "Users can insert own readings" ON public.lecturas;
CREATE POLICY "Users can insert own readings"
    ON public.lecturas FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own readings" ON public.lecturas;
CREATE POLICY "Users can view own readings"
    ON public.lecturas FOR SELECT
    USING (auth.uid() = user_id);

-- 3. Comentarios para documentación
COMMENT ON COLUMN public.lecturas.keywords IS 'Palabras clave asociadas a la carta y lectura';
COMMENT ON COLUMN public.lecturas.description IS 'Interpretación mística generada por la IA';
COMMENT ON COLUMN public.lecturas.action IS 'Acción o ritual sugerido para el usuario';

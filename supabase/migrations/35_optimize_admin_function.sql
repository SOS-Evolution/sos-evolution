-- =============================================
-- 35: OPTIMIZE ADMIN FUNCTION
-- =============================================

-- Modificamos la función is_admin() agregándole la instrucción STABLE.
-- Anteriormente era VOLATILE por defecto de Postgres, lo que causaba que
-- al usarla en la política "Admins can view all profiles", Postgres 
-- ejecutara un "SELECT 1 FROM public.profiles" POR CADA FILA en la base de datos,
-- tardando múltiples segundos e incrementando drásticamente el uso de CPU.
-- Al hacerla STABLE, Postgres la evalúa una sola vez por consulta.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

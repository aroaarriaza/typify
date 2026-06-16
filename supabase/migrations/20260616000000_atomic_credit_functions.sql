-- Función atómica para descontar 1 crédito.
-- Hace el check y el UPDATE en una sola operación, eliminando la race condition TOCTOU.
-- Devuelve TRUE si se descontó el crédito, FALSE si no había suficientes.
CREATE OR REPLACE FUNCTION deduct_credit(uid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rows_affected int;
BEGIN
  UPDATE profiles
  SET credits = credits - 1
  WHERE id = uid AND credits > 0;

  GET DIAGNOSTICS rows_affected = ROW_COUNT;
  RETURN rows_affected > 0;
END;
$$;

-- Función atómica para devolver 1 crédito (usada cuando falla la generación).
-- Incremento directo sin leer primero, evitando race condition en el refund.
CREATE OR REPLACE FUNCTION refund_credit(uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET credits = credits + 1
  WHERE id = uid;
END;
$$;

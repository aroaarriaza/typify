-- Tabla para guardar IDs de eventos Stripe ya procesados.
-- Evita que un evento reenviado por Stripe se procese dos veces.
CREATE TABLE IF NOT EXISTS stripe_events (
  id         text        PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

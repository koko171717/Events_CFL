-- CFL CONTROL V46: exécuter UNE fois dans Supabase SQL Editor (projet déjà installé)
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS box_closed boolean NOT NULL DEFAULT false;

-- Les événements existants restent ouverts par défaut.
-- Les règles RLS déjà en place pour events s'appliquent aussi à ce champ.

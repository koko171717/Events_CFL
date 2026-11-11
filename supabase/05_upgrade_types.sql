-- CFL Control V25 : autoriser les affiches et slides Bienvenue.
-- Conserve toutes les slides et toutes les politiques RLS existantes.
BEGIN;
ALTER TABLE public.tv_slides DROP CONSTRAINT IF EXISTS tv_slides_slide_type_check;
ALTER TABLE public.tv_slides ADD CONSTRAINT tv_slides_slide_type_check
  CHECK (slide_type IN ('event','month','btwb','custom','spotlight','welcome'));
COMMIT;

-- Vérifier la contrainte :
SELECT conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid='public.tv_slides'::regclass AND conname='tv_slides_slide_type_check';

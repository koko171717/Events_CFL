-- CFL Control V22 — Nouveau type de slide, données conservées dans tv_slides.settings JSONB.
-- À exécuter UNE FOIS dans Supabase SQL Editor avant le déploiement de la V22.
-- Conserve les événements, playlists, RLS et bucket cfl-events existants.
BEGIN;
ALTER TABLE public.tv_slides DROP CONSTRAINT IF EXISTS tv_slides_slide_type_check;
ALTER TABLE public.tv_slides ADD CONSTRAINT tv_slides_slide_type_check
 CHECK (slide_type IN ('event','month','btwb','custom','spotlight'));
COMMIT;

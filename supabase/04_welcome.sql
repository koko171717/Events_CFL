-- CFL Control V23 : permettre les slides Bienvenue sans toucher aux données existantes.
BEGIN;
ALTER TABLE public.tv_slides DROP CONSTRAINT IF EXISTS tv_slides_slide_type_check;
ALTER TABLE public.tv_slides ADD CONSTRAINT tv_slides_slide_type_check
 CHECK (slide_type IN ('event','month','btwb','custom','spotlight','welcome'));
COMMIT;

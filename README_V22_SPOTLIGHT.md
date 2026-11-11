# CFL Control V22 — Affiche / Spotlight CFL

## Installation (projet V21 existant)

1. **Sauvegarder** le dépôt GitHub actuel / vérifier que les données Supabase sont présentes.
2. Supabase → SQL Editor → exécuter `supabase/03_spotlight.sql` **une fois**. Le script modifie uniquement la contrainte `slide_type`.
3. Charger les fichiers de ce dossier dans le dépôt GitHub existant à la racine; laisser Vercel redéployer.
4. CFL Control → CFL TV → + Ajouter une slide → **Affiche / Spotlight**.
5. Choisir **Portrait membre** ou **Performance sportive**, renseigner la fiche et importer la photo (JPG/PNG/WebP, max 10 Mo). Cliquer **Enregistrer** puis **Publier la playlist**.
6. Ouvrir `/diaporama.html` sur un second appareil pour vérifier l'image et la mise à jour automatique.

## Fonctionnement

- Les affiches sont des slides de la playlist existante (`tv_slides`), avec les champs stockés dans `settings` JSONB.
- Les photos sont uploadées par l'Admin dans le bucket existant `cfl-events` (préfixe `spotlights/`). URLs publiques pour lecture sur TV.
- Les dates de diffusion sont facultatives. Les slides Spotlight ne sont diffusées que pendant la plage choisie (fuseau Europe/Zurich), sans republier chaque jour.
- Les modifications et suppressions se font dans CFL TV, avec publication explicite.
- Le logo CrossFit Léman est conservé et la présentation est adaptée au format 16:9.
- L'agenda et BTWB ne sont pas modifiés.

## Points à contrôler

- Le rendu réel sur télévision et les textes longs ; limiter les descriptions pour préserver la lisibilité.
- Les photos de personnes requièrent leur accord pour la diffusion dans la box. Le bucket utilise une URL publique ; ne pas y placer d'images confidentielles.
- Le code a été vérifié statiquement ; les tests E2E avec ton projet Supabase/Vercel restent nécessaires.

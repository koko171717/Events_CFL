# CFL Control V23 — Slide Bienvenue éditable

1. Supabase SQL Editor : exécuter **supabase/04_welcome.sql** (après 03_spotlight.sql de V22).
2. Remplacer le code GitHub par ce pack complet ; Vercel redéploie.
3. CFL Control → CFL TV → + Ajouter une slide → **Bienvenue CFL**.
4. Modifier titre, sous-titre, badge, adresse web, photo, cadrage et voile sombre.
5. **Enregistrer**, puis **Publier la playlist**. La TV récupère les changements automatiquement.

La photo de groupe originale `_JOV1367.jpg` est reprise comme fond par défaut dans `assets/welcome-group.jpg`. Les nouvelles photos sont stockées dans Supabase Storage (bucket `cfl-events`) via les mêmes règles que les photos Spotlight. Le logo SVG officiel utilisé dans le projet est `assets/logo-crossfit-leman.svg` ; il reste indépendant de la photo et du texte.

Le nom de marque affiché dans la nouvelle slide est **CrossFit Leman**, sans accents, conformément à la demande.

Pas de nouvelle table SQL. Les autres types de slides, l'agenda, BTWB et la playlist existante ne sont pas modifiés.

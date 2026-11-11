# CFL Control V24 — Ajouter une slide éditée

## Correctif
- Le bouton **+ Ajouter une slide** en haut prépare maintenant un formulaire vierge sans insérer de slide par défaut.
- Le bouton **＋ Ajouter** en bas crée une nouvelle slide à partir du **type, contenu, durée, réglages et photo actuellement visibles** dans l’éditeur.
- Les photos en attente sont envoyées dans Supabase Storage avant l’enregistrement de la nouvelle slide.
- La slide créée est automatiquement sélectionnée dans la playlist et les vignettes du bas.
- **Enregistrer** continue à modifier la slide sélectionnée, sans créer de doublon.
- La publication TV reste manuelle via **Publier la playlist**.

## Déploiement
Remplacer les fichiers du dépôt GitHub avec ceux de ce pack. Aucun SQL nouveau, configuration Supabase conservée. Le changement fonctionnel porte uniquement sur tv.html.

## Tests recommandés
1. Cliquer + Ajouter une slide, choisir Bienvenue CFL, changer titre et photo, puis ＋ Ajouter : la slide créée doit reprendre exactement les champs affichés.
2. Sélectionner une slide existante, la personnaliser, cliquer ＋ Ajouter : une **nouvelle** slide doit être ajoutée, l’ancienne reste intacte.
3. Modifier la nouvelle slide et cliquer Enregistrer : aucune slide supplémentaire ne doit apparaître.
4. Publier et contrôler le diaporama public.

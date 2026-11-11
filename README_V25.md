# CFL Control V25 — Slides personnalisées et ordre de la playlist

## Installation
1. Supabase → SQL Editor : exécuter `supabase/05_upgrade_types.sql`, même si 03/04 ont déjà été exécutés. Il est réexécutable sans supprimer de données.
2. Publier tous les fichiers du ZIP à la racine du dépôt GitHub, en conservant `assets/`, `api/`, `supabase/`.
3. Attendre le déploiement Vercel ; actualiser CFL TV avec Ctrl+F5.

## Fonctionnement
- Bouton du haut « + Ajouter une slide » : ouvre un formulaire vierge.
- Choisir « Affiche / Spotlight » ou « Bienvenue CFL », remplir les champs, choisir une photo si nécessaire.
- Dans « Position dans la playlist », saisir **1** pour mettre en premier, **2** pour mettre en deuxième, etc.
- Cliquer **« ＋ Ajouter cette slide »** : une nouvelle slide avec les valeurs saisies est créée dans Supabase et placée à cette position.
- Pour changer la position d'une slide existante : la sélectionner, modifier la valeur puis cliquer sur **Enregistrer**.
- « Publier la playlist » envoie les modifications au diaporama public.

## Correctifs
- Règle SQL des types de slide renforcée.
- Une affiche libre n'a plus besoin de nom de personne ; le titre suffit.
- Le champ Position est déverrouillé, **numéroté de 1 à N** et utilisable pour l'ajout comme pour l'enregistrement.
- Insertion à la fin, puis repositionnement global pour préserver les données des autres slides.
- Les erreurs de contrainte SQL renvoient une explication utile.

## Tests après déploiement
1. Ajouter « Bienvenue CFL » avec position 1 et photo personnelle ; contrôler sa présence dans la playlist.
2. Ajouter « Affiche / Spotlight » avec position 2 ; contrôler sa présence et ses textes.
3. Déplacer une slide existante à la position 1 et sauvegarder.
4. Publier ; ouvrir `diaporama.html` dans une fenêtre privée et vérifier les nouvelles slides.

**Attention** : les tests de lecture/écriture sur le Supabase réel doivent être faits sur ton déploiement.

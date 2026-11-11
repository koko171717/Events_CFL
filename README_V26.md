# CFL Control V26 — Bienvenue et Affiche libre

- **Bienvenue CFL** : bouton d’accès direct visible au-dessus de l’éditeur, en plus du bouton dans les types de slides. Cliquer prépare un brouillon éditable, puis « + Ajouter cette slide » l’enregistre dans Supabase.
- **Affiche / Spotlight** : tous les textes sont facultatifs. Plus de titre requis ; plus de remplissage automatique « Membre du mois » ni « Nouveau portrait ».
- **Photo seule** : case à cocher pour diffuser une photo pleine scène, sans titre, signature, nom, en-tête ni autres textes. Format 16:9, photo entière (contain).
- Les données existantes, l’agenda, les modules BTWB et la lecture publique sont conservés.
- **Aucun nouveau SQL** : conserver les scripts 03, 04 et 05 déjà appliqués. Si Supabase refuse encore le type Spotlight ou Bienvenue, exécuter `supabase/05_upgrade_types.sql`.
- Décompresser et remplacer les fichiers à la racine du dépôt GitHub puis vérifier sur Vercel avec un rechargement forcé.
- Tester une nouvelle photo Spotlight (mode Photo seule), une Bienvenue CFL, l’ajout, puis « Publier la playlist ».

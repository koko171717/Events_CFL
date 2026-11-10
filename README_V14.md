# CFL Control V14 — Brouillons, vacances vaudoises et titres BTWB

## Correctifs
- Brouillons enregistrés : visibles directement dans la synthèse annuelle Admin, y compris ceux qui partagent une date avec d’autres événements.
- Bandeau Admin indiquant le nombre de brouillons par année ; cliquer sur une année pour les afficher.
- Vacances scolaires officielles 2026 ajoutées (source : Canton de Vaud), en plus de 2027–2031.
- Vacances et jours fériés : signalés dans les mois de synthèse, colorés dans la grille, et repères consultables dans l’Admin.
- En-tête BTWB : nom de programmation affiché une seule fois ; sous-en-tête réduit à WOD · VARIANTES ou TRAIN.

## Déploiement
Remplacer les fichiers du dépôt GitHub par le contenu du ZIP et laisser Vercel redéployer. Aucun SQL à lancer. Les données Supabase ne sont pas réinitialisées.

## Tests indispensables
1. Ouvrir /admin.html, cliquer sur l’année du brouillon dans la nouvelle bande d’état : il doit apparaître dans le mois correspondant.
2. En 2026 : février, avril, juillet et octobre ont des repères vacances.
3. Ouvrir /agenda.html en visiteur : aucun brouillon ne doit être visible.
4. Ouvrir CFL TV et /diaporama.html : le nom de programmation BTWB n’est plus répété dans la barre du widget.

Si le compteur indique zéro alors que des brouillons devraient exister, vérifier la présence des lignes dans la table Supabase `public.events` : un défaut de visibilité SQL/RLS ou des données supprimées ne peuvent pas être réparés par une correction d’interface.

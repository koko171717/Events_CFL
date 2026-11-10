# CFL Control V12 — Cohérence publication et Administration

- L’agenda public ne montre que les lignes Supabase dont `status=published`. Pendant son chargement, la grille ne doit pas afficher de contenu intermédiaire. Si Supabase ne répond pas, le calendrier reste vide plutôt que d’utiliser une copie locale d’événements.
- Les brouillons et événements archivés restent accessibles uniquement dans l’Admin (leurs affichages dépendent des filtres de catégories).
- Formulaire admin avec boutons pour Public concerné, Tarif et Publication.
- Banque d'images pour réutiliser les images déjà associées à un événement ou présentes dans Storage.
- Suppression des commandes d’édition redondantes de l’ancien calendrier dans l’Admin. Les vues historiques restent.

## Installation
Remplacer les fichiers sur le dépôt GitHub Vercel. Ne pas rejouer les deux scripts SQL existants.

## À tester
1. En brouillon : visibilité dans l’Admin uniquement.
2. En publié : visibilité sur /agenda.html après actualisation.
3. Modifier date, public et tarif, puis vérifier en rechargeant /admin.html.
4. Réutiliser une image de la galerie sans la réimporter.

Les tests automatisés vérifient la syntaxe des fichiers JS, pas la connexion réelle à Supabase.

# CFL Control V17 — Vacances scolaires Admin uniquement

## Corrections

- **Agenda Admin** : panneau bleu explicite des vacances scolaires vaudoises, affiché au-dessus du calendrier quelle que soit la vue (annuelle, synthèse, mensuelle). Il indique les noms et dates des périodes, indépendamment de la superposition des événements et des filtres. Les cartes de la synthèse annuelle affichent aussi des étiquettes bleues portant le nom des vacances.
- **CFL TV** : le calendrier des slides ne marque plus les vacances scolaires. Les week-ends restent visibles, et les jours fériés ne sont pas modifiés.
- **Activity et Leaderboard** : code inchangé.
- **Supabase** : aucune modification de schéma ou des données. Aucun SQL à rejouer.

## Installation
Remplacer les fichiers du dépôt GitHub par ceux de ce ZIP puis laisser Vercel déployer. Dans l'Admin, choisir l'année 2027 et la synthèse : le bandeau bleu doit mentionner « Relâches », « Vacances de Pâques », etc. Dans CFL TV, la vue annuelle doit conserver les week-ends sans marquage bleu vacances.

## Contrôles
Syntaxe des scripts vérifiée localement. Rendu navigateur en production à tester.

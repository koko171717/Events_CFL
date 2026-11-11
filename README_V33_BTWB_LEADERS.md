# CFL CONTROL V33 — Diagnostic BTWB ciblé

Version V32 conservée, sans modification des slides TV, de Supabase ni de l’API BTWB.

## Fonctionnalités
- Libellés distincts pour « WOD + résultats du jour » et « Leaderboard dédié ».
- Explication du comportement et rappel de l’identifiant workout requis par le widget dédié.
- Analyse exploratoire supplémentaire des éléments HTML ressemblant à des scores; export JSON local des candidats.

## Vérification
1. Ouvrir `/btwb-diagnostic.html`.
2. Tester « WOD + résultats du jour » pour comparer avec la V32.
3. Pour « Leaderboard dédié (workout précis) », saisir un identifiant numérique pris dans une URL BTWB `/workouts/NUMERO`. Ce classement peut être historique, pas nécessairement quotidien.
4. Appuyer sur « Charger le widget », puis « Analyser le contenu ».
5. Comparer les « Signaux de classement » et la structure brute.

Les éléments repérés ne sont **pas** des scores validés, et aucun tri n’est effectué. Un résultat vide ne prouve pas une panne de l’API BTWB.

## Confidentialité
La page de diagnostic ne devrait être accessible qu’aux administrateurs si elle affiche des données nominatives. Export JSON local exclusivement : ne pas publier l’export ou la clé BTWB dans GitHub.

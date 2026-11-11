# CFL CONTROL V32 — Diagnostic d'extraction BTWB (sans modification des slides)

## Objectif
Évaluer les possibilités réelles d'extraction des éléments affichés par les widgets officiels BTWB. La V31 reste fonctionnellement inchangée.

## Installation
Importer tous les fichiers du ZIP dans le dépôt CFL CONTROL en conservant sa configuration Vercel et ses variables d'environnement. Le seul nouvel élément fonctionnel est `btwb-diagnostic.html` à la racine.

Après déploiement, ouvrir `https://VOTRE-DOMAINE/btwb-diagnostic.html`.

1. Choisir « Classement du jour », la programmation, puis « Charger le widget ».
2. Attendre que BTWB affiche les résultats.
3. Cliquer « Analyser le contenu ».
4. Comparer nombre de lignes, éléments, texte et classes CSS. Si pertinent, exporter le JSON pour un développement ultérieur.
5. Répéter pour « Classement workout » sur un ID disposant de scores.

## Faisabilité technique
Le widget est rendu par l'endpoint local `/api/btwb-widget` dans une iframe de même origine. Le navigateur peut donc lire la structure DOM de l'iframe (sous réserve d'un chargement correct). Cela ne prouve ni l'existence d'une API publique de résultats, ni la stabilité de la structure du Webwidget.

## Protection des données
Les noms et résultats visibles peuvent constituer des données personnelles. Le diagnostic ne les transmet à aucune nouvelle API : il les analyse localement. Le fichier JSON exporté n'est pas anonymisé. Ne pas le publier sur GitHub et ne pas ouvrir publiquement la page de diagnostic si les résultats ne sont pas destinés à être publics. Avant production, restreindre l'outil aux administrateurs ou le retirer du dépôt.

## Limitations
Le diagnostic ne transforme pas encore les scores en objets classés. Des règles seront définies d'après une vraie sortie BTWB pour éviter les erreurs de tri, RX/MOD, dates, time cap, rangs et doublons.

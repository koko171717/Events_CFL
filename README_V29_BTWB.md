# CFL Control V29 — Optimisation BTWB pour TV

## Périmètre
Cette mise à jour ne modifie que `api/btwb-widget.js`, `assets/core.js`, `assets/base.css` et `tv.html` (plus ce document). Le reste, notamment l’agenda et les Spotlights, est inchangé.

## Changements
- Mise en page sombre CFL pour le conteneur TV ; titres moins redondants.
- Panneau BTWB plus lisible (typographie et marges) sans supprimer ni falsifier ses données.
- Indicateur de chargement et d’absence de contenu *visible* à contrôler : ne prétend pas qu’il n’y a aucun résultat dans BTWB.
- Navigation dans les contenus longs : lorsque le widget dépasse l'écran, commandes « Plus haut » et « Suite ». Aucun résultat n’est volontairement tronqué.
- 45 secondes proposées pour une nouvelle slide BTWB ; les durées déjà configurées sont conservées.
- Actualisation au retour de chaque slide, déjà prise en charge par la playlist existante.

## Limites vérifiées
Le widget BTWB est une bibliothèque tierce injectant sa propre interface. Cette version **ne promet pas** de reconstituer RX/TRAIN, Skills/Strength ou un classement sur mesure. Cela nécessite une API documentée autorisant la récupération structurée, ou une adaptation officielle BTWB. Un widget vide peut signifier qu'il n'y a aucun résultat à cette date ou qu'il n'a pas terminé de charger.

## Déploiement
1. Sauvegarder le dépôt GitHub actuel ou créer une branche `before-v29`.
2. Déposer le contenu du pack sur le dépôt existant, sans effacer les fichiers de configuration Vercel.
3. Aucun nouveau SQL et aucune nouvelle variable Vercel.
4. Contrôler WOD, Activity, Classement du jour et Classement workout en ouvrant chaque slide dans le Studio et dans `/diaporama.html`.
5. Test conseillé : un WOD court, un WOD HWPO long, un classement avec des résultats et un autre sans résultats ; vérifier sur écran TV 16:9.

La structure de styles est ciblée et n’a pas d’effet voulu sur l’agenda. Le rendu BTWB réel reste à valider avec les données privées de la box.

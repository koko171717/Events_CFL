# CFL CONTROL V34 — Studio WOD TV (prototype)

Nouvelle page `/btwb-wod-studio.html` ajoutée à la V33. Aucun changement aux modules TV, administrateur, agenda et à l’API BTWB existante.

## Essai

1. Déployer le ZIP à la racine du dépôt GitHub, en conservant la configuration Vercel actuelle et `BTWB_WEBWIDGET_KEY`.
2. Ouvrir `https://eventscfl.vercel.app/btwb-wod-studio.html`.
3. Comparer la colonne officielle et le rendu CFL. Utiliser « Extraire et prévisualiser » si nécessaire.
4. Changer la typographie, naviguer entre les écrans et tester le plein écran.

## Méthode

Lecture locale du HTML issu de `/api/btwb-widget?type=wod`. Recherche des blocs `ul.btwb-wod-list > li` et descriptions `.btwb-workout-description`; conversion en texte seul pour éviter l’injection HTML. L’affichage de la date est basé sur le fuseau Europe/Zurich. Le prototype segmente les WOD longs par lots approximatifs de lignes. Il ne garantit pas encore une mise en page parfaite pour toutes les programmations, et ne sauvegarde pas les résultats.

Les résultats de membres, images ou champs enrichis ne sont pas extraits par cet outil. Le chargement et l’actualisation peuvent dépendre des Webwidgets BTWB. Les pages sont automatiquement relues et le widget est rechargé toutes les 5 minutes.

La page de studio est un outil de test. Avant une publication TV définitive, intégrer la même logique dans la playlist et contrôler la mise en page sur une vraie TV.

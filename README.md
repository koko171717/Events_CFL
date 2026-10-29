# CFL CONTROL — Démo de présentation

Prototype interactif de gestion de CrossFit Léman, avec Dashboard, tâches hebdomadaires, BEYOND THE BOX. (Events), coachs / absences / remplacements.

## Publier sur GitHub Pages (sans commandes)

1. Sur GitHub, créer un dépôt **public** (ex. `cfl-control-demo`). Ne pas y déposer de données personnelles sensibles.
2. **Décompresser le ZIP**, puis cliquer sur **Add file → Upload files** et déposer `index.html`, `.nojekyll` et `README.md` **à la racine du dépôt**, pas dans un sous-dossier.
3. Cliquer sur **Commit changes**.
4. Aller dans **Settings → Pages → Build and deployment** ; choisir **Deploy from a branch**, branche **main**, dossier **/(root)** ; enregistrer.
5. Ouvrir l'adresse affichée par GitHub Pages, normalement `https://VOTRE-PSEUDO.github.io/cfl-control-demo/`.

## IMPORTANT — maquette, pas une application en production

- Les tâches, affectations et absences sont conservées uniquement dans le **stockage local du navigateur**. Un autre navigateur ou appareil ne retrouve pas les mêmes données ; pas de sauvegarde serveur.
- Les identifiants ou droits d'accès réels ne sont pas mis en œuvre. Un dépôt GitHub Pages public rend la démo accessible à toute personne connaissant le lien.
- BEYOND THE BOX. est intégré à la page et sa liaison locale avec le planning des coachs doit être testée sur l'URL publiée avant la présentation. Aucune synchronisation avec Zen Planner ou le site Events public.
- N'utiliser que des données de démonstration ; ne pas saisir d'informations RH confidentielles dans cette version.
- Pour mettre à jour la démo, remplacer simplement `index.html` sur la branche `main`.

**Version de base :** CFL CONTROL V2.5.29 (HTML autonome). Aucun build ni installation de dépendances.

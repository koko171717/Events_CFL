# CFL CONTROL V35 — Identité officielle CFL + Studio WOD

## Identité
Rouge CFL officiel : `#B8151F`. Base noir / gris anthracite / blanc.
Les styles communs ont été harmonisés dans `assets/base.css` et une feuille additionnelle `assets/cfl-identity-v35.css`.
Agenda et administration sont également harmonisés, en conservant les fonctionnalités.

## Studio WOD
Ouvrir `/btwb-wod-studio.html` pour tester le rendu du WOD sur un écran 16:9 : plusieurs entraînements sur une page si lisibles, sinon répartition sur plusieurs pages.
Le studio conserve la source officielle BTWB dans une iframe et analyse seulement les données présentes dans son HTML.

Les « Athlete Instructions » ne sont **pas garanties** dans l'ancien Webwidget. Le champ manuel de test du studio est uniquement une prévisualisation locale, non sauvegardée et non utilisée par les slides publiques.

## Leaderboard
Le classement officiel existant reste inchangé en V35. Les résultats présents pour deux WOD sont une bonne base pour tester ensuite la mise en page personnalisée sans mélanger les séances. L'extraction du classement quotidien doit encore être validée sur un jour avec des scores dans les widgets.

## Installation
Copier l'ensemble des fichiers vers le dépôt GitHub existant (en conservant les variables d'environnement Vercel et Supabase), puis déployer. Aucun SQL supplémentaire nécessaire.

## Précautions
Conserver une copie de la V34 avant remplacement. Valider après déploiement les pages `/tv.html`, `/agenda.html`, `/admin.html` et `/btwb-wod-studio.html`. Ne pas publier de clés privées BTWB ni de JSON de résultats nominatifs.

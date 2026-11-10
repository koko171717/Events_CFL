# CFL Control V15 · BTWB Activity & Leaderboard

Cette version conserve l’agenda, Supabase et les autres fonctions du pack V14.

## Nouveaux modes dans CFL TV

Dans l’éditeur, choisir le type **BTWB**, puis :

- **WOD** : comportement existant, section Main du track sélectionné.
- **Activité** : les 3 à 30 dernières activités BTWB de l’organisation.
- **Classement du jour** : widget WOD du track choisi avec résultats du jour (3 à 20 résultats par sexe et par workout lorsque disponibles).
- **Classement workout** : identifiant numérique BTWB de workout obligatoire, 3 à 20 résultats par sexe. Trouver l'identifiant dans le chemin `/workouts/123` de l'adresse BTWB du workout. Ce mode n'avance pas automatiquement sur un nouveau workout chaque matin ; pour cela choisir Classement du jour.

Ajouter la slide, choisir le module, enregistrer, puis **Publier la playlist**. La TV utilisera son lien `/diaporama.html` habituel. Aucun changement SQL.

## Mise à jour

Ces modules sont rechargés à chaque passage de slide, avec URLs non mises en cache et un contrôle périodique. Le rendu des résultats est produit par le widget officiel BTWB ; les longueurs sont paramétrables mais une longue liste peut encore déborder : préférer 3 ou 5 résultats à la télévision.

## Vercel

Conserver la variable serveur `BTWB_WEBWIDGET_KEY` déjà configurée. Remplacer les fichiers du dépôt GitHub par ceux du pack, puis tester `/api/btwb-widget?type=activity&count=5`, `/api/btwb-widget?type=daily-leaderboard&track=84043&count=3` et `/api/btwb-widget?type=leaderboard&workout=13&count=5`. Ce dernier ID 13 correspond seulement à l'exemple Fight Gone Bad, pas à un classement du jour garanti.

La clé BTWB Webwidgets est exposée au navigateur par le procédé officiel BTWB, même si elle n'est pas stockée dans le dépôt GitHub. Ne jamais y mettre de clé secrète Supabase.

Validation : scripts JavaScript contrôlés avec node --check, ZIP vérifié. Affichage réel BTWB à tester sur Vercel, faute d'accès au compte BTWB depuis l'environnement de construction.

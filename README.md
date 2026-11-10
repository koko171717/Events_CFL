# CFL Control V6 — restauration Agenda et playlist TV

Ce pack remplace l'interface Agenda V5 simplifiée par le calendrier historiquement validé : grille annuelle, synthèse annuelle et liste mensuelle, catégories, détails et repères vaudois. Les événements sont lus directement dans Supabase.

- `/` — choix Agenda / CFL TV (identification requise).
- `/admin.html` — **calendrier original** en mode administration : connecté à Supabase ; bascule « Mode édition » ; édition des dates, descriptions, statuts et téléversement d'images vers Storage. Le compte doit exister dans `app_admins`.
- `/agenda.html` — le même calendrier original, lecture des événements **publiés uniquement** et sans commandes d'édition.
- `/tv.html` — playlist interactive avec ajout direct, édition, suppression, duplication, montée/descente et glisser-déposer. Enregistrer modifie les brouillons ; publier met à jour la TV.
- `/diaporama.html` — lecteur permanent lisant le snapshot publié toutes les dix secondes.

La TV récupère la description des événements et leur affiche depuis Supabase. La description personnalisée n'est utilisée que lorsqu'elle contient du texte. L'entête intègre désormais le SVG CrossFit Léman extrait du calendrier validé (`assets/logo-crossfit-leman.svg`).

## Déploiement

1. **Ne pas relancer les scripts de création de tables** : votre projet Supabase V5 est déjà configuré et les événements existants doivent être conservés.
2. Faire une sauvegarde de la table `events` et de `tv_slides` via Supabase avant déploiement.
3. Décompresser cette archive dans la racine du dépôt GitHub existant et remplacer les fichiers de l'ancienne version. Conserver l'intégralité du dossier `assets/`.
4. Laisser Vercel déployer la nouvelle révision sur la même adresse `vercel.app`.
5. Ouvrir `/login.html`, se connecter et ouvrir Agenda → vérifier les 3 vues, éditer un événement de test, publier et voir `/agenda.html` ; ajouter une affiche depuis le formulaire, enregistrer puis vérifier sa présence sur la fiche. Sur TV → ajouter une slide événement, vérifier la description, monter/descendre, supprimer/dupliquer, publier, consulter `/diaporama.html` sur un second navigateur.

## Limitations / notes

- Les affiches ajoutées dans l'éditeur sont téléversées dès la sélection. Elles ne seront associées à l'événement qu'après « Enregistrer » ; des fichiers non associés peuvent subsister si on annule.
- Le statut « À confirmer » du calendrier est conservé visuellement mais correspond à `draft` dans la base V5 qui ne possède pas ce troisième statut ; la distinction n'est pas persistée. Une future migration SQL peut ajouter cet état si nécessaire.
- Un événement n'est jamais supprimé lorsqu'on supprime une slide TV.
- Une publication TV reflète les données du moment (snapshot événement) ; en cas de modification de la description d'un événement déjà publié, republier la playlist pour figer la nouvelle description sur la TV. Le lecteur interroge aussi les événements publiés régulièrement ; la description d'un événement existant est réactualisée au rafraîchissement du lecteur.
- Les images intégrées au calendrier historique restent disponibles dans le fichier HTML original. Le logo utilisé sur la TV est un SVG extrait du calendrier validé, pas un lettrage inventé.
- Ne pas placer de mot de passe ni de clé Supabase secrète dans le dépôt ; la clé `sb_publishable` reste publique et les règles RLS contrôlent l'accès.
- Ne pas installer Trello ou BTWB réel à ce stade.

### Vérification qualité effectuée
Structure HTML et compilation syntaxique du JavaScript local. Tests d'écriture/connexion Supabase en environnement réel à faire après déploiement.

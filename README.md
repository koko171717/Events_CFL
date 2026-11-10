# CFL CONTROL V5 — Déploiement Supabase + Vercel

**Version d'intégration opérationnelle à configurer et tester.** Ce pack crée un nouveau socle fonctionnel à partir des données du calendrier V4 : ce n'est pas encore la reprise pixel-perfect de toutes les anciennes vues, ni une synchronisation Trello/BTWB. Les pages administratives de l'ancienne V4 sont remplacées par une interface simple connectée à Supabase.

## Ordre de mise en service

### 1. Créer le projet Supabase

1. Ouvrir https://supabase.com/dashboard et créer un projet `cfl-control`.
2. Dans **SQL Editor**, exécuter **`supabase/01_schema.sql`** en une fois. Il crée : `events`, `app_admins`, `tv_slides`, `tv_publication`, le bucket public `cfl-events`, les règles RLS et la fonction sécurisée `publish_cfl_tv`.
3. Dans **SQL Editor**, exécuter **`supabase/02_seed_events.sql`**, qui importe les **16 événements 2027** de la version actuelle, sans écraser les événements déjà présents. Les anciens visuels incorporés sont référencés dans `assets/calendar-visuals.js` (pas encore transférés physiquement dans Storage) ; les nouvelles images seront directement envoyées dans Supabase Storage depuis l'admin.

### 2. Créer le premier compte administrateur

1. Dans **Authentication → Users** : créer un utilisateur avec une adresse e-mail et un mot de passe fort, ou inviter l'utilisateur si votre configuration de messagerie le permet. Pour un utilisateur créé manuellement, suivre la procédure de création et de confirmation d'e-mail prévue dans votre version du Dashboard.
2. Copier l'**UUID** du compte dans Authentication → Users.
3. Dans SQL Editor, exécuter (en remplaçant la valeur) :

```sql
insert into public.app_admins (user_id)
values ('UUID_DE_L_UTILISATEUR');
```

Important : **créer un utilisateur ne suffit pas** à obtenir les droits. Seuls les UUID enregistrés dans `app_admins` peuvent lire/modifier les brouillons, publier les slides ou téléverser des images.

### 3. Configurer Supabase côté site

Ouvrir `assets/config.js` et remplacer les 2 valeurs :

```js
window.CFL_CONFIG = {
  SUPABASE_URL: 'https://VOTRE-PROJET.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'VOTRE_CLE_PUBLIQUE_SUPABASE'
};
```

Les valeurs se trouvent dans **Project Settings / API Keys** : `Project URL` et clé **publishable** `sb_publishable_...` (ou clé publique `anon` sur un projet antérieur). Ne jamais copier `service_role`, `sb_secret_...`, le mot de passe de la base ou un token personnel dans le HTML ou GitHub.

Dans **Authentication → URL Configuration**, mettre le domaine Vercel de production comme **Site URL** et le ou les domaines de prévisualisation autorisés dans **Redirect URLs** si un mécanisme de confirmation ou récupération par lien est utilisé. La connexion par e-mail/mot de passe de cette V5 utilise `signInWithPassword`.

### 4. Déployer sur GitHub et Vercel

1. Créer une branche ou un nouveau dépôt GitHub pour éviter d'écraser la version V4 tant que les tests ne sont pas validés.
2. Copier à la racine du dépôt **les fichiers et dossiers contenus dans ce ZIP** (`index.html`, `login.html`, `admin.html`, `tv.html`, `agenda.html`, `diaporama.html`, `assets`, `vercel.json`).
3. Dans Vercel, importer le dépôt et sélectionner **Framework = Other**, répertoire racine `./`, sans commande de build.
4. Déployer et utiliser l'adresse temporaire `https://NOM-DU-PROJET.vercel.app`. **Aucun domaine `crossfitleman.ch` nécessaire.**
5. Tester d'abord avec un déploiement protégé / de préproduction. Le contrôle réel des opérations provient des règles Supabase RLS et de la vérification admin, pas seulement d'un bouton ou d'un écran de connexion.

### 5. Vérifier les parcours essentiels

- Ouvrir `/` sans connexion : redirection vers `/login.html`. Avec un compte autorisé, la landing affiche **uniquement AGENDA et CFL TV** (plus le lien de déconnexion).
- Ouvrir `/admin.html` : créer un événement brouillon, changer les dates, modifier la description. Vérifier qu'il n'est pas dans `/agenda.html`.
- Ajouter une affiche depuis le champ fichier et enregistrer ; vérifier son apparition depuis un autre navigateur connecté.
- Passer le statut à **Publié** : apparition dans l'agenda membre sans redéploiement.
- Ouvrir `/tv.html` : créer une slide d'événement, régler la durée, enregistrer, supprimer ou réordonner via le champ « Ordre ».
- Cliquer sur **Publier la playlist**. Ouvrir `/diaporama.html` sur un autre appareil / écran, observer la diffusion.
- Ajouter ou supprimer une slide puis republier : `/diaporama.html` recharge la publication toutes les 10 s et applique la mise à jour au prochain changement de slide.
- Vérifier qu'un utilisateur anonyme ne peut pas modifier `events` ou `tv_slides` (RLS).

## Adresses disponibles dès maintenant

| URL Vercel | Usage |
|---|---|
| `/` | Landing Admin : uniquement **Agenda** et **CFL TV** |
| `/login.html` | Connexion Supabase Auth |
| `/admin.html` | Ajouter/éditer/supprimer les événements et importer les images |
| `/tv.html` | Créer, modifier, ordonner, supprimer et publier les slides |
| `/agenda.html` | Agenda membres public, actualisé depuis Supabase au chargement |
| `/diaporama.html` | Lien permanent de diffusion TV, playlist publiée actualisée toutes les 10 s |

Les adresses `admin.crossfitleman.ch`, `events.crossfitleman.ch` et `tv.crossfitleman.ch` pourront être ajoutées plus tard sans changement de base de données. Les paramètres d'authentification Supabase devront alors être adaptés aux nouveaux domaines.

## Notes de sécurité et de fonctionnement

- `assets/config.js` contient **exclusivement une clé publique**. L'autorisation est contrôlée dans Supabase via `app_admins` et RLS.
- Le bucket `cfl-events` est public pour permettre aux agendas membres et aux TV de charger les images. Ne jamais y déposer de documents confidentiels. Les images de brouillons sont potentiellement accessibles via leur URL directe, même si l'événement n'est pas affiché publiquement.
- Les anciennes affiches embarquées dans `calendar-visuals.js` restent dans le pack statique. On pourra les transférer vers Storage une fois le fonctionnement validé pour éliminer cette dépendance.
- Les modifications de l'agenda sont immédiatement visibles côté public lorsque le statut est `published`. Les modifications de slides restent en brouillon jusqu'à « Publier la playlist ».
- Les slides événement liées à un événement archivé/brouillon ne sont pas publiées par la fonction côté client. Le contrôle de publication de la playlist est toutefois confié à un admin autorisé : vérifier le contenu avant publication.
- La page TV interroge Supabase toutes les 10 secondes, évitant de configurer Realtime. Pour une diffusion 24h/24, prévoir une solution de relance automatique du navigateur/écran et un test de stabilité réseau.
- Les QR codes sont générés à partir du lien de l'événement si disponible. Les bibliothèques Supabase et QRCode sont chargées par CDN : prévoir un test de connectivité réseau sur les TV.
- Les modifications de configuration se font via `assets/config.js`, donc un **premier redéploiement initial** est nécessaire. Ensuite les modifications éditoriales et les publications ne demandent plus aucun déploiement.
- Les widgets BTWB sont simulés. Trello et BTWB ne sont pas connectés à cette V5 conformément à la priorisation.

## Limites et vérifications avant la mise en production

- Ce pack n'a pas pu être testé contre votre projet Supabase, car aucune URL ni clé de votre projet n'ont été communiquées. Les scripts ont été vérifiés syntaxiquement ; les connexions Auth, RLS, upload et publication doivent être validées après création du projet.
- La lecture TV n'est pas une garantie de fonctionnement hors ligne ; elle nécessite réseau et un navigateur actif.
- La vue publique refaite conserve les événements et leur logique de publication, mais **n'est pas encore la restauration complète des 3 vues historiques du calendrier** (année grille, année liste et mois liste) ; ces vues peuvent être portées dans une itération ultérieure si leur rendu exact est indispensable.
- Utiliser des sauvegardes Supabase et un environnement de test ; vérifier les quotas et le plan adapté avant la production.

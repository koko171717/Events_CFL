# CFL CONTROL — Landing Admin / Agenda / TV (V4, environnement de test)

## Navigation sur Vercel
- `/` : **landing page CFL CONTROL**, deux grandes entrées (Agenda CFL / CFL TV) et accès à la vue membres.
- `/admin.html` : éditeur de l'Agenda CFL.
- `/tv.html` : constructeur de slides CFL TV.
- `/agenda.html` : aperçu de l'agenda visible par les membres (snapshot public autonome, **non synchronisé automatiquement** avec l'éditeur).
- `/assets/calendar-visuals.js` : ressources visuelles de l'agenda.

Un lien flottant « ← CFL Control » est ajouté à l'éditeur, à la TV et à l'aperçu membres.

## Mise en ligne
Déployer le contenu du ZIP sur le dépôt relié à Vercel, en remplaçant les fichiers de cette version de staging. Framework = Other ; aucune compilation.

**Sécurité : ce pack n'est PAS destiné à être publié librement.** La landing page ne fournit pas de connexion/authentification. Activer la Deployment Protection Vercel pour l'intégralité du déploiement de test et ne pas l'associer à `events.crossfitleman.ch`.

## Données et intégrations
- L'agenda admin et CFL TV partagent provisoirement les données via le stockage du même navigateur et la même origine. Aucun stockage partagé entre appareils : Supabase (ou autre backend) et authentification resteront à mettre en place avant publication.
- `/agenda.html` est une version publique figée de l'agenda. Les changements dans `/admin.html` ne s'y publient pas automatiquement.
- Connexion Trello : non active.
- BTWB : simulations uniquement, modules officiels non connectés.
- Le nom public `events.crossfitleman.ch` devrait ensuite pointer vers l'agenda membres, et non vers cette landing admin. La landing admin sera déplacée sur une URL d'administration distincte avec authentification.


## V4 : Diffusion CFL TV /diaporama.html
- Studio `/tv.html` : bouton **Préparer la publication** télécharge un `diaporama.html` autonome contenant les slides courantes, leurs durées, images/affiches et QR.
- Remplacer le fichier `diaporama.html` à la racine du dépôt puis déployer sur Vercel.
- Lien à partager avec les écrans TV : `https://VOTRE-DOMAINE-VERCEL/diaporama.html` (ou `.../diaporama` avec cleanUrls).
- Ce n'est pas encore une publication directe côté serveur : sans backend/auth, le bouton prépare le fichier mais ne peut pas modifier Vercel lui-même.
- Le fichier initial du pack est une page d'attente tant que vous n'avez pas généré et déployé votre premier diaporama.
- La vue mensuelle utilise **une seule colonne**, avec affiches miniatures en **object-fit: contain**, sans recadrage.
- Attention : ce prototype ne synchronise pas encore automatiquement les modifications postérieures à l'export. Pour actualiser, exporter à nouveau puis déployer.

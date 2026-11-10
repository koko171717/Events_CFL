# CFL CONTROL — Landing Admin / Agenda / TV (V3, environnement de test)

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

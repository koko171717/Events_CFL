# CFL Control V18 — Correction du mode Agenda Admin

## Problème identifié

L’ancien code utilisait `location.pathname.endsWith('/admin.html')` pour décider si le calendrier chargé était administrateur. Si Vercel expose la page en `/admin` (option clean URLs ou réécriture), l’interface éditeur restait active mais le calendrier chargeait **seulement les événements publiés** et désactivait les repères Admin : vacances, jours fériés et brouillons.

## Correction

- `admin.html` reconnaît maintenant son rôle administrateur **indépendamment de l’URL**.
- L’authentification Supabase reste exigée par `checkAdmin()` et les politiques RLS.
- Le calendrier doit charger aussi les statuts non publiés et afficher les repères vaudois.
- `agenda.html` reste public et n'est pas modifié.
- Aucun SQL ni changement de base nécessaire.

## Tests

1. Déployer sur GitHub/Vercel avec **le contenu** du ZIP à la racine du dépôt.
2. Ouvrir `/admin` ou `/admin.html`, se connecter et sélectionner 2027 / grille annuelle.
3. Vérifier le bandeau bleu « Vacances scolaires vaudoises » et les repères à leurs dates.
4. Vérifier les brouillons (y compris ceux affichés dans le menu « Brouillons ») directement dans la grille à leur date.
5. Ouvrir `/agenda.html` en fenêtre privée : aucun brouillon ne doit être visible.
6. Si besoin, ouvrir F12 > Console et chercher `[CFL V18]` pour voir le nombre d'événements et brouillons chargés.

**Important** : ne publier sur le site que si l'authentification Supabase et les règles RLS sont toujours actives. Si les compteurs indiquent 0 brouillon malgré des brouillons dans Supabase, vérifier les règles RLS et les statuts en base.

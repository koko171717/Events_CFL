# CFL Control V10 — Agenda Admin, Agenda annuel TV et noms BTWB

## Installation
Décompresser ce ZIP à la racine du dépôt GitHub CFL Control (en conservant `assets/`, `api/`, `supabase/`). Vercel redéploie ensuite le projet. Aucun changement de clés ou SQL : la slide Agenda annuel utilise le type `custom`, déjà autorisé en base.

## Agenda Admin
- `/admin.html` : barre **Nouvel événement**, **Modifier un événement**, **Voir l’agenda public**.
- Clique sur un événement pour ouvrir l’éditeur direct Supabase, ou sur un jour de la grille pour créer à cette date. Le formulaire indépendant permet titre, nom court, catégorie, dates, description, statut publié/brouillon, lien, affiche (Supabase Storage) et suppression.
- Recharge le calendrier après sauvegarde pour garantir une vue cohérente entre les trois vues.
- `/agenda.html` reste public, lecture seule.

## CFL TV
- 4 types : Événement, Événements du mois, BTWB, Agenda annuel. Année réglable dans la slide annuelle.
- Le sélecteur d’événement affiche l’année avant le titre.
- Les slides BTWB affichent le vrai nom du track en titre/en-tête.
- Toutes les fonctions playlist et publication restent branchées sur Supabase.

## Limites à vérifier avant production
- Agenda annuel : une synthèse compacte montre les 12 mois, cinq événements maximum par mois + un compteur pour les autres. Une année chargée nécessite un autre mode de pagination.
- BTWB : le widget officiel reste dans son iframe ; les variantes longues peuvent encore nécessiter du défilement. Le futur rendu RX/TRAIN vraiment natif exige une source de données structurées ou autorisation d’API BTWB.
- Vérifier les droits Supabase `app_admins`, la création/modification/suppression, l’import image, la sélection Agenda annuel et la publication sur `/diaporama.html` depuis deux navigateurs.
- Les anciens contrôles d’édition sont présents dans le calendrier historique ; la barre V10 fournit désormais le chemin fiable indépendant.

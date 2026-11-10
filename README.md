# CFL Control V7 — Corrections Agenda Admin + CFL TV

Cette mise à jour conserve Supabase et le contenu de l’agenda V6. Aucun SQL à rejouer.

## Agenda
- `/admin.html`: le mode édition est activé après vérification du rôle dans `app_admins`. Bouton **Event** pour créer, clic sur un événement puis **Modifier l’événement**, import d’image depuis le formulaire, enregistrement Supabase.
- Bouton **Voir l’agenda public** ouvert dans un nouvel onglet (`/agenda.html`).
- `/agenda.html`: version publique non modifiable, présentations historiques conservées.

## CFL TV
- Choix du type via 3 grands boutons.
- Commandes **Enregistrer / Ajouter / Supprimer** réunies.
- Vignettes de la playlist en bas : cliquer pour sélectionner et modifier.
- Ordre réorganisable depuis la liste de gauche (glisser-déposer ou flèches).
- Typographies et contrastes des descriptions renforcés, notamment dans les listes mensuelles.
- Bouton **Publier la playlist** pour actualiser `/diaporama.html` (vérification ~10 s).

## Installation
Décompresser puis remplacer les fichiers à la racine du dépôt GitHub existant. Le déploiement Vercel suit le commit. Ne pas rejouer les SQL et ne pas supprimer les données Supabase.

## Vérification recommandée
1. Se connecter, vérifier `/admin.html`, créer/modifier un événement et sa description.
2. Ouvrir **Voir l’agenda public** : le changement publié doit apparaître.
3. Aller dans `/tv.html`, sélectionner une slide en bas, changer de type, enregistrer, ajouter, supprimer, changer l’ordre, publier.
4. Ouvrir `/diaporama.html` sur un autre appareil et vérifier le rafraîchissement.

Note : les descriptions très longues peuvent encore devenir denses sur un écran 16:9. Préférer une présentation éditoriale courte destinée à la télévision. BTWB reste simulé.

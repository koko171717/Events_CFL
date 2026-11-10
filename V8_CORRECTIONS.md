# CFL Control V8 — Correctifs

## Agenda administrateur
- Ouverture du formulaire en cliquant sur un événement existant dans toutes les vues (admin seulement).
- Grille annuelle : clic sur une case/jour libre pour créer un événement à cette date.
- Barre de création avec sélecteur de date, disponible quelle que soit la vue.
- Le bouton Nouvel événement ouvre le formulaire à la date sélectionnée.
- Le lien Voir l’agenda public reste disponible.
- Les modifications sont transmises aux tables Supabase existantes; aucun nouveau SQL nécessaire.

## CFL TV
- Texte de description agrandi significativement (base 62 pixels pour une scène de 1920 x 1080).
- Espacement et largeur du poster ajustés pour donner davantage de place à la description sans recadrer l'affiche.
- L'ajustement réduit le texte uniquement si nécessaire pour que la slide tienne.
- Un avertissement apparaît dans le studio si une description reste trop longue.
- Enregistrer la slide puis cliquer Publier la playlist pour actualiser le lecteur TV.

## Déploiement
Décompresser à la racine du dépôt GitHub existant en remplaçant les fichiers de la V7. Vercel redéploie automatiquement. Ne pas relancer les fichiers SQL. Tester les sauvegardes et la diffusion après déploiement.

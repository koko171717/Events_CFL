# CFL Control V27 — Affiche / Spotlight : textes réellement facultatifs

- Tout champ de texte vide ou composé seulement d’espaces est supprimé du rendu et non remplacé par des textes par défaut.
- Bouton **Effacer tous les textes** sous le modèle Spotlight pour remettre à blanc titre, personne, sous-titre, citation et description. Cliquez ensuite sur **Enregistrer** si la slide existe déjà, ou **Ajouter cette slide** pour une nouvelle affiche.
- Si tous les textes sont vides, la photo occupe seule le slide, sans colonne de texte vide.
- La vue Agenda et les autres types de slides ne changent pas. Aucune migration SQL requise.

## Déploiement
Remplacer les fichiers du dépôt GitHub par ceux de ce pack et laisser Vercel redéployer. Actualiser CFL TV (`Ctrl + F5`). Les données Supabase déjà enregistrées ne sont pas supprimées.

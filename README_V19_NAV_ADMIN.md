# CFL Control V19 — navigation Admin et vue par défaut

- Le lien de retour **← CFL CONTROL** se trouve désormais dans une barre en haut de l’Agenda Admin, au même emplacement et avec le même style que dans CFL TV.
- Suppression du bouton de retour flottant placé en bas à droite de l’Agenda.
- L’ouverture de l’Agenda Admin démarre sur **Grille annuelle** (mode `annual` + `grid`), avec année initiale 2027.
- Les autres vues demeurent disponibles et la base Supabase n’est pas modifiée.

## Installation

Décompresser le ZIP à la racine du dépôt GitHub CFL Control et remplacer les fichiers actuels. Aucun SQL ni nouvelle variable Vercel nécessaire.

## Vérification

Sur `/admin.html` ou `/admin`, le lien de retour apparaît en haut à gauche comme dans CFL TV. Vérifier que l’onglet « Grille annuelle » est actif dès l’ouverture.

# CFL Control V28 — Aperçu des modèles Spotlight

## Comportement

- Dans **Affiche / Spotlight**, les champs restent réellement facultatifs.
- Une option activée par défaut « Montrer des textes d’exemple dans l’aperçu uniquement » affiche le modèle complet (grand titre, prénom/nom, sous-titre, citation et description) lorsque ces champs sont vides.
- Les exemples sont **strictement locaux à l’aperçu de l’éditeur** : ils ne sont ni écrits dans `tv_slides`, ni envoyés à Supabase, ni intégrés au diaporama public.
- Désactive cette option pour prévisualiser exactement le rendu diffusé. Si tous les champs sont vides, le rendu publié reste une photo seule.
- Les champs contenant uniquement des espaces sont traités comme vides.
- Deux modèles d’exemples : Portrait membre et Performance sportive.

## Installation

Remplace les fichiers de ton dépôt GitHub par le contenu du ZIP. Aucun SQL nouveau. Les données et autres fonctionnalités de la V27 restent inchangées. Déploie via Vercel et vide le cache du navigateur si nécessaire.

## Test recommandé

Sélectionne « Affiche / Spotlight », garde les champs vides, et compare l’aperçu lorsque l’option exemples est cochée puis décochée. Ensuite, enregistre et publie : le diaporama ne doit pas afficher les exemples.

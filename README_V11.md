# CFL Control V11 — Brouillons visibles

- Dans **Agenda Admin**, les événements au statut `draft` restent visibles, avec une bordure en pointillés orange et **sans opacité atténuée**. Les vues annuelles, synthèse et mensuelles restent disponibles.
- Le bouton **Brouillons** de la barre Admin ouvre la liste de tous les brouillons stockés dans Supabase, même ceux des autres années. Chaque ligne possède **Modifier**.
- La visibilité des brouillons dans l’Admin ne dépend plus du basculement « Mode édition ».
- L'agenda **public** (`/agenda.html`) reste limité aux événements publiés via la requête Supabase et les politiques RLS.
- Les brouillons sont toujours stockés en base : ce correctif n'efface ni ne recrée d'événement.
- Aucun SQL supplémentaire, aucune modification de la configuration Supabase ou des modules TV.

## Mise en ligne
Remplacer les fichiers du dépôt GitHub par le contenu du ZIP. Les données existantes restent dans Supabase.

## Test
1. Dans Agenda Admin, créer un événement avec Publication = Brouillon et enregistrer.
2. Actualiser la page : le brouillon doit rester dans le calendrier en pointillés orange.
3. Cliquer **Brouillons** et retrouver l'événement, puis **Modifier**.
4. Ouvrir **Voir l'agenda public** : le brouillon ne doit pas y apparaître.

**Note :** les événements réellement supprimés de Supabase avant ce correctif ne sont pas restaurés par la V11. Pour cela, il faudrait examiner les sauvegardes et l'historique disponibles.

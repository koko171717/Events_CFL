# CFL Control V31 — Typographie BTWB réglable

V30 affichait le texte BTWB trop grand. V31 utilise le **réglage Équilibré** par défaut.

Dans **CFL TV → sélectionner une slide BTWB → Taille des textes BTWB** :
- Compact : 19 px en pleine largeur, 16 px en deux colonnes ;
- Équilibré : 24 px en pleine largeur, 20 px en deux colonnes ;
- Grand : 32 px en pleine largeur, 25 px en deux colonnes (comportement V30).

Le réglage est conservé dans les paramètres de la slide Supabase et transmis au lecteur public. Pour modifier une slide déjà publiée, choisir le réglage, cliquer **Enregistrer**, puis **Publier la playlist**.

Les chiffres désignent les pixels à l'intérieur des widgets dans la scène de diffusion et non la taille réelle sur l'écran physique. Les iframes et la structure officielle BTWB sont préservées : les WOD longs pourront encore dépasser et nécessiter le défilement.

**Déploiement** : remplacer les fichiers du dépôt GitHub par le contenu du ZIP. Aucun nouveau SQL. Ne modifie ni l'Agenda, ni Spotlight.

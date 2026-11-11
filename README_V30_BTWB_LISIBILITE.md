# CFL Control V30 — Correction de lisibilité BTWB

La V29 rendait les widgets beaucoup trop petits. La V30 agrandit **le contenu officiel BTWB dans son iframe** (pas seulement le titre de la slide) pour la diffusion TV et l’aperçu.

- Typographie BTWB pleine largeur : environ 32 px dans la scène virtuelle 1920 × 1080.
- Deux colonnes WOD/TRAIN : environ 25 px, afin de préserver une largeur utilisable.
- Titres, paragraphes et tableaux sont ajustés ; le contenu reste fourni directement par BTWB.
- Si la séance dépasse la hauteur, les contrôles de défilement restent disponibles. **Aucune information n’est coupée volontairement.**
- Ne modifie pas l’agenda, les Spotlights ou le schéma Supabase.

## Déploiement
Remplacer les fichiers dans GitHub, attendre Vercel (Ready), puis faire Ctrl+F5 sur le Studio et le diaporama. Revenir sur les slides BTWB pour recharger les iframes. Aucun SQL nouveau.

## Limite
Le widget est une intégration officielle dans une iframe. Les règles CSS ci-dessus doivent être validées avec les vrais contenus BTWB (WOD long, Activity, Leaderboard) : la structure HTML exacte est contrôlée par BTWB et peut changer.

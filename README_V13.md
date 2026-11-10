# CFL Control V13 — Agenda brouillons et vues TV

- Admin : événements **draft** affichés à leur date dans la grille annuelle, la synthèse annuelle et la vue mensuelle. Contour des brouillons conservé. Les catégories non reconnues ne masquent plus les événements admin.
- Admin : barre des **repères vaudois** (jours fériés et vacances scolaires) restaurée. Les données de vacances existantes concernent principalement 2027–2031 ; dates à recouper avec les publications du canton avant usage officiel.
- CFL TV : slide **Agenda annuel** proposant Grille annuelle, Synthèse annuelle, Vue mensuelle ; choix de l'année et du mois. Les événements TV proviennent uniquement des événements publiés dans Supabase.
- L'agenda public reste en lecture seule, sans les brouillons.
- **Aucun SQL supplémentaire**. Ne pas réinitialiser la base.
- Remplacer les fichiers V12 sur le même dépôt et déployer via Vercel.
- Tests : créer un brouillon en janvier 2027, vérifier ses trois vues Admin, vérifier qu'il est absent du public et de la TV ; activer/désactiver les repères ; publier chaque vue TV et vérifier /diaporama.html.
- Rendu complet sur votre Vercel et vos écrans à valider ; vérification syntaxique seulement dans l'environnement de préparation.

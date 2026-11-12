# CFL Control V9 — BTWB Webwidgets (première intégration réelle)

## Installer dans le dépôt existant
1. Remplacer/ajouter les fichiers de ce ZIP à la racine du dépôt GitHub. Ne pas supprimer les dossiers `assets/` et `api/`.
2. Dans **Vercel → Project → Settings → Environment Variables**, ajouter `BTWB_WEBWIDGET_KEY` avec **la clé Webwidgets** visible dans BTWB Admin → Extras → Webwidgets. Activer pour Production (et Preview si souhaité). **Ne pas placer cette clé dans GitHub.**
3. Déclencher un **nouveau déploiement Vercel** pour activer la variable.
4. Ouvrir `https://<votre-projet>.vercel.app/api/btwb-widget?track=84043` et vérifier que le WOD du jour apparaît. Si le widget ne rend rien, inspecter la console navigateur et contacter BTWB (le widget est tiers).
5. Dans `/tv.html`, ajouter une slide, sélectionner **BTWB**, choisir la programmation **CrossFit Leman Program** puis 30 secondes, **Enregistrer** et **Publier la playlist**.
6. Ouvrir `/diaporama.html` sur la TV ; le widget se recharge à chaque passage de la slide. Le nouveau WOD apparaît automatiquement lors de la nouvelle journée à **Europe/Zurich** (si BTWB le publie sur le track). Aucun republier manuel.

## Restrictions connues, importantes
- BTWB diffuse son propre HTML ; son webwidget ne donne **pas** une API structurée officielle permettant de garantir RX et TRAIN en colonnes séparées. Si RX et TRAIN font partie du même workout, la mise en page est celle de BTWB. On peut activer une deuxième colonne si TRAIN est un **track distinct**.
- `data-sections=main` masque les entrées `pre` et `post`, pas automatiquement les blocs nommés warm-up/accessory dans `main`. Pour afficher skills/strength, ils doivent être programmés en `main`.
- Le webwidget peut dépasser verticalement si la séance est longue. **Aucune garantie que tout soit visible sur une slide** ; regarder un vrai WOD pour décider d'une pagination adaptée avec autorisation/API BTWB.
- Pour cette V9, **WOD uniquement** ; Activity et Leaderboard restent désactivés.
- La clé fournie par BTWB pour les widgets est rendue dans le code navigateur par leur mécanisme officiel. Cette clé ne doit pas être confondue avec une clé d'API privée ou Supabase. Vérifier sa portée avec BTWB et la régénérer si nécessaire.
- Aucune modification des tables Supabase ni de l'Agenda V8. L'ajout du type BTWB utilise le type déjà présent dans la V8.
- Les télévisions requièrent une connexion Internet pour charger le JS et les données BTWB.

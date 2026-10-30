# CFL CONTROL — Démo Vercel (V2.5.40)

## Fichiers
- `index.html` : administration CFL CONTROL V2.5.40
- `coach.html` : portail coach premium V2.5.35
- `vercel.json` : configuration statique Vercel (URL propre)

## Déploiement Vercel
1. Décompresser le ZIP.
2. Déposer les fichiers à la **racine** d'un dépôt GitHub (par exemple `events_CFL`), puis importer ce dépôt dans Vercel, ou utiliser Vercel CLI (`vercel --prod`) depuis ce dossier.
3. Framework preset : **Other** ; Build Command : **aucune** ; Output Directory : **racine (`.`)**.
4. Accès : `/` pour l'administration, `/coach` ou `/coach.html` pour le portail coach.

## Limites de la démo
- L'interface est statique : aucune API/backend ni aucun compte sécurisé n'est fourni.
- Les données (demandes, remplacements, réponses) utilisent `localStorage` : elles ne se synchronisent **pas entre appareils ou navigateurs** ; les deux pages communiquent uniquement sur la même origine et dans le même navigateur.
- **Aucun véritable e-mail ou notification push n'est envoyé.**
- L'état « Zen Planner mis à jour » est un **suivi manuel**, sans intégration Zen Planner.
- Le portail permet de choisir librement un profil coach : **ne pas utiliser pour de vraies données personnelles ou des opérations de production**, et limiter l'accès à la démo si nécessaire.

Avant une utilisation réelle, prévoir une authentification, des autorisations et une base partagée côté serveur (par exemple Supabase).

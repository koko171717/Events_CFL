# CFL Control V5 — configuration Supabase intégrée

L'URL de projet Supabase et la clé **publique** fournies sont déjà saisies dans `assets/config.js`.

## Avant le déploiement : vérifier l'autorisation admin

Dans Supabase > Authentication > Users, copier l'UUID de l'utilisateur créé, puis exécuter dans SQL Editor :

```sql
insert into public.app_admins (user_id)
values ('REMPLACER_PAR_UUID_UTILISATEUR')
on conflict (user_id) do nothing;
```

Vérifier via `select user_id from public.app_admins;` que l'UUID apparaît, et que l'adresse est confirmée sous Authentication > Users.

## Déploiement

1. Créer un dépôt GitHub privé ou une branche de test et y déposer **le contenu du dossier**, avec `index.html` à la racine (pas le dossier parent).
2. Sur Vercel > Add New > Project, importer ce dépôt. Framework `Other`, Root Directory `./`, aucune commande de build.
3. Ouvrir l'URL `https://<nom>.vercel.app/login.html` et se connecter avec le compte Supabase autorisé.
4. Tester `/admin.html`, `/agenda.html`, `/tv.html`, `/diaporama.html` depuis deux navigateurs distincts.
5. Dans Supabase > Authentication > URL Configuration, définir Site URL avec l'URL Vercel de production ; ajouter les redirect URLs nécessaires aux futurs liens de réinitialisation de mot de passe.

**Important :** la connexion avec clé publique ne prouve pas que le backend et le front fonctionnent déjà ensemble. Il faut effectuer les tests d'écriture, upload d'image, droits RLS, publications et rafraîchissement TV. Trello/BTWB ne sont pas encore connectés.

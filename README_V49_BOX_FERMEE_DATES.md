# CFL CONTROL V49 — Box fermée et dates TV

- Case « Box fermée pendant cet événement » visible immédiatement sous les dates dans la création ET modification d’un événement (Agenda admin).
- Persistée en base Supabase dans `events.box_closed`. Lancer `supabase/06_box_fermee.sql` si cela n’a pas encore été fait. Sans cette migration, l’enregistrement peut échouer.
- La mention « BOX FERMÉE » continue de figurer sur la fiche publique, les slides « Événements du mois » et « Événement à venir ».
- Dates françaises uniformisées sur les deux slides TV : un jour, deux jours, 3+ jours dans le même mois, mois différents ou années différentes.
- Identité CFL, playlist et rendu BTWB inchangés.

Après déploiement : ouvrir Agenda admin → Nouvel événement ou Modifier l’événement → sous Début/Fin vérifier le bloc OUVERTURE DE LA BOX. Cocher, enregistrer, rouvrir et vérifier que le choix est toujours coché. Vérifier les deux types de slide en prévisualisation TV.

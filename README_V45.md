# V45 — Consignes WOD + Événements du mois

- Les slides **Événements du mois** n’affichent désormais que le visuel/logo, le nom de l’événement et sa date. Les descriptions restent dans l’agenda et les slides événement dédiées.
- Le module **BTWB → WOD CFL personnalisé** ajoute un champ de consigne facultative. Quand l’utilisateur saisit la consigne, elle est datée selon Europe/Zurich et liée à la programmation principale. La consigne est sauvegardée avec la slide dans les paramètres JSON Supabase, puis diffusée à toutes les TV après publication.
- À partir du jour suivant, la consigne ne s’affiche plus, même si elle reste enregistrée. Si la programmation principale change, l'ancienne consigne n'est pas affichée. Pour une modification du WOD dans une même programmation et le même jour, la liaison par identifiant BTWB n’est pas encore disponible : effacer la consigne manuellement dans ce cas.
- Les autres slides, l'agenda et le Studio WOD ne sont pas modifiés.

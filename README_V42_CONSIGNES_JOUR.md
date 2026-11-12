# V42 — Athlete Instructions datées

- Les instructions saisies manuellement sont enregistrées sur cet appareil, pour la date de Suisse (Europe/Zurich), la programmation et la signature du WOD chargé.
- Un changement de date, programmation ou contenu du WOD empêche la réutilisation d’une ancienne consigne.
- Le Studio vérifie les changements de date pendant qu’il reste ouvert et recharge le WOD.
- Le bandeau disparaît si aucune instruction du WOD actuel n’est détectée.
- Cette fonction est **limitée au Studio WOD**. Elle n’est pas synchronisée avec les TV / la playlist publique. Pour cela il faudra un stockage partagé, et une intégration supplémentaire.
- Les imports `wod_board` doivent être faits seulement pour le WOD du jour actuellement chargé, et jamais avec une réponse d’une autre date.
- La logique HWPO n’est pas modifiée.

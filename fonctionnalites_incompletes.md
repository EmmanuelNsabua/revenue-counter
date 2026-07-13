# Fonctionnalités Incomplètes (Backlog)

Ce fichier liste les fonctionnalités de l'application qui sont actuellement sous forme de maquette (ex: boutons avec `toast`) ou qui nécessitent d'être implémentées à l'avenir.

## Super Admin
- **Filtres Avancés (Commerçants)** : Le bouton "Filtres avancés" sur la page de gestion des commerçants affiche un toast. Une interface (modale ou panneau latéral) doit être développée.
- **Rapport d'Activité** : Le bouton "Générer Rapport" sur le tableau de bord affiche un toast. La logique de génération et d'export du rapport (ex: PDF ou Excel) reste à faire.
- **Action Globale** : Le bouton "Action Globale" sur le tableau de bord affiche un toast.
- **Configuration Système** : La page "Configuration" permet de sauvegarder et affiche un toast de succès, mais la persistance réelle en base de données ou la logique associée n'est pas encore complétée.

## Espace Agent
- **Génération de Fichier Excel** : Les boutons d'export Excel dans les pages `commercants` et `paiements` sont factices et affichent un toast. L'export réel des données reste à implémenter.
- **Réinitialisation de mot de passe** : Sur la page `profil`, le bouton "Réinitialiser" affiche un toast "Email de réinitialisation envoyé !". La logique backend et l'envoi d'email doivent être intégrés.

## Espace Admin
*(À compléter au fur et à mesure du développement)*

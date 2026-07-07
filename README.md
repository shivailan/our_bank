# Our Bank - Application de Gestion Bancaire

Projet de gestion bancaire développé dans le cadre du cursus de Master 1. Cette application permet aux utilisateurs de gérer leurs comptes, d'effectuer des opérations courantes et de réaliser des virements sécurisés.

## Fonctionnalités principales

*   **Gestion de comptes** : Création et suivi de différents types de comptes (Courant, Livret A, PEL).
*   **Transactions bancaires** : Effectuez des dépôts, des retraits et des virements inter-comptes.
*   **Historique intelligent** : Visualisation des mouvements avec une logique contextuelle (débit/crédit).
*   **Sécurité** : Gestion des sessions utilisateurs et protection des routes.
*   **Dashboard dynamique** : Vue d'ensemble des soldes, actualités bancaires et dernières activités.

## Technologies utilisées

*   **Backend** : Node.js avec le framework Express.js.
*   **Frontend** : Moteur de template EJS, Bootstrap 5 et Tailwind CSS pour le design.
*   **Base de données SQL** : MySQL pour la gestion des données transactionnelles (ACID).
*   **Base de données NoSQL** : MongoDB (via Mongoose) pour la journalisation des activités (Logs).
*   **Authentification** : Gestion des sessions sécurisée.

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir :
*   Node.js (version 18+ recommandée)
*   Un serveur MySQL opérationnel (MAMP, XAMPP ou MySQL local)
*   MongoDB installé et en cours d'exécution

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone [URL_DE_TON_REPO]
   cd our-bank# our_bank

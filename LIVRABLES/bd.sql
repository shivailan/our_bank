-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : mar. 07 juil. 2026 à 12:45
-- Version du serveur : 5.7.39
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `our_bank_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `comptes_bancaires`
--

CREATE TABLE `comptes_bancaires` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `iban` varchar(34) NOT NULL,
  `type_compte` enum('courant','livret A','PEL') NOT NULL,
  `solde` decimal(15,2) NOT NULL DEFAULT '0.00',
  `statut` enum('actif','bloqué') DEFAULT 'actif',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `comptes_bancaires`
--

INSERT INTO `comptes_bancaires` (`id`, `user_id`, `iban`, `type_compte`, `solde`, `statut`, `created_at`) VALUES
(1, 4, 'FR76-YBNK-3324-4604-2603-0281-757', 'courant', '990.00', 'actif', '2026-07-06 12:26:22'),
(2, 5, 'FR76-YBNK-5154-0352-7157-2017-090', 'courant', '30.00', 'actif', '2026-07-06 13:11:10'),
(3, 4, 'FR76-YBNK-2084-5445-4729-0313-348', 'livret A', '100.00', 'actif', '2026-07-06 15:38:25'),
(4, 4, 'FR76-YBNK-5025-7167-7206-7065-853', 'livret A', '0.00', 'actif', '2026-07-06 16:02:54'),
(5, 4, 'FR76-YBNK-4484-5634-4927-0126-751', 'PEL', '100.00', 'actif', '2026-07-06 16:57:58');

-- --------------------------------------------------------

--
-- Structure de la table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `compte_source_id` int(11) DEFAULT NULL,
  `compte_destinataire_id` int(11) DEFAULT NULL,
  `type_transaction` enum('dépôt','retrait','virement émis','virement reçu') NOT NULL,
  `montant` decimal(15,2) NOT NULL,
  `libelle` varchar(255) DEFAULT NULL,
  `date_transaction` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `transactions`
--

INSERT INTO `transactions` (`id`, `compte_source_id`, `compte_destinataire_id`, `type_transaction`, `montant`, `libelle`, `date_transaction`) VALUES
(1, 1, 2, 'virement émis', '40.00', 'RESTO', '2026-07-06 13:11:40'),
(2, NULL, 2, 'dépôt', '10.00', '', '2026-07-06 15:30:24'),
(3, 2, 1, 'virement émis', '10.00', '', '2026-07-06 15:30:34'),
(4, 1, 2, 'virement émis', '20.00', '', '2026-07-06 15:31:36'),
(5, 2, 1, 'virement émis', '50.00', NULL, '2026-07-06 16:33:15'),
(6, 2, 1, 'virement émis', '10.00', NULL, '2026-07-06 16:38:37'),
(7, 2, 1, 'virement émis', '10.00', NULL, '2026-07-06 16:39:22'),
(8, 1, 2, 'virement émis', '20.00', NULL, '2026-07-06 16:51:09'),
(9, 1, 2, 'virement émis', '10.00', NULL, '2026-07-06 16:51:55'),
(10, NULL, 4, 'dépôt', '10.00', '', '2026-07-06 16:58:31'),
(11, 4, NULL, 'retrait', '10.01', '', '2026-07-06 16:58:42');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telephone` varchar(10) NOT NULL,
  `adresse_postale` varchar(255) NOT NULL,
  `date_naissance` date NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `telephone`, `adresse_postale`, `date_naissance`, `password`, `is_admin`, `created_at`) VALUES
(4, 'ilan', 'shiva', 'shiva77127@gmail.com', '0612457845', '77127', '2003-09-04', '$2b$10$exmYJaUKQ03oAcY04SA84O3Ey2ZRQQZR358HcH4Qcqob0AvNHgO92', 0, '2026-07-06 12:20:05'),
(5, 'khapizov', 'djab', 'djab@gmail.com', '0623124556', '77127', '2001-02-01', '$2b$10$u8ZWWLU0jqBGpfUWGG8Pmel9ydjDGLubyD8K2eYcJ9/NljXREop7C', 0, '2026-07-06 13:10:18'),
(6, 'cristiano ', 'ronaldo', 'admin@ourbank.fr', '0677889944', '45122', '7777-07-07', '$2b$10$1GBwebUbNKNtIL9RHe4Xj.w1AedoR9gsLaeys7199yi1g6WlYSEbS', 1, '2026-07-06 13:18:01');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comptes_bancaires`
--
ALTER TABLE `comptes_bancaires`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `iban` (`iban`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `compte_source_id` (`compte_source_id`),
  ADD KEY `compte_destinataire_id` (`compte_destinataire_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comptes_bancaires`
--
ALTER TABLE `comptes_bancaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comptes_bancaires`
--
ALTER TABLE `comptes_bancaires`
  ADD CONSTRAINT `comptes_bancaires_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`compte_source_id`) REFERENCES `comptes_bancaires` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`compte_destinataire_id`) REFERENCES `comptes_bancaires` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

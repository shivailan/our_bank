CREATE DATABASE IF NOT EXISTS our_bank_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE our_bank_db;

-- 1. Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    telephone VARCHAR(10) NOT NULL,
    adresse_postale VARCHAR(255) NOT NULL,
    date_naissance DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table des comptes bancaires
CREATE TABLE comptes_bancaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    iban VARCHAR(34) NOT NULL UNIQUE, -- Format FR76...
    type_compte ENUM('courant', 'livret A', 'PEL') NOT NULL,
    solde DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    statut ENUM('actif', 'bloqué') DEFAULT 'actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Table des transactions
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    compte_source_id INT NULL, -- NULL si c'est un dépôt initial ou externe
    compte_destinataire_id INT NULL, -- NULL si c'est un retrait
    type_transaction ENUM('dépôt', 'retrait', 'virement émis', 'virement reçu') NOT NULL,
    montant DECIMAL(15, 2) NOT NULL,
    libelle VARCHAR(255) NULL,
    date_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (compte_source_id) REFERENCES comptes_bancaires(id) ON DELETE SET NULL,
    FOREIGN KEY (compte_destinataire_id) REFERENCES comptes_bancaires(id) ON DELETE SET NULL
);

-- Insertion d'un compte Administrateur par défaut pour les tests
-- Le mot de passe fictif ici est 'Admin1234' (il faudra le hacher proprement plus tard)
INSERT INTO users (nom, prenom, email, telephone, adresse_postale, date_naissance, password, is_admin)
VALUES ('Directeur', 'Jean', 'admin@ourbank.fr', '0102030405', '1 Rue de la Banque, Paris', '1980-01-01', '$2a$10$UnMotDePasseHacheIciExemple', 1);
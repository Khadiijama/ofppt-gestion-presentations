# 🎓 Gestion des Présentations OFPPT

> **Plateforme web moderne de gestion et de suivi des présentations pédagogiques pour les Centres de Métiers et de Compétences (CMC) de l'OFPPT.**

🔗 **Dépôt GitHub :** [https://github.com/Khadiijama/ofppt-gestion-presentations](https://github.com/Khadiijama/ofppt-gestion-presentations)

---

## 📌 À propos du projet

**Gestion des Présentations OFPPT** est une application web full-stack conçue pour digitaliser et simplifier le processus de gestion des exposés et présentations dans les établissements de formation professionnelle de l'OFPPT (*Office de la Formation Professionnelle et de la Promotion du Travail*).

L'application permet aux **formateurs** de créer des présentations, de les assigner automatiquement à leurs classes, et de suivre les soumissions des stagiaires en temps réel. Les **stagiaires** peuvent consulter les présentations qui leur sont assignées, soumettre leurs fichiers, et suivre leurs deadlines (date et heure limites).

---

## 🏗️ Architecture & Stack Technique

| Couche | Technologie |
|---|---|
| **Backend / API** | **Laravel 12** (PHP 8.2+) |
| **Frontend** | **React 19** (via Vite & React Router v7) |
| **Base de données** | **SQLite** (développement) / MySQL / PostgreSQL (production) |
| **Authentification** | **Laravel Sanctum** (authentification d'API sécurisée) |
| **Styles & UI** | **Tailwind CSS v4** + CSS3 (Thème personnalisé aux couleurs de l'OFPPT) |

---

## ✨ Fonctionnalités

### 👨‍🏫 Espace Formateur
- **Tableau de bord intelligent :** Vue globale sur les classes gérées, le nombre de stagiaires, le taux global de rendu des présentations, et une liste des présentations récentes.
- **Gestion des classes :** Création, modification et suppression des classes de formation (filières, niveau).
- **Gestion des stagiaires par classe :** Ajout de stagiaires (recherche parmi les comptes sans classe active) et possibilité de retirer un stagiaire d'une classe.
- **Gestion des présentations :** 
  - Création de sujets de présentation avec titre, description, et **date/heure limite précise**.
  - **Assignation automatique** de la présentation à tous les stagiaires de la classe sélectionnée.
  - Modification et suppression des présentations (la suppression nettoie automatiquement les fichiers physiques stockés sur le serveur).
- **Suivi et évaluation des rendus :**
  - Tableau de suivi en temps réel de l'état des rendus de chaque stagiaire (Soumis, En attente, En retard).
  - Visualisation de la date et heure du rendu.
  - Téléchargement direct des fichiers soumis (exposés PDF, PPTX, etc.).

### 🎓 Espace Stagiaire
- **Tableau de bord personnalisé :** Statistiques personnelles (total des présentations assignées, rendus effectués, dossiers en attente et présentations en retard).
- **Suivi des tâches :** Liste ordonnée des présentations en attente selon l'urgence de la date limite.
- **Consultation des consignes :** Détails et consignes formulées par le formateur pour chaque présentation.
- **Rendu de livrables :**
  - Import sécurisé de fichiers (PDF, PPTX, DOCX, ZIP... jusqu'à 20 Mo).
  - Remplacement ou suppression du fichier soumis avant la date limite.
  - Statut de soumission mis à jour en temps réel (Vert: Soumis / Jaune: En attente / Rouge: En retard).

---

## 🗄️ Structure de la base de données

Le schéma de la base de données est composé de 6 tables principales structurées de manière optimale pour assurer les relations :

### Tables principales

| Table | Description |
|---|---|
| `users` | Comptes utilisateurs (formateurs et stagiaires) avec attributs `role` et `etablissement`. |
| `classes` | Classes de formation associées à un formateur responsable. |
| `classe_stagiaire` | Table pivot gérant l'appartenance des stagiaires aux classes. |
| `presentations` | Sujets d'exposés créés par les formateurs, associés à une classe et possédant une `date_limite` (dateTime). |
| `assignations` | Table pivot d'attribution individuelle des présentations aux stagiaires de la classe. |
| `uploads` | Fichiers physiques soumis par les stagiaires avec chemin de stockage (`file_path`) et métadonnées. |

### Diagramme des relations

```
User (formateur) ──< Classe ──< Presentation
                       │
                       ├──< classe_stagiaire >──── User (stagiaire)
                       │
                       └── Presentation ──< Assignation >── User (stagiaire)
                                              │
                                              └──< Upload
```

---

## 📊 Données de démonstration (Seeders)

La base de données inclut des seeders générant un environnement de test réaliste basé sur la taxonomie des établissements **CMC (Centres de Métiers et de Compétences)** de l'OFPPT :

### 👨‍🏫 Formateurs référents (5)

| Nom | Email | Établissement |
|---|---|---|
| Ahmed Bennani | **formateur@ofppt.ma** | CMC Rabat |
| Fatima Zahra Alaoui | fz.alaoui@ofppt.ma | CMC Rabat |
| Khalid Moujahid | k.moujahid@ofppt.ma | CMC Rabat |
| Nadia Cherkaoui | n.cherkaoui@ofppt.ma | CMC Rabat |
| Youssef Ezzahiri | y.ezzahiri@ofppt.ma | CMC Rabat |

### 🏫 Répartition des Classes (20 classes à la CMC Rabat)
L'application génère automatiquement 4 classes par formateur réparties dans les filières d'excellence du Pôle Digital :
- **Développement Digital** (1ère année, Web Full Stack, Applications Mobiles)
- **Infrastructure Digitale** (1ère année, Cyber sécurité, Systèmes et Réseaux)
- **Digital Design** (1ère année, UI Designer, UX Designer)
- **Intelligence Artificielle** (1ère année, Assistant Data Analyst, Développeur Chatbots)

> 📊 **Volume total de données générées :**
> - **5 formateurs** et **~370 stagiaires** (répartis de manière homogène entre 17 et 20 stagiaires par classe).
> - **~48 présentations** créées automatiquement avec des sujets adaptés à chaque filière (ex: *React JS et les Hooks*, *Sécurité des réseaux et Pare-feu*, *Design Systems sous Figma*, *Intégration d'API LLM & LangChain*).

---

## 🚀 Installation & Configuration

### Prérequis indispensables
- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x & npm
- Base de données locale (SQLite par défaut)

### Étapes d'installation

```bash
# 1. Cloner le dépôt et se placer dans le projet
git clone https://github.com/Khadiijama/ofppt-gestion-presentations.git
cd ofppt-gestion-presentations

# 2. Configurer le fichier d'environnement
cp .env.example .env

# 3. Créer la base de données SQLite (si configuré en SQLite dans .env)
# Sous Windows (PowerShell) :
New-Item -ItemType File -Path database/database.sqlite -Force
# Sous Linux / macOS :
touch database/database.sqlite

# 4. Installer les dépendances, générer la clé d'application et compiler le frontend (Recommandé)
composer setup

# 5. Lancer les migrations et charger les données de démonstration (Seeders)
php artisan db:seed

# 6. Démarrer les serveurs de développement (Laravel + Vite) en simultané
composer dev
```

*Note : La commande `composer dev` lance de façon optimisée et en arrière-plan le serveur web PHP artisan (`http://localhost:8000`), le hot-reload de Vite (`http://localhost:5173`) ainsi que le suivi des files d'attente.*

---

## 🔑 Comptes de test préconfigurés

Tous les comptes créés par le seeder utilisent le mot de passe générique **`password`**.

| Rôle | Email de connexion | Mot de passe |
|---|---|---|
| **Formateur de test** | `formateur@ofppt.ma` | `password` |
| **Stagiaire de test** | `stagiaire@ofppt.ma` | `password` |

---

## 📁 Structure globale du projet

```
gestion_presentations/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/          # Contrôleurs API (Auth, Classe, Dashboard, Presentation, Upload)
│   │   └── Middleware/       # Middleware CheckRole.php (contrôle d'accès formateur/stagiaire)
│   └── Models/
│       ├── User.php          # Modèle Utilisateur (avec méthodes isFormateur() et isStagiaire())
│       ├── Classe.php        # Modèle Classe (filière, association formateur & stagiaires)
│       ├── Presentation.php  # Modèle Présentation (sujets et dates limites)
│       ├── Assignation.php   # Modèle Pivot d'assignation individuelle
│       └── Upload.php        # Modèle de fichier de rendu stagiaire
├── bootstrap/
│   └── app.php               # Configuration de l'application (liaison du middleware 'role')
├── database/
│   ├── migrations/           # Définition des structures de tables SQL (9 migrations)
│   └── seeders/
│       └── DatabaseSeeder.php  # Alimentation de démonstration (CMC Rabat)
├── resources/
│   ├── js/
│   │   ├── components/       # Composants partagés (ex: Navbar.jsx)
│   │   ├── pages/            # Écrans (Home, Login, Register, FormateurDashboard, StagiaireDashboard)
│   │   ├── api.js            # Configuration d'Axios (intercepteurs, base URL, Bearer Token)
│   │   └── MainApp.jsx       # Point d'entrée React avec routage client (React Router 7)
│   └── css/
│       └── app.css           # Thème Tailwind CSS v4 personnalisé
├── routes/
│   ├── api.php               # Endpoints REST API sécurisés par Laravel Sanctum
│   └── web.php               # Route de redirection SPA globale vers welcome.blade.php
└── vite.config.js            # Configuration du bundler Vite (React + Tailwind CSS)
```

---

## 🔌 Répertoire des Endpoints API

Toutes les routes ci-dessous (sauf Public) requièrent l'envoi du header `Authorization: Bearer <token_sanctum>`.

| Méthode | Endpoint | Description | Rôle requis |
|---|---|---|---|
| **Authentification & Session** | | | |
| `POST` | `/api/register` | Inscription d'un nouveau compte | Public |
| `POST` | `/api/login` | Authentification et retour du token | Public |
| `POST` | `/api/logout` | Révocation du token courant | Authentifié |
| `GET` | `/api/user` | Informations du profil connecté | Authentifié |
| `GET` | `/api/dashboard` | Statistiques adaptées au rôle de l'utilisateur | Authentifié |
| **Gestion des Classes** | | | |
| `GET` | `/api/classes` | Récupérer la liste des classes gérées | Formateur |
| `POST` | `/api/classes` | Créer une nouvelle classe | Formateur |
| `GET` | `/api/classes/{id}` | Détails d'une classe (stagiaires + présentations) | Formateur |
| `PUT` | `/api/classes/{id}` | Modifier le nom ou la filière d'une classe | Formateur |
| `DELETE` | `/api/classes/{id}` | Supprimer une classe | Formateur |
| **Gestion des Stagiaires** | | | |
| `GET` | `/api/stagiaires` | Liste de tous les stagiaires libres (sans classe) | Formateur |
| `POST` | `/api/classes/{id}/stagiaires` | Affecter un stagiaire existant à la classe | Formateur |
| `DELETE` | `/api/classes/{classeId}/stagiaires/{stagiaireId}` | Retirer un stagiaire de la classe | Formateur |
| **Gestion des Présentations** | | | |
| `GET` | `/api/presentations` | Présentations créées (Formateur) ou assignées (Stagiaire) | Commun |
| `POST` | `/api/presentations` | Créer une présentation et l'assigner à toute une classe | Formateur |
| `GET` | `/api/presentations/{id}` | Détails d'une présentation | Commun |
| `PUT` | `/api/presentations/{id}` | Modifier le sujet ou la date/heure limite | Formateur |
| `DELETE` | `/api/presentations/{id}` | Supprimer une présentation (fichiers inclus) | Formateur |
| **Gestion des Rendus (Fichiers)** | | | |
| `POST` | `/api/presentations/{id}/upload` | Soumettre ou écraser un fichier rendu | Stagiaire |
| `GET` | `/api/uploads/{id}/download` | Télécharger un fichier d'exposé soumis | Commun |
| `DELETE` | `/api/uploads/{id}` | Supprimer un livrable | Commun |

---

## 🏢 À propos de l'OFPPT & CMC

L'**Office de la Formation Professionnelle et de la Promotion du Travail (OFPPT)** est le principal opérateur de formation publique au Maroc. Ses nouveaux **Centres de Métiers et de Compétences (CMC)** proposent des formations de pointe axées sur la digitalisation, l'innovation pédagogique, et l'apprentissage par projet, notamment pour les filières du Pôle Digital.

---

## 📄 Licence

Projet académique — OFPPT CMC © 2026

# 🎓 Gestion des Présentations OFPPT

> **Plateforme de gestion et de suivi des présentations pédagogiques pour les Centres de Métiers et de Compétences (CMC) de l'OFPPT.**

🔗 **Dépôt GitHub :** [https://github.com/Khadiijama/ofppt-gestion-presentations](https://github.com/Khadiijama/ofppt-gestion-presentations)

---

## 📌 À propos du projet

**Gestion des Présentations OFPPT** est une application web full-stack conçue pour digitaliser et simplifier le processus de gestion des exposés et présentations dans les établissements de formation professionnelle de l'OFPPT (Office de la Formation Professionnelle et de la Promotion du Travail).

L'application permet aux **formateurs** de créer des présentations, de les assigner à leurs classes, et de suivre les soumissions des stagiaires. Les **stagiaires** peuvent consulter les présentations qui leur sont assignées, soumettre leurs fichiers, et suivre leurs deadlines.

---

## 🏗️ Architecture

| Couche | Technologie |
|---|---|
| Backend / API | **Laravel 11** (PHP 8.2+) |
| Frontend | **React 18** (via Vite + Inertia-like SPA) |
| Base de données | **SQLite** (dev) / MySQL (prod) |
| Authentification | **Laravel Sanctum** (tokens API) |
| Styles | **CSS3** Vanilla (design OFPPT) |

---

## ✨ Fonctionnalités

### 👨‍🏫 Formateur
- Tableau de bord avec vue d'ensemble des classes et présentations
- Création, modification et suppression de présentations
- Assignation automatique des présentations à toute une classe
- Suivi des soumissions par stagiaire (remis / en attente)
- Gestion des deadlines avec alertes visuelles

### 🎓 Stagiaire
- Tableau de bord personnalisé avec les présentations assignées
- Visualisation des détails et des consignes de chaque présentation
- Soumission de fichiers (PDF, PPTX, DOCX…)
- Statut en temps réel : **En attente** / **Soumis**
- Historique des soumissions

---

## 🗄️ Structure de la base de données

### Tables principales

| Table | Description |
|---|---|
| `users` | Formateurs et Stagiaires (rôle : `formateur` / `stagiaire`) |
| `classes` | Classes de formation (filière, formateur responsable) |
| `classe_stagiaire` | Pivot — appartenance d'un stagiaire à une classe |
| `presentations` | Sujets de présentation créés par les formateurs |
| `assignations` | Attribution d'une présentation à un stagiaire |
| `uploads` | Fichiers soumis par les stagiaires |

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

Le seeder inclut des données réalistes basées sur les établissements CMC de l'OFPPT :

### 👨‍🏫 Formateurs (5)

| Nom | Email | Établissement |
|---|---|---|
| Ahmed Bennani | **formateur@ofppt.ma** | CMC Rabat |
| Fatima Zahra Alaoui | fz.alaoui@ofppt.ma | CMC Rabat |
| Khalid Moujahid | k.moujahid@ofppt.ma | CMC Rabat |
| Nadia Cherkaoui | n.cherkaoui@ofppt.ma | CMC Rabat |
| Youssef Ezzahiri | y.ezzahiri@ofppt.ma | CMC Rabat |

### 🏫 Classes (20)

| Classe | Filière | Établissement | Formateur |
|---|---|---|---|
| `DEVD101` | Développement Digital (1ère année) | CMC Rabat | Ahmed Bennani |
| `DEVOWFS201` | Développement Digital option Web Full Stack (2ème année) | CMC Rabat | Ahmed Bennani |
| `DEVOWFS202` | Développement Digital option Web Full Stack (2ème année) | CMC Rabat | Ahmed Bennani |
| `DEVOAM201` | Développement Digital option Applications Mobiles (2ème année) | CMC Rabat | Ahmed Bennani |
| `DEVD102` | Développement Digital (1ère année) | CMC Rabat | Fatima Z. Alaoui |
| `DEVOWFS203` | Développement Digital option Web Full Stack (2ème année) | CMC Rabat | Fatima Z. Alaoui |
| `DEVOWFS204` | Développement Digital option Web Full Stack (2ème année) | CMC Rabat | Fatima Z. Alaoui |
| `DEVOAM202` | Développement Digital option Applications Mobiles (2ème année) | CMC Rabat | Fatima Z. Alaoui |
| `INFRD101` | Infrastructure Digitale (1ère année) | CMC Rabat | Khalid Moujahid |
| `INFRD102` | Infrastructure Digitale (1ère année) | CMC Rabat | Khalid Moujahid |
| `IDCS201` | Infrastructure Digitale option Cyber sécurité (2ème année) | CMC Rabat | Khalid Moujahid |
| `IDSR201` | Infrastructure Digitale option Systèmes et Réseaux (2ème année) | CMC Rabat | Khalid Moujahid |
| `DIGD101` | Digital Design (1ère année) | CMC Rabat | Nadia Cherkaoui |
| `DIGD102` | Digital Design (1ère année) | CMC Rabat | Nadia Cherkaoui |
| `DIGDUI201` | Digital Design option UI Designer (2ème année) | CMC Rabat | Nadia Cherkaoui |
| `DIGDUX201` | Digital Design option UX Designer (2ème année) | CMC Rabat | Nadia Cherkaoui |
| `IA101` | Intelligence Artificielle (1ère année) | CMC Rabat | Youssef Ezzahiri |
| `IA102` | Intelligence Artificielle (1ère année) | CMC Rabat | Youssef Ezzahiri |
| `IAAD201` | Intelligence Artificielle option Assistant Data Analyst (2ème année) | CMC Rabat | Youssef Ezzahiri |
| `IADC201` | Intelligence Artificielle option Développeur Chatbots (2ème année) | CMC Rabat | Youssef Ezzahiri |

> **Total : ~370 stagiaires** répartis dans 20 classes (entre 17 et 20 stagiaires par classe), gérées par 5 formateurs à la CMC Rabat.

### 📋 Présentations (Sujets type)

Les présentations sont générées dynamiquement en fonction de la filière de la classe (2 à 3 sujets par classe, par exemple : *Introduction à Laravel 11* et *React JS et les Hooks* pour le Web Full Stack, *Sécurité des réseaux* pour la Cybersécurité, etc.).

---

## 🚀 Installation

### Prérequis

- **PHP** >= 8.2
- **Composer** >= 2.x
- **Node.js** >= 18.x & npm
- Base de données : SQLite (inclus), MySQL ou PostgreSQL

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Khadiijama/ofppt-gestion-presentations.git
cd ofppt-gestion-presentations

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JavaScript
npm install

# 4. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 5. Configurer la base de données dans .env
# Pour SQLite (par défaut) :
# DB_CONNECTION=sqlite

# 6. Lancer les migrations et les seeders
php artisan migrate:fresh --seed

# 7. Démarrer les serveurs de développement
php artisan serve        # Backend  → http://localhost:8000
npm run dev              # Frontend → http://localhost:5173
```

---

## 🔑 Comptes de test

| Rôle | Email | Mot de passe |
|---|---|---|
| **Formateur** | `formateur@ofppt.ma` | `password` |
| **Stagiaire** | `stagiaire@ofppt.ma` | `password` |

> Tous les autres comptes utilisent également le mot de passe `password`.

---

## 📁 Structure du projet

```
gestion_presentations/
├── app/
│   ├── Http/
│   │   ├── Controllers/      # AuthController, ClasseController, PresentationController…
│   │   └── Middleware/       # RoleMiddleware (formateur / stagiaire)
│   └── Models/
│       ├── User.php          # Formateurs & Stagiaires
│       ├── Classe.php        # Classes de formation
│       ├── Presentation.php  # Sujets de présentation
│       ├── Assignation.php   # Assignation stagiaire ↔ présentation
│       └── Upload.php        # Soumissions de fichiers
├── database/
│   ├── migrations/           # Schéma de la base de données
│   └── seeders/
│       └── DatabaseSeeder.php  # 92 stagiaires, 5 classes, 16 présentations
├── resources/
│   ├── js/
│   │   ├── pages/            # Home, Login, Register, FormateurDashboard, StagiaireDashboard
│   │   └── components/       # Navbar, Cards, …
│   └── css/
│       └── app.css           # Design OFPPT
└── routes/
    └── api.php               # Endpoints API REST
```

---

## 🔌 API Endpoints principaux

| Méthode | Endpoint | Description | Accès |
|---|---|---|---|
| `POST` | `/api/register` | Inscription | Public |
| `POST` | `/api/login` | Connexion | Public |
| `POST` | `/api/logout` | Déconnexion | Authentifié |
| `GET` | `/api/user` | Profil utilisateur | Authentifié |
| `GET` | `/api/classes` | Liste des classes | Formateur |
| `POST` | `/api/classes` | Créer une classe | Formateur |
| `GET` | `/api/presentations` | Mes présentations | Formateur |
| `POST` | `/api/presentations` | Créer une présentation | Formateur |
| `GET` | `/api/stagiaire/presentations` | Mes présentations assignées | Stagiaire |
| `POST` | `/api/stagiaire/upload/{assignation}` | Soumettre un fichier | Stagiaire |

---

## 🏢 À propos de l'OFPPT

L'**Office de la Formation Professionnelle et de la Promotion du Travail** est l'opérateur principal de la formation professionnelle au Maroc. Les **CMC (Centres de Métiers et de Compétences)** sont ses établissements phares proposant des formations **Bac+2** dans les secteurs numériques et technologiques :

- 🖥️ **Développement Digital** (Web Full Stack, Data Science)
- 🌐 **Infrastructure Digitale**
- 🔐 **Cybersécurité**

---

## 🛠️ Technologies utilisées

| Outil | Version | Usage |
|---|---|---|
| [Laravel](https://laravel.com/) | 11.x | Framework backend / API |
| [React](https://react.dev/) | 18.x | Interface utilisateur |
| [Vite](https://vitejs.dev/) | 5.x | Bundler frontend |
| [Laravel Sanctum](https://laravel.com/docs/sanctum) | 4.x | Authentification par tokens |
| [SQLite](https://www.sqlite.org/) | 3.x | Base de données (développement) |

---

## 📄 Licence

Projet académique — OFPPT CMC © 2024

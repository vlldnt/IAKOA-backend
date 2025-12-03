# Structure du projet IAKOA Backend

## Arborescence racine

```
IAKOA-backend/
├── backend/                       # Dossier principal de l'application NestJS
├── documentation/                 # Documentation du projet
│   ├── Classes.md                 # Modèles de données et schémas
│   ├── journal_de_bord.md         # Journal de développement
│   ├── Lancement.md               # Guide de démarrage
│   └── Structure.md               # Ce fichier
├── .git/                          # Dépôt Git
├── .gitignore                     # Fichiers à ignorer par Git
└── README.md                      # Introduction du projet
```

## Structure backend/

```
backend/
├── prisma/
│   ├── schema.prisma              # Schéma de la base de données Prisma
│   ├── migrations/                # Migrations de la base de données
│   └── prisma.config.ts           # Configuration Prisma personnalisée
│
├── src/
│   ├── app.module.ts              # Module principal de l'application
│   ├── main.ts                    # Point d'entrée de l'application
│   │
│   ├── health.controller.ts       # Controller pour vérifier l'état de l'API
│   │
│   ├── prisma/                    # Module Prisma
│   │   ├── prisma.module.ts       # Configuration du module Prisma
│   │   └── prisma.service.ts      # Service de connexion à la base de données
│   │
│   ├── auth/                      # Module d'authentification
│   │   ├── auth.module.ts         # Configuration du module Auth
│   │   ├── auth.controller.ts     # Routes d'authentification
│   │   ├── auth.service.ts        # Logique d'authentification (JWT, bcrypt)
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts              # Stratégie JWT pour les access tokens
│   │   │   └── jwt-refresh.strategy.ts     # Stratégie JWT pour les refresh tokens
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts           # Guard pour protéger les routes avec JWT
│   │   │   ├── jwt-refresh-auth.guard.ts   # Guard pour les refresh tokens
│   │   │   └── roles.guard.ts              # Guard pour la vérification des rôles (USER/ADMIN)
│   │   └── decorators/
│   │       ├── get-user.decorator.ts        # Décorateur pour récupérer l'utilisateur courant
│   │       └── roles.decorator.ts           # Décorateur pour définir les rôles requis
│   │
│   ├── users/                     # Module Users (CRUD)
│   │   ├── users.module.ts        # Configuration du module Users
│   │   ├── users.controller.ts    # Routes CRUD des utilisateurs
│   │   ├── users.service.ts       # Logique métier des utilisateurs
│   │   └── dto/
│   │       ├── create-user.dto.ts       # DTO pour créer un utilisateur
│   │       ├── update-user.dto.ts       # DTO pour mettre à jour un utilisateur
│   │       ├── login-user.dto.ts        # DTO pour la connexion
│   │       ├── user-response.dto.ts     # DTO de réponse (sans password)
│   │       └── index.ts                 # Export des DTOs
│   │
│   ├── companies/                 # Module Companies (CRUD)
│   │   ├── companies.module.ts    # Configuration du module Companies
│   │   ├── companies.controller.ts # Routes CRUD des compagnies
│   │   ├── companies.service.ts   # Logique métier des compagnies
│   │   └── dto/
│   │       ├── create-company.dto.ts        # DTO pour créer une compagnie
│   │       ├── update-company.dto.ts        # DTO pour mettre à jour une compagnie
│   │       ├── company-response.dto.ts      # DTO de réponse
│   │       └── social-networks.dto.ts       # DTO pour les réseaux sociaux
│   │
│   ├── events/                    # Module Events (CRUD)
│   │   ├── events.module.ts       # Configuration du module Events
│   │   ├── events.controller.ts   # Routes CRUD des événements
│   │   ├── events.service.ts      # Logique métier des événements
│   │   └── dto/
│   │       ├── create-event.dto.ts          # DTO pour créer un événement (avec médias optionnels)
│   │       ├── update-event.dto.ts          # DTO pour mettre à jour un événement
│   │       └── event-response.dto.ts        # DTO de réponse (avec médias inclus)
│   │
│   └── media/                     # Module Media
│       ├── media.module.ts        # Configuration du module Media
│       ├── media.service.ts       # Logique métier des médias
│       └── dto/
│           ├── create-media.dto.ts          # DTO pour créer un média
│           └── media-response.dto.ts        # DTO de réponse pour un média
│
├── test/                          # Tests end-to-end
│   └── ...
│
├── node_modules/                  # Dépendances npm
├── dist/                          # Build de production
│
├── .env                           # Variables d'environnement (ne pas committer)
├── .env.example                   # Exemple de configuration
├── .gitignore                     # Fichiers à ignorer par git
│
├── package.json                   # Dépendances et scripts npm
├── package-lock.json              # Lockfile des dépendances
├── tsconfig.json                  # Configuration TypeScript
├── tsconfig.build.json            # Configuration TypeScript pour le build
├── nest-cli.json                  # Configuration NestJS CLI
├── eslint.config.mjs              # Configuration ESLint
├── .prettierrc                    # Configuration Prettier
└── README.md                      # Documentation backend
```

## Routes API disponibles

### Health Check
- `GET /health` - Vérifier l'état de l'API (status, timestamp, uptime)

### Authentification
- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur (retourne access + refresh tokens)
- `POST /auth/refresh` - Rafraîchir l'access token (nécessite refresh token)
- `POST /auth/logout` - Déconnexion utilisateur (invalide le refresh token)

### Users CRUD (🔒 Protégé par JWT)
- `POST /users` - Créer un utilisateur (création administrative)
- `GET /users` - Liste tous les utilisateurs
- `GET /users/:id` - Récupérer un utilisateur par ID
- `PATCH /users/:id` - Mettre à jour un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

### Companies CRUD (🔒 Protégé par JWT)
- `POST /companies` - Créer une compagnie
- `GET /companies` - Liste toutes les compagnies
- `GET /companies/:id` - Récupérer une compagnie par ID
- `PATCH /companies/:id` - Mettre à jour une compagnie
- `DELETE /companies/:id` - Supprimer une compagnie
- `GET /companies/:id/events` - Récupérer les événements d'une compagnie

### Events CRUD (🔒 Protégé par JWT)
- `POST /events` - Créer un événement (avec médias optionnels)
- `GET /events` - Liste tous les événements
- `GET /events/:id` - Récupérer un événement par ID (avec médias)
- `PATCH /events/:id` - Mettre à jour un événement
- `DELETE /events/:id` - Supprimer un événement

## Technologies utilisées

- **NestJS** - Framework Node.js
- **TypeScript** - Langage principal
- **Prisma** - ORM pour PostgreSQL
- **PostgreSQL** - Base de données
- **JWT** - Authentification (access + refresh tokens)
- **bcrypt** - Hashage des mots de passe
- **class-validator** - Validation des DTOs
- **class-transformer** - Transformation des objets
- **Swagger/OpenAPI** - Documentation API interactive

***Mis à jour le 03/12/2025***
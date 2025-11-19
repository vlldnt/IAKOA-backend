# Structure du projet IAKOA Backend

```
backend/
├── prisma/
│   ├── schema.prisma              # Schéma de la base de données Prisma
│   └── migrations/                # Migrations de la base de données
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
│   │   │   └── jwt-refresh-auth.guard.ts   # Guard pour les refresh tokens
│   │   └── decorators/
│   │       └── get-user.decorator.ts        # Décorateur pour récupérer l'utilisateur courant
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
│   └── events/                    # Module Events (CRUD)
│       ├── events.module.ts       # Configuration du module Events
│       ├── events.controller.ts   # Routes CRUD des événements
│       ├── events.service.ts      # Logique métier des événements
│       └── dto/
│           ├── create-event.dto.ts      # DTO pour créer un événement
│           └── update-event.dto.ts      # DTO pour mettre à jour un événement
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
└── nest-cli.json                  # Configuration NestJS CLI
```

## Routes disponibles

### Authentification
- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/login` - Connexion utilisateur (retourne access + refresh tokens)
- `POST /auth/refresh` - Rafraîchir l'access token (nécessite refresh token)
- `POST /auth/logout` - Déconnexion utilisateur (invalide le refresh token)

### Users CRUD
- `POST /users` - Créer un utilisateur (création administrative)
- `GET /users` - Liste tous les utilisateurs
- `GET /users/:id` - Récupérer un utilisateur par ID
- `PATCH /users/:id` - Mettre à jour un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

### Events CRUD
- `POST /events` - Créer un événement
- `GET /events` - Liste tous les événements
- `GET /events/:id` - Récupérer un événement par ID
- `PATCH /events/:id` - Mettre à jour un événement
- `DELETE /events/:id` - Supprimer un événement

### Health Check
- `GET /health` - Vérifier l'état de l'API (status, timestamp, uptime)

***Mis à jour le 18/11/25***
# Journal de bord - IAKOA Backend

## 18/11/2025

- Création du projet IAKOA-backend
- Mise en place d'un journal de bord
- Début avec NestJS : installation du projet
- Mise en place de l’authentification
- Configuration du module User
- Intégration de PostgreSQL via l’ORM Prisma

---

## 19/11/2025

- Implémentation du module Events avec opérations CRUD
- Mise à jour du schéma Prisma
- Ajout du `HealthController` pour l’endpoint `/health`
- Implémentation de la fonctionnalité de refresh token JWT
- Mise à jour du modèle User pour inclure le champ `refreshToken`
- Ajout de la gestion des refresh tokens dans `AuthController`
- Mise à jour des stratégies et guards JWT pour les refresh tokens
- Mise à jour des variables d’environnement pour les secrets JWT
- Migration de la base de données pour le nouveau schéma utilisateur
- Nettoyage des fichiers d’entité utilisateur non utilisés
- Fix : conservation de `/auth/login`

---

## 21/11/2025

- Conception du modèle `Company` dans `Classes.md` (héritage de `BaseEntity`)
- Définition des propriétés de `Company` : `name`, `ownerId`, `description`, `eventsList`, `socials`, `website`
- Définition des relations : `ownerId` comme FK vers `User.id`, `eventsList` comme liste de FK vers `Event.id`
- Ajustement du modèle `User` pour lier les compagnies via la liste `companies` (FK vers `Company.id`)
- Réflexion sur la scalabilité des relations (utilisation future de tables de liaison User-Company / User-Event)

---

## 28/11/2025

- Implémentation du module `Company` : contrôleur, service et repository avec opérations CRUD
- Mise à jour du schéma Prisma : ajout du modèle `Company`, relations vers `User` et `Event` ; migration appliquée
- Ajout des DTOs et validation (class-validator) pour les endpoints Company
- Écriture de tests unitaires basiques pour Company (service + controller)
- Exposition d'une route publique pour récupérer les événements d'une company
- Optimisation des requêtes Prisma (utilisation de `include` pour réduire les appels)
- Refactor : suppression des entités legacy et nettoyage de l'arborescence
- Mise à jour de la documentation (Classes.md + journal) pour inclure Company
- Corrections mineures : gestion des erreurs Prisma et normalisation du format des dates
- Mise à jour des notes de déploiement et des variables d'environnement nécessaires pour la migration

---

## 02/12/2025

- Configuration initiale de la base de données PostgreSQL
- Création de l'utilisateur `iakoa_dev` et de la base de données `iakoa-backend` pour docker-mac
- Génération du client Prisma TypeScript (v7.0.1)
- Vérification de la structure complète de la base de données (6 tables : users, companies, events, media, user_favorites, _prisma_migrations)
- Création du guide de lancement complet dans `Lancement.md`
- Base de données maintenant fonctionnelle et synchronisée avec le schéma Prisma

---

## 03/12/2025

- Implémentation complète du module `Events` (controller, service, DTOs) avec opérations CRUD et documentation Swagger
- Implémentation du module `Media` (service, DTOs) pour gérer les médias liés aux événements
- Intégration Events-Media : support des médias optionnels lors de la création d'événements avec logique transactionnelle
- Mise à jour du schéma Prisma : migration pour augmenter la longueur du champ `description` de Event à 5000 caractères
- Configuration des modules NestJS avec imports et exports nécessaires
- Adding a planification for API tests `Test_routes.md`
- Implémentation du module UserFavorites : CRUD complet avec 7 endpoints (ajout/suppression/consultation/comptage de favoris), DTOs validés, contrainte unique (userId + eventId)
- Système de contrôle d'accès robuste : vérification isCreator pour création d'entreprises, validation de propriété (companies/events/media), guards RolesGuard avec messages d'erreur en français (403 Forbidden), endpoints admin-only (GET /users, GET /companies), et endpoints personnels (/my-companies, /my-events)
- Endpoints publics pour consultation : GET /events, GET /events/:id et GET /media/:eventId accessibles sans authentification pour permettre la navigation publique des événements et médias sur le site/app mobile

---

## 04/12/2025

- Configuration Jest pour tests unitaires avec base de données de test séparée (iakoa-tests)
- Implémentation complète des tests d'authentification : 34 tests (service + controller) couvrant register, login, refresh token, validation des DTOs, gestion des erreurs


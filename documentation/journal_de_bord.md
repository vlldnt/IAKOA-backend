# Journal de bord - IAKOA Backend

## 18/11/2025

### Tâches accomplies
- Création du projet IAKOA-backend
- Mise en place d'un journal de bord
- Début avec NestJS : installation du projet
- Mise en place de l’authentification
- Configuration du module User
- Intégration de PostgreSQL via l’ORM Prisma

---

## 19/11/2025

### Tâches accomplies
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

### Tâches accomplies
- Conception du modèle `Company` dans `Classes.md` (héritage de `BaseEntity`)
- Définition des propriétés de `Company` : `name`, `ownerId`, `description`, `eventsList`, `socials`, `website`
- Définition des relations : `ownerId` comme FK vers `User.id`, `eventsList` comme liste de FK vers `Event.id`
- Ajustement du modèle `User` pour lier les compagnies via la liste `companies` (FK vers `Company.id`)
- Réflexion sur la scalabilité des relations (utilisation future de tables de liaison User-Company / User-Event)


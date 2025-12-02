# Classes et Modules

## BaseEntity

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `id` | UUID | Auto-généré, unique |
| `createdAt` | Timestamp(3) with timezone | Auto-généré à la création |
| `updatedAt` | Timestamp(3) with timezone | Auto-mis à jour |

---

## User (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `name` | String | Max 30 caractères |
| `password` | String | Hashé avec bcrypt |
| `email` | String | Unique, indexé, Regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` |
| `role` | Enum(Role) | `USER` ou `ADMIN`, par défaut: `USER`, indexé |
| `isCreator` | Boolean | Par défaut: false, indexé |
| `refreshToken` | String | Nullable, pour l'authentification JWT |
| `companies` | Company[] | Relation vers Company (un user peut posséder plusieurs companies) |
| `userFavorites` | UserFavorite[] | Relation vers UserFavorite (favoris de l'utilisateur) |

---

## Company (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `name` | String | Max 100 caractères |
| `description` | String | Max 300 caractères, nullable |
| `website` | String | URL valide, nullable |
| `socialNetworks` | JSON | Objet JSONB pour stocker les réseaux sociaux, nullable |
| `siren` | String | Exactement 9 caractères, unique, indexé |
| `isValidated` | Boolean | Par défaut: false, indexé |
| `ownerId` | UUID | FK vers User.id, indexé |
| `owner` | User | Relation vers User (propriétaire de la company) |
| `events` | Event[] | Relation vers Event (événements organisés par la company) |

**Relations :**
- Cascade DELETE/UPDATE : si le user propriétaire est supprimé, la company est supprimée

---

## Event (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `name` | String | Max 100 caractères |
| `date` | Timestamp(3) with timezone | Date de l'événement, indexé |
| `description` | String | Max 1000 caractères |
| `pricing` | Int | Min 0 (0 = gratuit), par défaut: 0, indexé |
| `location` | JSON | Objet JSONB pour coordonnées géographiques `{lat: Number, lon: Number}` |
| `companyId` | UUID | FK vers Company.id, indexé |
| `website` | String | URL valide, nullable |
| `company` | Company | Relation vers Company (organisateur de l'événement) |
| `media` | Media[] | Relation vers Media (médias associés à l'événement) |
| `userFavorites` | UserFavorite[] | Relation vers UserFavorite (utilisateurs qui ont mis en favori) |

**Relations :**
- Cascade DELETE/UPDATE : si la company est supprimée, l'événement est supprimé

---

## Media (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `url` | String | URL de l'image/vidéo |
| `type` | String | Type de média (image, video, etc.), max 50 caractères, indexé |
| `eventId` | UUID | FK vers Event.id, indexé |
| `event` | Event | Relation vers Event (événement associé) |

**Relations :**
- Cascade DELETE/UPDATE : si l'événement est supprimé, le média est supprimé

---

## UserFavorite (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `userId` | UUID | FK vers User.id, indexé |
| `eventId` | UUID | FK vers Event.id, indexé |
| `user` | User | Relation vers User |
| `event` | Event | Relation vers Event |

**Contraintes :**
- Unique constraint sur la paire `(userId, eventId)` : un utilisateur ne peut pas ajouter deux fois le même événement en favori

**Relations :**
- Cascade DELETE/UPDATE : si le user ou l'événement est supprimé, le favori est supprimé

---

## Enum Role

| Valeur | Description |
|--------|-------------|
| `USER` | Utilisateur standard |
| `ADMIN` | Administrateur |

---

## Base de données Dev

### Connexion à la base de données

```bash
# Configuration actuelle (WSL/Linux/Mac)
PGPASSWORD=Awlmpzw12 psql -h 127.0.0.1 -p 5432 -U iakoa_dev -d iakoa-backend

# Ou sans mot de passe dans la commande
psql -h 127.0.0.1 -p 5432 -U iakoa_dev -d iakoa-backend
# (puis entrer le mot de passe : Awlmpzw12)
```

### Informations de connexion

- **Hôte :** 127.0.0.1
- **Port :** 5432
- **Utilisateur :** iakoa_dev
- **Mot de passe :** Awlmpzw12
- **Base de données :** iakoa-backend

### Commandes utiles

```bash
# Voir toutes les tables
\dt

# Voir la structure d'une table
\d users
\d companies
\d events

# Voir les types enum
\dT

# Quitter
\q
```
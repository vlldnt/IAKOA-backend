# Classes et Modules

## BaseEntity

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `id` | UUID | Auto-généré, unique |
| `createdAt` | Date | Auto-généré à la création |
| `updatedAt` | Date | Auto-mis à jour |

---

## User (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `name` | String | Max 30 caractères |
| `password` | String | Hashé avec bcrypt |
| `email` | String | Regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` |
| `isCreator` | Boolean | Par défaut: false |
| `companies` | [UUID] | FK vers Company.id (liste) |
| `favorites` | [UUID] | FK vers Event.id (liste) |

---

## Company (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `name` | String | Max 100 caractères |
| `ownerId` | UUID | FK vers User.id |
| `description` | String | Max 300 caractères |
| `eventsList` | [UUID] | FK vers Event.id (liste) |
| `socials` | Object | `{facebook?: String, instagram?: String, x?: String, youtube?: String, tiktok?: String}` |
| `website` | String | Regex: `^https?:\/\/.+` (URL valide) |
---

## Event (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `name` | String | Max 100 caractères |
| `description` | String | Max 1000 caractères |
| `date` | Date | Date de l'événement |
| `pricing` | Int | Mini 0 and 0 ! gratuit|
| `location` | Object | `{lat: Number, lon: Number}` Format géographique |
| `owner_id` | UUID | FK vers Company.id |
| `website` | String | Regex: `^https?:\/\/.+` (URL valide) |

---

## Media (hérite de BaseEntity)

| Propriété | Type | Contraintes/Validations |
|-----------|------|--------------------------|
| `url` | String | URL de l'image/vidéo |
| `eventId` | UUID | FK vers Event.id |



---
Databse Dev:

Connection à la db ```psql -U olos -d "IAKOA-backend" ``` wsl
Connection à la db ```psql -U adrienv -d "IAKOA" ``` mac
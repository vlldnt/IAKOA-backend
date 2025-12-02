# Guide de lancement - IAKOA Backend

Ce guide explique comment lancer le projet IAKOA Backend depuis zéro, sans aucune installation préalable.

---

## Raccourci - Commandes essentielles

Pour ceux qui ont déjà installé les prérequis, voici la liste des commandes à exécuter dans l'ordre :

```bash
# 1. Cloner le projet
git clone https://github.com/vlldnt/IAKOA-backend                          # Télécharger le code source
cd IAKOA-backend/backend                         # Naviguer dans le dossier backend

# 2. Configurer PostgreSQL
sudo -u postgres psql                            # Se connecter à PostgreSQL (Linux)
# psql -U postgres                               # Alternative Windows/macOS

# Dans le shell PostgreSQL :
CREATE USER VOTRE_USER WITH PASSWORD 'VOTRE_PASSWORD';                     # Créer l'utilisateur
CREATE DATABASE "VOTRE_DATABASE" OWNER VOTRE_USER;                        # Créer la base de données
GRANT ALL PRIVILEGES ON DATABASE "VOTRE_DATABASE" TO VOTRE_USER;          # Donner les privilèges
\q                                               # Quitter PostgreSQL

# 3. Vérifier la connexion
psql -h VOTRE_ADRESSE -p 5432 -U VOTRE_USER -d VOTRE_DATABASE            # Tester la connexion (entrer VOTRE_PASSWORD)

# 4. Créer le fichier .env
touch .env                                       # Créer le fichier de configuration
# Copier la configuration dans .env (voir section Variables d'environnement)

# 5. Installer les dépendances
npm install                                      # Installer toutes les dépendances Node.js

# 6. Configurer Prisma
npx prisma generate                              # Générer le client Prisma TypeScript
npx prisma migrate dev                           # Appliquer les migrations de base de données (dev)
# npx prisma migrate deploy                      # Alternative pour production

# 7. Lancer le serveur
npm run start:dev                                # Démarrer en mode développement avec hot-reload
# npm run start:prod                             # Alternative pour production (après npm run build)

# 8. Vérifier que ça fonctionne
curl http://localhost:3000/health                # Tester l'endpoint de santé
npx prisma studio                                # Ouvrir l'interface graphique Prisma (optionnel)
```

---

## Prérequis à installer

Avant de commencer, vous devez installer les outils suivants :

### 1. Node.js (version 18+)

**Linux (Ubuntu/Debian) :**
```bash
# Installer via NodeSource (version LTS recommandée)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérifier l'installation
node --version  # Doit afficher v18+ ou v20+
npm --version   # Doit afficher 9+ ou 10+
```

**macOS :**
```bash
# Via Homebrew
brew install node

# Vérifier l'installation
node --version
npm --version
```

**Windows :**
- Télécharger l'installeur depuis [nodejs.org](https://nodejs.org/)
- Exécuter l'installeur et suivre les instructions
- Redémarrer le terminal puis vérifier : `node --version`

---

### 2. PostgreSQL (version 14+)

**Linux (Ubuntu/Debian) :**
```bash
# Installer PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Vérifier l'installation
psql --version
```

**macOS :**
```bash
# Via Homebrew
brew install postgresql@16
brew services start postgresql@16

# Vérifier l'installation
psql --version
```

**Windows :**
- Télécharger l'installeur depuis [postgresql.org](https://www.postgresql.org/download/windows/)
- Exécuter l'installeur (noter le mot de passe postgres)
- Ajouter PostgreSQL au PATH si nécessaire

---

### 3. Git

**Linux (Ubuntu/Debian) :**
```bash
sudo apt install git
```

**macOS :**
```bash
brew install git
```

**Windows :**
- Télécharger depuis [git-scm.com](https://git-scm.com/)

---

## Installation du projet

### Étape 1 : Cloner le repository

```bash
git clone <URL_DU_REPO>
cd IAKOA-backend/backend
```

---

### Étape 2 : Créer la base de données PostgreSQL

```bash
# Se connecter à PostgreSQL en tant que superutilisateur
sudo -u postgres psql

# Ou sur Windows/macOS :
# psql -U postgres
```

Dans le shell PostgreSQL, exécuter :

```sql
-- Créer l'utilisateur
CREATE USER VOTRE_USER WITH PASSWORD 'VOTRE_PASSWORD';

-- Créer la base de données
CREATE DATABASE "VOTRE_DATABASE" OWNER VOTRE_USER;

-- Donner tous les privilèges
GRANT ALL PRIVILEGES ON DATABASE "VOTRE_DATABASE" TO VOTRE_USER;

-- Quitter
\q
```

**Vérifier la connexion :**
```bash
psql -h VOTRE_ADRESSE -p 5432 -U VOTRE_USER -d VOTRE_DATABASE
# Entrer le mot de passe : VOTRE_PASSWORD
# Si vous voyez le prompt psql, c'est bon !
# Taper \q pour quitter
```

---

### Étape 3 : Configurer l'environnement

**Créer le fichier `.env` dans le dossier `backend/` :**

```bash
cd backend
touch .env
```

**Copier cette configuration dans `.env` :**

```env
# Base de données
DATABASE_URL="postgresql://VOTRE_USER:VOTRE_PASSWORD@VOTRE_ADRESSE:5432/VOTRE_DATABASE?schema=public"
PGHOST=VOTRE_ADRESSE
PGPORT=5432
PGUSER=VOTRE_USER
PGPASSWORD=VOTRE_PASSWORD
PGDATABASE=VOTRE_DATABASE

# JWT Secrets (changer en production !)
JWT_SECRET=votre_secret_jwt_super_securise_changez_moi_en_prod
JWT_REFRESH_SECRET=votre_refresh_secret_jwt_super_securise_changez_moi_en_prod

# Serveur
PORT=3000
NODE_ENV=development
```

**Important :** Ne committez jamais ce fichier ! Il doit être dans `.gitignore`.

---

### Étape 4 : Installer les dépendances Node.js

```bash
# Depuis le dossier backend/
npm install
```

Cette commande installe toutes les dépendances listées dans [package.json](../backend/package.json), y compris :
- NestJS
- Prisma
- PostgreSQL client
- JWT / Passport
- Et toutes les dépendances de développement

---

### Étape 5 : Générer le client Prisma

```bash
npx prisma generate
```

Cette commande génère le client TypeScript Prisma basé sur votre schéma de base de données.

---

### Étape 6 : Appliquer les migrations

**Option A : Environnement de production / staging (appliquer les migrations existantes)**
```bash
npx prisma migrate deploy
```

**Option B : Environnement de développement (créer/synchroniser les migrations)**
```bash
npx prisma migrate dev
```

Utilisez l'option B si vous travaillez activement sur le schéma de base de données.

---

### Étape 7 : Vérifier la structure de la base de données

```bash
# Ouvrir Prisma Studio (interface graphique)
npx prisma studio
```

Cela ouvre une interface web sur `http://localhost:5555` où vous pouvez visualiser et modifier vos données.

---

## Lancer le projet

### Mode développement (avec hot-reload)

```bash
npm run start:dev
```

Le serveur démarre sur `http://localhost:3000` et redémarre automatiquement à chaque modification de code.

### Mode production

```bash
# Build du projet
npm run build

# Lancement
npm run start:prod
```

---

## Tester l'API

### Endpoint de santé

```bash
curl http://localhost:3000/health
```

**Réponse attendue :**
```json
{
  "status": "ok"
}
```

### Accéder à la documentation Swagger (si configurée)

Ouvrir dans le navigateur :
```
http://localhost:3000/api
```

---

## Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run start:dev` | Lance le serveur en mode développement avec hot-reload |
| `npm run start:prod` | Lance le serveur en mode production |
| `npm run build` | Compile le projet TypeScript |
| `npm run test` | Lance les tests unitaires |
| `npm run test:e2e` | Lance les tests end-to-end |
| `npm run test:cov` | Lance les tests avec couverture de code |
| `npm run lint` | Vérifie et corrige le code avec ESLint |
| `npx prisma studio` | Ouvre l'interface graphique Prisma |
| `npx prisma migrate dev` | Crée et applique une nouvelle migration |
| `npx prisma migrate deploy` | Applique les migrations existantes |
| `npx prisma generate` | Régénère le client Prisma |

---

## Résolution de problèmes courants

### Erreur : "Cannot connect to database"

**Vérifier que PostgreSQL est démarré :**
```bash
# Linux
sudo systemctl status postgresql

# macOS
brew services list

# Windows
# Vérifier dans Services (services.msc)
```

**Vérifier la connexion manuelle :**
```bash
psql -h VOTRE_ADRESSE -p 5432 -U VOTRE_USER -d VOTRE_DATABASE
```

### Erreur : "Role 'VOTRE_USER' does not exist"

Recréer l'utilisateur PostgreSQL (voir Étape 2).

### Erreur : "Database 'VOTRE_DATABASE' does not exist"

Recréer la base de données (voir Étape 2).

### Erreur : "Property 'user' does not exist on type 'PrismaService'"

Le client Prisma n'a pas été généré. Exécuter :
```bash
npx prisma generate
```

### Port 3000 déjà utilisé

Changer le port dans `.env` :
```env
PORT=3001
```

### Dépendances manquantes après `git pull`

Réinstaller les dépendances et régénérer Prisma :
```bash
npm install
npx prisma generate
```

---

## Workflow quotidien de développement

1. **Démarrer PostgreSQL** (si pas déjà démarré)
   ```bash
   sudo systemctl start postgresql  # Linux
   brew services start postgresql@16  # macOS
   ```

2. **Naviguer vers le projet**
   ```bash
   cd IAKOA-backend/backend
   ```

3. **Mettre à jour le code**
   ```bash
   git pull
   npm install  # Si package.json a changé
   npx prisma generate  # Si schema.prisma a changé
   npx prisma migrate dev  # Si de nouvelles migrations existent
   ```

4. **Lancer le serveur**
   ```bash
   npm run start:dev
   ```

---

## Sécurité en production

Avant de déployer en production :

1. **Changer tous les secrets** dans `.env`
   ```bash
   # Générer des secrets forts
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Utiliser des variables d'environnement système** (pas de fichier .env committé)


---

## Ressources utiles

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Prisma](https://www.prisma.io/docs/)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
- [Journal de bord du projet](./journal_de_bord.md)
- [Classes et architecture](./Classes.md)

---

## Support

En cas de problème :
1. Vérifier ce guide de résolution de problèmes
2. Consulter les logs du serveur NestJS
3. Vérifier les logs PostgreSQL
4. Consulter le [journal de bord](./journal_de_bord.md) pour l'historique des modifications

---

**Dernière mise à jour :** 02/12/2025

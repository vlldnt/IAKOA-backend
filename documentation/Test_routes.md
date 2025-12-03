# Test des Routes API - IAKOA Backend

## 📋 Table des matières
- [Authentication (/auth)](#authentication-auth)
- [Users (/users)](#users-users)
- [Companies (/companies)](#companies-companies)
- [Events (/events)](#events-events)
- [Health (/health)](#health-health)

---

## Authentication (/auth)

### POST /auth/register - Inscription d'un nouvel utilisateur

#### ✅ Tests Valides
- [ ] `/auth/register POST` : Inscription avec toutes les données valides : 
- [ ] `/auth/register POST` : Inscription avec nom de 30 caractères (limite max) : 
- [ ] `/auth/register POST` : Inscription avec mot de passe contenant 1 majuscule, 1 chiffre, 1 spécial, 8 caractères : 

#### ❌ Tests d'Erreur
- [ ] `/auth/register POST` : Email au mauvais format (sans @) : 
- [ ] `/auth/register POST` : Email au mauvais format (sans domaine) : 
- [ ] `/auth/register POST` : Email déjà existant dans la base : 
- [ ] `/auth/register POST` : Email null/manquant : 
- [ ] `/auth/register POST` : Nom null/manquant : 
- [ ] `/auth/register POST` : Nom dépassant 30 caractères : 
- [ ] `/auth/register POST` : Nom non string (nombre) : 
- [ ] `/auth/register POST` : Mot de passe null/manquant : 
- [ ] `/auth/register POST` : Mot de passe sans majuscule : 
- [ ] `/auth/register POST` : Mot de passe sans chiffre : 
- [ ] `/auth/register POST` : Mot de passe sans caractère spécial : 
- [ ] `/auth/register POST` : Mot de passe moins de 8 caractères : 
- [ ] `/auth/register POST` : Body vide : 
- [ ] `/auth/register POST` : Body avec champs supplémentaires non autorisés : 

---

### POST /auth/login - Connexion utilisateur

#### ✅ Tests Valides
- [ ] `/auth/login POST` : Connexion avec email et mot de passe corrects : 
- [ ] `/auth/login POST` : Vérification du retour des tokens (accessToken et refreshToken) : 
- [ ] `/auth/login POST` : Vérification du retour des données utilisateur : 

#### ❌ Tests d'Erreur
- [ ] `/auth/login POST` : Email au mauvais format : 
- [ ] `/auth/login POST` : Email null/manquant : 
- [ ] `/auth/login POST` : Email non existant dans la base : 
- [ ] `/auth/login POST` : Mot de passe null/manquant : 
- [ ] `/auth/login POST` : Mot de passe incorrect : 
- [ ] `/auth/login POST` : Mot de passe non string (nombre) : 
- [ ] `/auth/login POST` : Body vide : 
- [ ] `/auth/login POST` : Body avec champs supplémentaires : 

---

### POST /auth/refresh - Rafraîchir l'access token

#### ✅ Tests Valides
- [ ] `/auth/refresh POST` : Refresh avec un refresh token valide : 
- [ ] `/auth/refresh POST` : Vérification du retour des nouveaux tokens : 

#### ❌ Tests d'Erreur
- [ ] `/auth/refresh POST` : Sans header Authorization : 
- [ ] `/auth/refresh POST` : Avec un refresh token expiré : 
- [ ] `/auth/refresh POST` : Avec un refresh token invalide : 
- [ ] `/auth/refresh POST` : Avec un access token au lieu d'un refresh token : 
- [ ] `/auth/refresh POST` : Avec un token malformé : 
- [ ] `/auth/refresh POST` : Avec un token révoqué (après logout) : 

---

### POST /auth/logout - Déconnexion utilisateur

#### ✅ Tests Valides
- [ ] `/auth/logout POST` : Déconnexion avec un token valide : 
- [ ] `/auth/logout POST` : Vérification que le refresh token est invalidé : 

#### ❌ Tests d'Erreur
- [ ] `/auth/logout POST` : Sans header Authorization : 
- [ ] `/auth/logout POST` : Avec un token expiré : 
- [ ] `/auth/logout POST` : Avec un token invalide : 
- [ ] `/auth/logout POST` : Avec un token malformé : 

---

## Users (/users)

### POST /users - Créer un nouvel utilisateur (création administrative)

#### ✅ Tests Valides
- [ ] `/users POST` : Création avec toutes les données valides : 
- [ ] `/users POST` : Création avec isCreator = true : 
- [ ] `/users POST` : Création avec isCreator = false : 
- [ ] `/users POST` : Création sans isCreator (optionnel) : 
- [ ] `/users POST` : Création avec nom de 30 caractères : 

#### ❌ Tests d'Erreur
- [ ] `/users POST` : Email au mauvais format (sans @) : 
- [ ] `/users POST` : Email au mauvais format (sans domaine) : 
- [ ] `/users POST` : Email déjà existant : 
- [ ] `/users POST` : Email null/manquant : 
- [ ] `/users POST` : Nom null/manquant : 
- [ ] `/users POST` : Nom dépassant 30 caractères : 
- [ ] `/users POST` : Nom non string : 
- [ ] `/users POST` : Mot de passe null/manquant : 
- [ ] `/users POST` : Mot de passe sans majuscule : 
- [ ] `/users POST` : Mot de passe sans chiffre : 
- [ ] `/users POST` : Mot de passe sans caractère spécial : 
- [ ] `/users POST` : Mot de passe moins de 8 caractères : 
- [ ] `/users POST` : isCreator non boolean (string) : 
- [ ] `/users POST` : Body vide : 

---

### GET /users - Récupérer tous les utilisateurs

#### ✅ Tests Valides
- [ ] `/users GET` : Récupération de la liste complète : 
- [ ] `/users GET` : Vérification du format de la réponse (tableau) : 
- [ ] `/users GET` : Vérification que le mot de passe n'est pas retourné : 

#### ❌ Tests d'Erreur
- [ ] `/users GET` : Aucun test d'erreur spécifique (endpoint public sans paramètres)

---

### GET /users/:id - Récupérer un utilisateur par ID

#### ✅ Tests Valides
- [ ] `/users/:id GET` : Récupération avec un ID valide existant : 
- [ ] `/users/:id GET` : Vérification du format de la réponse : 
- [ ] `/users/:id GET` : Vérification que le mot de passe n'est pas retourné : 

#### ❌ Tests d'Erreur
- [ ] `/users/:id GET` : ID non existant : 
- [ ] `/users/:id GET` : ID au mauvais format (non UUID) : 
- [ ] `/users/:id GET` : ID null/manquant : 
- [ ] `/users/:id GET` : ID en nombre au lieu de string : 

---

### PATCH /users/:id - Mettre à jour un utilisateur

#### ✅ Tests Valides
- [ ] `/users/:id PATCH` : Mise à jour du nom : 
- [ ] `/users/:id PATCH` : Mise à jour de l'email : 
- [ ] `/users/:id PATCH` : Mise à jour du mot de passe : 
- [ ] `/users/:id PATCH` : Mise à jour de isCreator : 
- [ ] `/users/:id PATCH` : Mise à jour de plusieurs champs en même temps : 
- [ ] `/users/:id PATCH` : Mise à jour avec body vide (aucun champ) : 

#### ❌ Tests d'Erreur
- [ ] `/users/:id PATCH` : ID non existant : 
- [ ] `/users/:id PATCH` : ID au mauvais format : 
- [ ] `/users/:id PATCH` : Email au mauvais format : 
- [ ] `/users/:id PATCH` : Email déjà utilisé par un autre utilisateur : 
- [ ] `/users/:id PATCH` : Nom dépassant 30 caractères : 
- [ ] `/users/:id PATCH` : Nom non string : 
- [ ] `/users/:id PATCH` : Mot de passe sans majuscule : 
- [ ] `/users/:id PATCH` : Mot de passe sans chiffre : 
- [ ] `/users/:id PATCH` : Mot de passe sans caractère spécial : 
- [ ] `/users/:id PATCH` : Mot de passe moins de 8 caractères : 
- [ ] `/users/:id PATCH` : isCreator non boolean : 

---

### DELETE /users/:id - Supprimer un utilisateur

#### ✅ Tests Valides
- [ ] `/users/:id DELETE` : Suppression avec un ID valide existant : 
- [ ] `/users/:id DELETE` : Vérification que l'utilisateur est bien supprimé : 

#### ❌ Tests d'Erreur
- [ ] `/users/:id DELETE` : ID non existant : 
- [ ] `/users/:id DELETE` : ID au mauvais format : 
- [ ] `/users/:id DELETE` : ID null/manquant : 

---

## Companies (/companies)

### POST /companies - Créer une nouvelle entreprise

#### ✅ Tests Valides
- [ ] `/companies POST` : Création avec toutes les données obligatoires : 
- [ ] `/companies POST` : Création avec tous les champs (optionnels inclus) : 
- [ ] `/companies POST` : Création avec SIREN de 9 chiffres : 
- [ ] `/companies POST` : Création avec description de 300 caractères : 
- [ ] `/companies POST` : Création avec website valide : 
- [ ] `/companies POST` : Création avec réseaux sociaux valides : 
- [ ] `/companies POST` : Vérification de l'association avec l'utilisateur connecté : 

#### ❌ Tests d'Erreur
- [ ] `/companies POST` : Sans authentification (pas de token) : 
- [ ] `/companies POST` : Avec token invalide : 
- [ ] `/companies POST` : Avec token expiré : 
- [ ] `/companies POST` : Nom null/manquant : 
- [ ] `/companies POST` : Nom non string : 
- [ ] `/companies POST` : Nom dépassant 100 caractères : 
- [ ] `/companies POST` : SIREN null/manquant : 
- [ ] `/companies POST` : SIREN non string : 
- [ ] `/companies POST` : SIREN avec moins de 9 chiffres : 
- [ ] `/companies POST` : SIREN avec plus de 9 chiffres : 
- [ ] `/companies POST` : SIREN avec des lettres : 
- [ ] `/companies POST` : Description dépassant 300 caractères : 
- [ ] `/companies POST` : Description non string : 
- [ ] `/companies POST` : isValidated non boolean : 
- [ ] `/companies POST` : Website au mauvais format (pas une URL) : 
- [ ] `/companies POST` : Website dépassant 500 caractères : 
- [ ] `/companies POST` : socialNetworks.facebook au mauvais format : 
- [ ] `/companies POST` : socialNetworks.instagram au mauvais format : 
- [ ] `/companies POST` : socialNetworks.x au mauvais format : 
- [ ] `/companies POST` : socialNetworks.youtube au mauvais format : 
- [ ] `/companies POST` : socialNetworks.tiktok au mauvais format : 
- [ ] `/companies POST` : Body vide : 

---

### GET /companies - Récupérer toutes les entreprises

#### ✅ Tests Valides
- [ ] `/companies GET` : Récupération de la liste complète : 
- [ ] `/companies GET` : Vérification du format de la réponse (tableau) : 

#### ❌ Tests d'Erreur
- [ ] `/companies GET` : Aucun test d'erreur spécifique (endpoint public sans paramètres)

---

### GET /companies/my-companies - Récupérer mes entreprises

#### ✅ Tests Valides
- [ ] `/companies/my-companies GET` : Récupération de mes entreprises avec token valide : 
- [ ] `/companies/my-companies GET` : Vérification que seules mes entreprises sont retournées : 

#### ❌ Tests d'Erreur
- [ ] `/companies/my-companies GET` : Sans authentification (pas de token) : 
- [ ] `/companies/my-companies GET` : Avec token invalide : 
- [ ] `/companies/my-companies GET` : Avec token expiré : 

---

### GET /companies/:id - Récupérer une entreprise par ID

#### ✅ Tests Valides
- [ ] `/companies/:id GET` : Récupération avec un ID valide (propriétaire) : 
- [ ] `/companies/:id GET` : Récupération par un admin : 
- [ ] `/companies/:id GET` : Vérification du format de la réponse : 

#### ❌ Tests d'Erreur
- [ ] `/companies/:id GET` : Sans authentification : 
- [ ] `/companies/:id GET` : Avec token invalide : 
- [ ] `/companies/:id GET` : ID non existant : 
- [ ] `/companies/:id GET` : ID au mauvais format : 
- [ ] `/companies/:id GET` : Accès à une entreprise d'un autre utilisateur (non propriétaire, non admin) : 

---

### PATCH /companies/:id - Mettre à jour une entreprise

#### ✅ Tests Valides
- [ ] `/companies/:id PATCH` : Mise à jour du nom (propriétaire) : 
- [ ] `/companies/:id PATCH` : Mise à jour du SIREN (propriétaire) : 
- [ ] `/companies/:id PATCH` : Mise à jour de la description : 
- [ ] `/companies/:id PATCH` : Mise à jour de isValidated (admin) : 
- [ ] `/companies/:id PATCH` : Mise à jour du website : 
- [ ] `/companies/:id PATCH` : Mise à jour des réseaux sociaux : 
- [ ] `/companies/:id PATCH` : Mise à jour de plusieurs champs : 

#### ❌ Tests d'Erreur
- [ ] `/companies/:id PATCH` : Sans authentification : 
- [ ] `/companies/:id PATCH` : Avec token invalide : 
- [ ] `/companies/:id PATCH` : ID non existant : 
- [ ] `/companies/:id PATCH` : ID au mauvais format : 
- [ ] `/companies/:id PATCH` : Accès par un utilisateur non propriétaire (non admin) : 
- [ ] `/companies/:id PATCH` : Nom dépassant 100 caractères : 
- [ ] `/companies/:id PATCH` : SIREN avec format invalide : 
- [ ] `/companies/:id PATCH` : Description dépassant 300 caractères : 
- [ ] `/companies/:id PATCH` : Website au mauvais format : 
- [ ] `/companies/:id PATCH` : Réseaux sociaux au mauvais format : 

---

### DELETE /companies/:id - Supprimer une entreprise

#### ✅ Tests Valides
- [ ] `/companies/:id DELETE` : Suppression par le propriétaire : 
- [ ] `/companies/:id DELETE` : Suppression par un admin : 
- [ ] `/companies/:id DELETE` : Vérification que l'entreprise est bien supprimée : 

#### ❌ Tests d'Erreur
- [ ] `/companies/:id DELETE` : Sans authentification : 
- [ ] `/companies/:id DELETE` : Avec token invalide : 
- [ ] `/companies/:id DELETE` : ID non existant : 
- [ ] `/companies/:id DELETE` : ID au mauvais format : 
- [ ] `/companies/:id DELETE` : Accès par un utilisateur non propriétaire (non admin) : 

---

## Events (/events)

### POST /events - Créer un nouvel événement

#### ✅ Tests Valides
- [ ] `/events POST` : Création avec toutes les données obligatoires : 
- [ ] `/events POST` : Création avec tous les champs (optionnels inclus) : 
- [ ] `/events POST` : Création avec nom de 100 caractères : 
- [ ] `/events POST` : Création avec description de 5000 caractères : 
- [ ] `/events POST` : Création avec pricing = 0 : 
- [ ] `/events POST` : Création avec pricing > 0 : 
- [ ] `/events POST` : Création avec location JSON complexe : 
- [ ] `/events POST` : Création avec website valide : 
- [ ] `/events POST` : Création avec media (array) : 
- [ ] `/events POST` : Création sans media (optionnel) : 

#### ❌ Tests d'Erreur
- [ ] `/events POST` : Nom null/manquant : 
- [ ] `/events POST` : Nom non string : 
- [ ] `/events POST` : Nom dépassant 100 caractères : 
- [ ] `/events POST` : Date null/manquante : 
- [ ] `/events POST` : Date au mauvais format (pas ISO 8601) : 
- [ ] `/events POST` : Date non string : 
- [ ] `/events POST` : Description null/manquante : 
- [ ] `/events POST` : Description non string : 
- [ ] `/events POST` : Description dépassant 5000 caractères : 
- [ ] `/events POST` : Pricing null/manquant : 
- [ ] `/events POST` : Pricing non entier (décimal) : 
- [ ] `/events POST` : Pricing négatif : 
- [ ] `/events POST` : Pricing non numérique (string) : 
- [ ] `/events POST` : Location null/manquante : 
- [ ] `/events POST` : Location non object (string) : 
- [ ] `/events POST` : Location array au lieu d'object : 
- [ ] `/events POST` : CompanyId null/manquant : 
- [ ] `/events POST` : CompanyId non UUID : 
- [ ] `/events POST` : CompanyId non existant : 
- [ ] `/events POST` : Website au mauvais format (pas URL) : 
- [ ] `/events POST` : Media non array (object) : 
- [ ] `/events POST` : Media avec URL invalide : 
- [ ] `/events POST` : Media avec type null : 
- [ ] `/events POST` : Media avec type dépassant 50 caractères : 
- [ ] `/events POST` : Body vide : 

---

### GET /events - Récupérer tous les événements

#### ✅ Tests Valides
- [ ] `/events GET` : Récupération de la liste complète : 
- [ ] `/events GET` : Vérification du format de la réponse (tableau) : 

#### ❌ Tests d'Erreur
- [ ] `/events GET` : Aucun test d'erreur spécifique (endpoint public sans paramètres)

---

### GET /events/:id - Récupérer un événement par ID

#### ✅ Tests Valides
- [ ] `/events/:id GET` : Récupération avec un ID valide existant : 
- [ ] `/events/:id GET` : Vérification du format de la réponse : 
- [ ] `/events/:id GET` : Vérification que les médias sont inclus : 

#### ❌ Tests d'Erreur
- [ ] `/events/:id GET` : ID non existant : 
- [ ] `/events/:id GET` : ID au mauvais format (non numérique) : 
- [ ] `/events/:id GET` : ID null/manquant : 

---

### PATCH /events/:id - Mettre à jour un événement

#### ✅ Tests Valides
- [ ] `/events/:id PATCH` : Mise à jour du nom : 
- [ ] `/events/:id PATCH` : Mise à jour de la date : 
- [ ] `/events/:id PATCH` : Mise à jour de la description : 
- [ ] `/events/:id PATCH` : Mise à jour du pricing : 
- [ ] `/events/:id PATCH` : Mise à jour de la location : 
- [ ] `/events/:id PATCH` : Mise à jour du website : 
- [ ] `/events/:id PATCH` : Mise à jour des médias : 
- [ ] `/events/:id PATCH` : Mise à jour de plusieurs champs : 

#### ❌ Tests d'Erreur
- [ ] `/events/:id PATCH` : ID non existant : 
- [ ] `/events/:id PATCH` : ID au mauvais format : 
- [ ] `/events/:id PATCH` : Nom dépassant 100 caractères : 
- [ ] `/events/:id PATCH` : Date au mauvais format : 
- [ ] `/events/:id PATCH` : Description dépassant 5000 caractères : 
- [ ] `/events/:id PATCH` : Pricing négatif : 
- [ ] `/events/:id PATCH` : Pricing non entier : 
- [ ] `/events/:id PATCH` : Location non object : 
- [ ] `/events/:id PATCH` : Website au mauvais format : 
- [ ] `/events/:id PATCH` : Media avec format invalide : 

---

### DELETE /events/:id - Supprimer un événement

#### ✅ Tests Valides
- [ ] `/events/:id DELETE` : Suppression avec un ID valide existant : 
- [ ] `/events/:id DELETE` : Vérification que l'événement est bien supprimé : 

#### ❌ Tests d'Erreur
- [ ] `/events/:id DELETE` : ID non existant : 
- [ ] `/events/:id DELETE` : ID au mauvais format : 
- [ ] `/events/:id DELETE` : ID null/manquant : 

---

## Health (/health)

### GET /health - Vérifier l'état de santé de l'application

#### ✅ Tests Valides
- [ ] `/health GET` : Vérification de l'état de santé : 
- [ ] `/health GET` : Vérification du format de la réponse (status, timestamp, uptime) : 

#### ❌ Tests d'Erreur
- [ ] `/health GET` : Aucun test d'erreur spécifique (endpoint simple sans paramètres)

---

## 📊 Résumé des Tests

### Par Module
- **Authentication** : ~40 tests
- **Users** : ~55 tests
- **Companies** : ~75 tests
- **Events** : ~65 tests
- **Health** : ~2 tests

### Total estimé : ~237 tests

---

## 🔧 Recommandations pour les Tests

### 1. **Tests de Validation des DTOs**
   - Tester chaque champ obligatoire avec `null`, `undefined`, et valeur manquante
   - Tester les limites (min/max length, min/max value)
   - Tester les formats (email, URL, UUID, date ISO)
   - Tester les types (string, number, boolean, object, array)

### 2. **Tests d'Authentification**
   - Tester tous les endpoints protégés sans token
   - Tester avec token expiré
   - Tester avec token invalide
   - Tester avec token révoqué

### 3. **Tests de Permissions**
   - Tester l'accès propriétaire vs non-propriétaire
   - Tester le rôle admin vs user
   - Tester les opérations interdites

### 4. **Tests d'Intégrité des Données**
   - Tester les doublons (email unique, SIREN unique)
   - Tester les relations (companyId existant, userId existant)
   - Tester la suppression en cascade

### 5. **Tests de Réponse**
   - Vérifier les codes de statut HTTP
   - Vérifier la structure de la réponse
   - Vérifier que les données sensibles ne sont pas exposées (mot de passe)

---

## 🛠️ Outils Recommandés

- **Framework** : Jest + Supertest
- **Coverage** : >80% de couverture de code
- **CI/CD** : Tests automatiques sur chaque commit/PR

---

## 📝 Notes

- Les tests marqués  indiquent les tests à implémenter
- Chaque test doit vérifier le code de statut HTTP approprié
- Chaque test d'erreur doit vérifier le message d'erreur retourné
- Les tests doivent être isolés et indépendants les uns des autres
- Utiliser des données de test cohérentes et reproductibles

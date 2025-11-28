#!/bin/bash

# Couleurs pour les résultats
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction pour afficher les résultats
print_test() {
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    local test_name="$1"
    local expected_status="$2"
    local response="$3"
    local actual_status=$(echo "$response" | tail -n1)

    if [[ "$actual_status" == "$expected_status" ]]; then
        echo -e "${GREEN}✓ PASS${NC} - Test #$TOTAL_TESTS: $test_name (HTTP $actual_status)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} - Test #$TOTAL_TESTS: $test_name (Expected: $expected_status, Got: $actual_status)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo "   Response: $(echo "$response" | head -n1)"
    echo ""
}

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}   TESTS API - USER & COMPANY CRUD${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# ==========================================
# TESTS USER - REGISTRATION
# ==========================================
echo -e "${YELLOW}>>> SECTION 1: USER REGISTRATION${NC}"
echo ""

# Test 1: Nom trop long (>30 caractères)
echo "Test 1: Nom trop long (>30 caractères)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "NomBeaucoupTropLongQuiDepasse30Caracteres",
    "email": "test1@example.com",
    "password": "Password123!",
    "isCreator": false
  }')
print_test "Nom trop long" "400" "$RESPONSE"

# Test 2: Email invalide (format incorrect)
echo "Test 2: Email invalide - format incorrect"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "invalid-email",
    "password": "Password123!",
    "isCreator": false
  }')
print_test "Email format invalide" "400" "$RESPONSE"

# Test 3: Email invalide (pas de domaine)
echo "Test 3: Email invalide - sans domaine"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@",
    "password": "Password123!",
    "isCreator": false
  }')
print_test "Email sans domaine" "400" "$RESPONSE"

# Test 4: Mot de passe trop court (<8 caractères)
echo "Test 4: Mot de passe trop court"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test2@example.com",
    "password": "Pass1!",
    "isCreator": false
  }')
print_test "Mot de passe trop court" "400" "$RESPONSE"

# Test 5: Mot de passe sans majuscule
echo "Test 5: Mot de passe sans majuscule"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test3@example.com",
    "password": "password123!",
    "isCreator": false
  }')
print_test "Mot de passe sans majuscule" "400" "$RESPONSE"

# Test 6: Mot de passe sans chiffre
echo "Test 6: Mot de passe sans chiffre"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test4@example.com",
    "password": "Password!",
    "isCreator": false
  }')
print_test "Mot de passe sans chiffre" "400" "$RESPONSE"

# Test 7: Mot de passe sans caractère spécial
echo "Test 7: Mot de passe sans caractère spécial"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test5@example.com",
    "password": "Password123",
    "isCreator": false
  }')
print_test "Mot de passe sans caractère spécial" "400" "$RESPONSE"

# Test 8: USER 1 - Inscription VALIDE
echo "Test 8: USER 1 - Inscription valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Martin",
    "email": "alice@example.com",
    "password": "AlicePass123!",
    "isCreator": true
  }')
print_test "User 1 inscription valide" "201" "$RESPONSE"
USER1_DATA=$(echo "$RESPONSE" | head -n1)

# Test 9: USER 2 - Inscription VALIDE
echo "Test 9: USER 2 - Inscription valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Dupont",
    "email": "bob@example.com",
    "password": "BobSecure456#",
    "isCreator": true
  }')
print_test "User 2 inscription valide" "201" "$RESPONSE"
USER2_DATA=$(echo "$RESPONSE" | head -n1)

# Test 10: Email déjà utilisé
echo "Test 10: Email déjà utilisé"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Duplicate",
    "email": "alice@example.com",
    "password": "Password123!",
    "isCreator": false
  }')
print_test "Email déjà utilisé" "409" "$RESPONSE"

# ==========================================
# TESTS USER - LOGIN
# ==========================================
echo -e "${YELLOW}>>> SECTION 2: USER LOGIN${NC}"
echo ""

# Test 11: Login avec email invalide
echo "Test 11: Login avec email invalide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "Password123!"
  }')
print_test "Login email invalide" "401" "$RESPONSE"

# Test 12: Login avec mauvais mot de passe
echo "Test 12: Login avec mauvais mot de passe"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "WrongPassword123!"
  }')
print_test "Login mauvais mot de passe" "401" "$RESPONSE"

# Test 13: USER 1 - Login VALIDE
echo "Test 13: USER 1 - Login valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AlicePass123!"
  }')
print_test "User 1 login valide" "200" "$RESPONSE"
USER1_TOKEN=$(echo "$RESPONSE" | head -n1 | jq -r '.access_token')
USER1_ID=$(echo "$RESPONSE" | head -n1 | jq -r '.user.id')

# Test 14: USER 2 - Login VALIDE
echo "Test 14: USER 2 - Login valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "password": "BobSecure456#"
  }')
print_test "User 2 login valide" "200" "$RESPONSE"
USER2_TOKEN=$(echo "$RESPONSE" | head -n1 | jq -r '.access_token')
USER2_ID=$(echo "$RESPONSE" | head -n1 | jq -r '.user.id')

# ==========================================
# TESTS COMPANY - CREATE
# ==========================================
echo -e "${YELLOW}>>> SECTION 3: COMPANY CREATE${NC}"
echo ""

# Test 15: Créer company sans authentification
echo "Test 15: Créer company sans authentification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "siren": "123456789",
    "description": "Test description"
  }')
print_test "Company sans auth" "401" "$RESPONSE"

# Test 16: Nom de company trop long (>100 caractères)
echo "Test 16: Nom de company trop long"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "NomDeCompagnieBeaucoupTropLongQuiDepasse100CaracteresEtQuiNeDevraitPasEtreAccepteParlValidationDuDTO",
    "siren": "123456789",
    "description": "Test description"
  }')
print_test "Nom company trop long" "400" "$RESPONSE"

# Test 17: SIREN invalide (pas 9 chiffres)
echo "Test 17: SIREN invalide - moins de 9 chiffres"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Test Company",
    "siren": "12345",
    "description": "Test description"
  }')
print_test "SIREN invalide (court)" "400" "$RESPONSE"

# Test 18: SIREN invalide (plus de 9 chiffres)
echo "Test 18: SIREN invalide - plus de 9 chiffres"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Test Company",
    "siren": "12345678901",
    "description": "Test description"
  }')
print_test "SIREN invalide (long)" "400" "$RESPONSE"

# Test 19: SIREN avec lettres
echo "Test 19: SIREN avec lettres"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Test Company",
    "siren": "12345678A",
    "description": "Test description"
  }')
print_test "SIREN avec lettres" "400" "$RESPONSE"

# Test 20: Description trop longue (>300 caractères)
echo "Test 20: Description trop longue"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Test Company",
    "siren": "123456789",
    "description": "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
  }')
print_test "Description trop longue" "400" "$RESPONSE"

# Test 21: URL de site web invalide
echo "Test 21: URL de site web invalide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Test Company",
    "siren": "123456789",
    "description": "Test",
    "website": "not-a-valid-url"
  }')
print_test "URL invalide" "400" "$RESPONSE"

# Test 22: USER 1 - Créer COMPANY 1 VALIDE
echo "Test 22: USER 1 - Créer company 1 valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Alice Tech Solutions",
    "siren": "123456789",
    "description": "Entreprise de développement logiciel",
    "website": "https://alice-tech.com",
    "isValidated": false
  }')
print_test "Company 1 création valide" "201" "$RESPONSE"
COMPANY1_ID=$(echo "$RESPONSE" | head -n1 | jq -r '.id')

# Test 23: USER 1 - Créer COMPANY 2 VALIDE
echo "Test 23: USER 1 - Créer company 2 valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Alice Consulting",
    "siren": "987654321",
    "description": "Conseil en stratégie digitale"
  }')
print_test "Company 2 création valide" "201" "$RESPONSE"
COMPANY2_ID=$(echo "$RESPONSE" | head -n1 | jq -r '.id')

# Test 24: USER 2 - Créer COMPANY 3 VALIDE
echo "Test 24: USER 2 - Créer company 3 valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d '{
    "name": "Bob Innovations",
    "siren": "111222333",
    "description": "Innovation et recherche"
  }')
print_test "Company 3 création valide" "201" "$RESPONSE"
COMPANY3_ID=$(echo "$RESPONSE" | head -n1 | jq -r '.id')

# Test 25: SIREN déjà utilisé
echo "Test 25: SIREN déjà utilisé"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/companies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d '{
    "name": "Duplicate Company",
    "siren": "123456789",
    "description": "Test"
  }')
print_test "SIREN déjà utilisé" "409" "$RESPONSE"

# ==========================================
# TESTS COMPANY - READ
# ==========================================
echo -e "${YELLOW}>>> SECTION 4: COMPANY READ${NC}"
echo ""

# Test 26: Lire toutes les companies (public)
echo "Test 26: Lire toutes les companies"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/companies")
print_test "Lire toutes companies" "200" "$RESPONSE"

# Test 27: USER 1 - Lire ses propres companies
echo "Test 27: USER 1 - Lire ses companies"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/companies/my-companies" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "User 1 ses companies" "200" "$RESPONSE"

# Test 28: USER 1 - Lire COMPANY 1 (sa company)
echo "Test 28: USER 1 - Lire company 1 (owner)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "User 1 lire sa company" "200" "$RESPONSE"

# Test 29: USER 2 - Tenter de lire COMPANY 1 (pas owner)
echo "Test 29: USER 2 - Tenter lire company 1 (pas owner)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Authorization: Bearer $USER2_TOKEN")
print_test "User 2 lire company d'autrui" "403" "$RESPONSE"

# Test 30: Lire company inexistante
echo "Test 30: Lire company inexistante"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/companies/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "Company inexistante" "404" "$RESPONSE"

# ==========================================
# TESTS COMPANY - UPDATE
# ==========================================
echo -e "${YELLOW}>>> SECTION 5: COMPANY UPDATE${NC}"
echo ""

# Test 31: Update sans authentification
echo "Test 31: Update sans authentification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name"
  }')
print_test "Update sans auth" "401" "$RESPONSE"

# Test 32: USER 2 - Tenter update COMPANY 1 (pas owner)
echo "Test 32: USER 2 - Tenter update company 1 (pas owner)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d '{
    "name": "Hacked Company"
  }')
print_test "User 2 update company d'autrui" "403" "$RESPONSE"

# Test 33: USER 1 - Update COMPANY 1 avec nom trop long
echo "Test 33: Update avec nom trop long"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "NomDeCompagnieBeaucoupTropLongQuiDepasse100CaracteresEtQuiNeDevraitPasEtreAccepteParlValidationDuDTO"
  }')
print_test "Update nom trop long" "400" "$RESPONSE"

# Test 34: USER 1 - Update COMPANY 1 avec description trop longue
echo "Test 34: Update avec description trop longue"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "description": "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
  }')
print_test "Update description trop longue" "400" "$RESPONSE"

# Test 35: USER 1 - Update COMPANY 1 avec URL invalide
echo "Test 35: Update avec URL invalide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "website": "not-a-url"
  }')
print_test "Update URL invalide" "400" "$RESPONSE"

# Test 36: USER 1 - Update COMPANY 1 VALIDE
echo "Test 36: USER 1 - Update company 1 valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/$COMPANY1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Alice Tech Solutions UPDATED",
    "description": "Nouvelle description mise à jour",
    "website": "https://alice-tech-new.com"
  }')
print_test "Update company 1 valide" "200" "$RESPONSE"

# Test 37: Update company inexistante
echo "Test 37: Update company inexistante"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/companies/00000000-0000-0000-0000-000000000000" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Test"
  }')
print_test "Update company inexistante" "404" "$RESPONSE"

# ==========================================
# TESTS COMPANY - DELETE
# ==========================================
echo -e "${YELLOW}>>> SECTION 6: COMPANY DELETE${NC}"
echo ""

# Test 38: Delete sans authentification
echo "Test 38: Delete sans authentification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/companies/$COMPANY2_ID")
print_test "Delete sans auth" "401" "$RESPONSE"

# Test 39: USER 2 - Tenter delete COMPANY 2 (pas owner)
echo "Test 39: USER 2 - Tenter delete company 2 (pas owner)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/companies/$COMPANY2_ID" \
  -H "Authorization: Bearer $USER2_TOKEN")
print_test "User 2 delete company d'autrui" "403" "$RESPONSE"

# Test 40: USER 1 - Delete COMPANY 2 VALIDE
echo "Test 40: USER 1 - Delete company 2 valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/companies/$COMPANY2_ID" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "Delete company 2 valide" "200" "$RESPONSE"

# Test 41: Tenter de lire la company supprimée
echo "Test 41: Lire company supprimée"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/companies/$COMPANY2_ID" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "Lire company supprimée" "404" "$RESPONSE"

# Test 42: Delete company déjà supprimée
echo "Test 42: Delete company déjà supprimée"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/companies/$COMPANY2_ID" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "Delete company déjà supprimée" "404" "$RESPONSE"

# ==========================================
# TESTS USER - READ/UPDATE/DELETE
# ==========================================
echo -e "${YELLOW}>>> SECTION 7: USER READ/UPDATE/DELETE${NC}"
echo ""

# Test 43: Lire tous les users (protected)
echo "Test 43: Lire tous les users"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "Lire tous users" "200" "$RESPONSE"

# Test 44: USER 1 - Lire son profil
echo "Test 44: USER 1 - Lire son profil"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/users/$USER1_ID" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "User 1 lire profil" "200" "$RESPONSE"

# Test 45: USER 1 - Update son profil avec nom trop long
echo "Test 45: Update profil nom trop long"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/users/$USER1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "NomBeaucoupTropLongQuiDepasse30Caracteres"
  }')
print_test "Update user nom trop long" "400" "$RESPONSE"

# Test 46: USER 1 - Update son profil VALIDE
echo "Test 46: USER 1 - Update profil valide"
RESPONSE=$(curl -s -w "\n%{http_code}" -X PATCH "$BASE_URL/users/$USER1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{
    "name": "Alice Martin UPDATED"
  }')
print_test "Update user profil valide" "200" "$RESPONSE"

# Test 47: USER 1 - Delete son compte
echo "Test 47: USER 1 - Delete son compte"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$BASE_URL/users/$USER1_ID" \
  -H "Authorization: Bearer $USER1_TOKEN")
print_test "Delete user compte" "200" "$RESPONSE"

# Test 48: Tenter de se connecter après suppression
echo "Test 48: Login après suppression compte"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "AlicePass123!"
  }')
print_test "Login compte supprimé" "401" "$RESPONSE"

# ==========================================
# RÉSUMÉ FINAL
# ==========================================
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}         RÉSUMÉ DES TESTS${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "Total de tests: ${YELLOW}$TOTAL_TESTS${NC}"
echo -e "Tests réussis: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Tests échoués: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ TOUS LES TESTS SONT PASSÉS !${NC}"
    exit 0
else
    echo -e "${RED}✗ CERTAINS TESTS ONT ÉCHOUÉ${NC}"
    exit 1
fi

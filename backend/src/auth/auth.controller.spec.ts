import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserResponseDto } from '../users/dto/user-response.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let prismaService: PrismaService;

  // Fonctions utilitaires pour nettoyer la base de données
  async function cleanDatabase() {
    await prismaService.userFavorite.deleteMany();
    await prismaService.media.deleteMany();
    await prismaService.event.deleteMany();
    await prismaService.company.deleteMany();
    await prismaService.user.deleteMany();
  }

  const testUser = {
    name: 'Test Controller User',
    email: 'controller@example.com',
    password: 'Password123!',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtService, PrismaService],
    }).compile();

    await module.init();

    authController = module.get<AuthController>(AuthController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await prismaService.$disconnect();
  });

  // Tests du endpoint d'inscription (POST /auth/register)
  describe('register', () => {
    // Test 1: devrait inscrire un nouvel utilisateur
    it('devrait inscrire un nouvel utilisateur', async () => {
      const result = await authController.register(testUser);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.name).toBe(testUser.name);
      expect(result.user.isCreator).toBe(false);
    });

    // Test 2: ne devrait pas retourner le mot de passe
    it('ne devrait pas retourner le mot de passe', async () => {
      const result = await authController.register({
        ...testUser,
        email: 'nopassword@example.com',
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('refreshToken');
    });

    // Test 3: devrait rejeter une inscription avec un email en double
    it('devrait rejeter une inscription avec un email en double', async () => {
      await authController.register(testUser);

      await expect(authController.register(testUser)).rejects.toThrow();
    });

    // Test 4: les tokens générés devraient être des chaînes non vides
    it('les tokens générés devraient être des chaînes non vides', async () => {
      const result = await authController.register({
        ...testUser,
        email: 'tokens@example.com',
      });

      expect(typeof result.access_token).toBe('string');
      expect(typeof result.refresh_token).toBe('string');
      expect(result.access_token.length).toBeGreaterThan(0);
      expect(result.refresh_token.length).toBeGreaterThan(0);
    });
  });

  // Tests du endpoint de connexion (POST /auth/login)
  describe('login', () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de login
      await authController.register(testUser);
    });

    // Test 5: devrait connecter un utilisateur avec des identifiants valides
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const result = await authController.login({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe(testUser.email);
    });

    // Test 6: devrait rejeter une connexion avec un email invalide
    it('devrait rejeter une connexion avec un email invalide', async () => {
      await expect(
        authController.login({
          email: 'wrong@example.com',
          password: testUser.password,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Test 7: devrait rejeter une connexion avec un mot de passe invalide
    it('devrait rejeter une connexion avec un mot de passe invalide', async () => {
      await expect(
        authController.login({
          email: testUser.email,
          password: 'WrongPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Test 8: ne devrait pas retourner le mot de passe
    it('ne devrait pas retourner le mot de passe', async () => {
      const result = await authController.login({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('refreshToken');
    });

    // Test 9: devrait générer de nouveaux tokens à chaque connexion
    it('devrait générer de nouveaux tokens à chaque connexion', async () => {
      const result1 = await authController.login({
        email: testUser.email,
        password: testUser.password,
      });

      // Attendre 1 seconde pour que les timestamps JWT soient différents
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result2 = await authController.login({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result1.access_token).not.toBe(result2.access_token);
      expect(result1.refresh_token).not.toBe(result2.refresh_token);
    });
  });

  // Tests du endpoint de rafraîchissement des tokens (POST /auth/refresh)
  describe('refreshTokens', () => {
    let mockUser: UserResponseDto;

    beforeEach(async () => {
      const result = await authController.register({
        ...testUser,
        email: 'refresh-controller@example.com',
      });
      mockUser = result.user;
    });

    // Test 10: devrait rafraîchir les tokens
    it('devrait rafraîchir les tokens', async () => {
      const result = await authController.refreshTokens(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(typeof result.access_token).toBe('string');
      expect(typeof result.refresh_token).toBe('string');
    });

    // Test 11: devrait générer de nouveaux tokens
    it('devrait générer de nouveaux tokens', async () => {
      const result1 = await authController.refreshTokens(mockUser);

      // Attendre 1 seconde pour que les timestamps JWT soient différents
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result2 = await authController.refreshTokens(mockUser);

      expect(result1.access_token).not.toBe(result2.access_token);
      expect(result1.refresh_token).not.toBe(result2.refresh_token);
    });
  });

  // Tests du endpoint de déconnexion (POST /auth/logout)
  describe('logout', () => {
    let mockUser: UserResponseDto;

    beforeEach(async () => {
      const result = await authController.register({
        ...testUser,
        email: 'logout-controller@example.com',
      });
      mockUser = result.user;
    });

    // Test 12: devrait déconnecter l'utilisateur
    it("devrait déconnecter l'utilisateur", async () => {
      const result = await authController.logout(mockUser);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Déconnexion réussie');
    });

    // Test 13: devrait supprimer le refresh token de la base de données
    it('devrait supprimer le refresh token de la base de données', async () => {
      await authController.logout(mockUser);

      const user = await prismaService.user.findUnique({
        where: { id: mockUser.id },
      });

      expect(user).toBeDefined();
      expect(user!.refreshToken).toBeNull();
    });

    // Test 14: ne devrait pas échouer si appelé plusieurs fois
    it('ne devrait pas échouer si appelé plusieurs fois', async () => {
      await authController.logout(mockUser);
      const result = await authController.logout(mockUser);

      expect(result).toHaveProperty('message');
    });
  });

  // Tests d'intégration du flux d'authentification complet
  describe('Intégration complète', () => {
    // Test 15: devrait gérer le cycle complet: inscription -> connexion -> refresh -> déconnexion
    it('devrait gérer le cycle complet: inscription -> connexion -> refresh -> déconnexion', async () => {
      // 1. Inscription
      const registerResult = await authController.register({
        ...testUser,
        email: 'fullcycle@example.com',
      });

      expect(registerResult).toHaveProperty('user');
      expect(registerResult).toHaveProperty('access_token');
      expect(registerResult).toHaveProperty('refresh_token');

      // 2. Connexion
      const loginResult = await authController.login({
        email: 'fullcycle@example.com',
        password: testUser.password,
      });

      expect(loginResult).toHaveProperty('user');
      expect(loginResult).toHaveProperty('access_token');

      // 3. Refresh
      const refreshResult = await authController.refreshTokens(loginResult.user);

      expect(refreshResult).toHaveProperty('access_token');
      expect(refreshResult).toHaveProperty('refresh_token');

      // 4. Déconnexion
      const logoutResult = await authController.logout(loginResult.user);

      expect(logoutResult.message).toBe('Déconnexion réussie');

      // Vérifier que le refresh token a été supprimé
      const user = await prismaService.user.findUnique({
        where: { id: loginResult.user.id },
      });

      expect(user!.refreshToken).toBeNull();
    });
  });
});

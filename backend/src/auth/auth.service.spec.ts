import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let testUserId: string;

  // Fonctions utilitaires pour nettoyer la base de données
  async function cleanDatabase() {
    await prismaService.userFavorite.deleteMany();
    await prismaService.media.deleteMany();
    await prismaService.event.deleteMany();
    await prismaService.company.deleteMany();
    await prismaService.user.deleteMany();
  }

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JwtService,
        PrismaService,
      ],
    }).compile();

    await module.init();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await cleanDatabase();
  });

  afterAll(async () => {
    // Nettoyer et fermer la connexion après tous les tests
    await cleanDatabase();
    await prismaService.$disconnect();
  });

  // Tests de la fonctionnalité d'inscription
  describe('register', () => {
    // Test 1: devrait créer un nouvel utilisateur et retourner les tokens
    it('devrait créer un nouvel utilisateur et retourner les tokens', async () => {
      const result = await authService.register(testUser);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe(testUser.email);
      expect(result.user.name).toBe(testUser.name);
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.isCreator).toBe(false);

      // Sauvegarder l'ID pour les tests suivants
      testUserId = result.user.id;
    });

    // Test 2: ne devrait pas exposer le mot de passe dans la réponse
    it('ne devrait pas exposer le mot de passe dans la réponse', async () => {
      const result = await authService.register({
        ...testUser,
        email: 'another@example.com',
      });

      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('refreshToken');
    });

    // Test 3: devrait stocker le refresh token hashé dans la base de données
    it('devrait stocker le refresh token hashé dans la base de données', async () => {
      const result = await authService.register({
        ...testUser,
        email: 'hashed@example.com',
      });

      const user = await prismaService.user.findUnique({
        where: { id: result.user.id },
      });

      expect(user).toBeDefined();
      expect(user!.refreshToken).toBeDefined();
      expect(user!.refreshToken).not.toBe(result.refresh_token);

      // Vérifier que le refresh token est bien hashé
      const isMatch = bcrypt.compareSync(result.refresh_token, user!.refreshToken!);
      expect(isMatch).toBe(true);
    });
  });

  // Tests de la fonctionnalité de connexion
  describe('login', () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de login
      const result = await authService.register(testUser);
      testUserId = result.user.id;
    });

    // Test 4: devrait connecter un utilisateur avec des identifiants valides
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const result = await authService.login({
        email: testUser.email,
        password: testUser.password,
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.user.email).toBe(testUser.email);
    });

    // Test 5: devrait rejeter une connexion avec un email incorrect
    it('devrait rejeter une connexion avec un email incorrect', async () => {
      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: testUser.password,
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Test 6: devrait rejeter une connexion avec un mot de passe incorrect
    it('devrait rejeter une connexion avec un mot de passe incorrect', async () => {
      await expect(
        authService.login({
          email: testUser.email,
          password: 'WrongPassword123!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Test 7: devrait mettre à jour le refresh token lors de la connexion
    it('devrait mettre à jour le refresh token lors de la connexion', async () => {
      const result1 = await authService.login({
        email: testUser.email,
        password: testUser.password,
      });

      const user1 = await prismaService.user.findUnique({
        where: { id: testUserId },
      });

      // Attendre 1 seconde pour que les timestamps JWT soient différents
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Se reconnecter
      const result2 = await authService.login({
        email: testUser.email,
        password: testUser.password,
      });

      const user2 = await prismaService.user.findUnique({
        where: { id: testUserId },
      });

      // Le refresh token devrait avoir changé
      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      expect(user1!.refreshToken).not.toBe(user2!.refreshToken);
      expect(result1.refresh_token).not.toBe(result2.refresh_token);
    });
  });

  // Tests du rafraîchissement des tokens JWT
  describe('refreshTokens', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await authService.register({
        ...testUser,
        email: 'refresh@example.com',
      });
      userId = result.user.id;
    });

    // Test 8: devrait générer de nouveaux tokens
    it('devrait générer de nouveaux tokens', async () => {
      const result = await authService.refreshTokens(userId);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(typeof result.access_token).toBe('string');
      expect(typeof result.refresh_token).toBe('string');
    });

    // Test 9: devrait mettre à jour le refresh token dans la base de données
    it('devrait mettre à jour le refresh token dans la base de données', async () => {
      const user1 = await prismaService.user.findUnique({
        where: { id: userId },
      });

      await authService.refreshTokens(userId);

      const user2 = await prismaService.user.findUnique({
        where: { id: userId },
      });

      expect(user1).toBeDefined();
      expect(user2).toBeDefined();
      expect(user1!.refreshToken).not.toBe(user2!.refreshToken);
    });

    // Test 10: devrait échouer avec un ID utilisateur invalide
    it('devrait échouer avec un ID utilisateur invalide', async () => {
      await expect(
        authService.refreshTokens('invalid-user-id'),
      ).rejects.toThrow();
    });
  });

  // Tests de la fonctionnalité de déconnexion
  describe('logout', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await authService.register({
        ...testUser,
        email: 'logout@example.com',
      });
      userId = result.user.id;
    });

    // Test 11: devrait supprimer le refresh token de la base de données
    it('devrait supprimer le refresh token de la base de données', async () => {
      const result = await authService.logout(userId);

      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Déconnexion réussie');

      const user = await prismaService.user.findUnique({
        where: { id: userId },
      });

      expect(user).toBeDefined();
      expect(user!.refreshToken).toBeNull();
    });

    // Test 12: devrait échouer avec un ID utilisateur invalide
    it('devrait échouer avec un ID utilisateur invalide', async () => {
      await expect(
        authService.logout('00000000-0000-0000-0000-000000000000'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // Tests de validation du refresh token
  describe('validateRefreshToken', () => {
    let userId: string;
    let validRefreshToken: string;

    beforeEach(async () => {
      const result = await authService.register({
        ...testUser,
        email: 'validate@example.com',
      });
      userId = result.user.id;
      validRefreshToken = result.refresh_token;
    });

    // Test 13: devrait valider un refresh token correct
    it('devrait valider un refresh token correct', async () => {
      const user = await authService.validateRefreshToken(userId, validRefreshToken);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
    });

    // Test 14: devrait rejeter un refresh token incorrect
    it('devrait rejeter un refresh token incorrect', async () => {
      await expect(
        authService.validateRefreshToken(userId, 'invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Test 15: devrait rejeter si l'utilisateur n'a pas de refresh token
    it('devrait rejeter si l\'utilisateur n\'a pas de refresh token', async () => {
      await authService.logout(userId);

      await expect(
        authService.validateRefreshToken(userId, validRefreshToken),
      ).rejects.toThrow(UnauthorizedException);
    });

    // Test 16: devrait rejeter avec un ID utilisateur invalide
    it('devrait rejeter avec un ID utilisateur invalide', async () => {
      await expect(
        authService.validateRefreshToken('invalid-id', validRefreshToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // Tests de validation de l'utilisateur par ID
  describe('validateUserById', () => {
    let userId: string;

    beforeEach(async () => {
      const result = await authService.register({
        ...testUser,
        email: 'validatebyid@example.com',
      });
      userId = result.user.id;
    });

    // Test 17: devrait retourner un utilisateur valide
    it('devrait retourner un utilisateur valide', async () => {
      const user = await authService.validateUserById(userId);

      expect(user).toBeDefined();
      expect(user.id).toBe(userId);
      expect(user).not.toHaveProperty('password');
    });

    // Test 18: devrait échouer avec un ID utilisateur invalide
    it('devrait échouer avec un ID utilisateur invalide', async () => {
      await expect(
        authService.validateUserById('invalid-id'),
      ).rejects.toThrow();
    });
  });

  // Tests de la génération unique des tokens
  describe('Génération de tokens', () => {
    // Test 19: les tokens générés devraient être différents à chaque fois
    it('les tokens générés devraient être différents à chaque fois', async () => {
      const result1 = await authService.register({
        ...testUser,
        email: 'token1@example.com',
      });

      const result2 = await authService.register({
        ...testUser,
        email: 'token2@example.com',
      });

      expect(result1.access_token).not.toBe(result2.access_token);
      expect(result1.refresh_token).not.toBe(result2.refresh_token);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;

  // Fonctions pour nettoyer la DB user
  async function clearUsers() {
    await prismaService.user.deleteMany({});
  }

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await clearUsers();
  });

  afterAll(async () => {
    await clearUsers();
    await prismaService.$disconnect();
  });

  describe('Creer un user valide', () => {
    it('devrait créer un nouvel utilisateur avec isCreator=false par défaut', async () => {
      const newUser = await usersService.create(testUser);

      expect(newUser).toHaveProperty('id');
      expect(newUser.name).toBe(testUser.name);
      expect(newUser.email).toBe(testUser.email);
      expect(newUser.createdAt).toBeInstanceOf(Date);
      expect(newUser.updatedAt).toBeInstanceOf(Date);
      expect(newUser.isCreator).toBe(false);
      expect(newUser.role).toBe('USER');
      expect(newUser).not.toHaveProperty('password');
      expect(newUser).not.toHaveProperty('refreshToken');
    });

    it('devrait créer un créateur avec isCreator=true', async () => {
      const creatorUser = {
        ...testUser,
        email: 'creator@example.com',
        isCreator: true,
      };

      const newUser = await usersService.create(creatorUser);

      expect(newUser.isCreator).toBe(true);
      expect(newUser.email).toBe('creator@example.com');
    });

    it('ne devrait pas montrer le mot de passe dans la réponse', async () => {
      const newUser = await usersService.create({
        ...testUser,
        email: 'another@example.com',
      });
      expect(newUser).not.toHaveProperty('password');
    });

    it('ne devrait pas montrer le refreshToken dans la réponse', async () => {
      const newUser = await usersService.create({
        ...testUser,
        email: 'token@example.com',
      });
      expect(newUser).not.toHaveProperty('refreshToken');
    });

    it('devrait hasher le mot de passe avant de le sauvegarder', async () => {
      const newUser = await usersService.create({
        ...testUser,
        email: 'hash@example.com',
      });

      // Récupérer l'utilisateur directement depuis la DB
      const userInDb = await prismaService.user.findUnique({
        where: { id: newUser.id },
      });

      expect(userInDb?.password).not.toBe(testUser.password);
      expect(userInDb?.password).toMatch(/^\$2[aby]\$.{56}$/);
    });
  });

  // Validation DTO avec class-validator
  describe('validation DTO avec class-validator', () => {
    it('devrait valider un DTO correct', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, testUser);

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('devrait échouer si le nom est vide', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, name: '' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find(e => e.property === 'name');
      expect(nameError).toBeDefined();
      expect(Object.values(nameError?.constraints || {})).toContain('Le nom ne peut pas être vide');
    });

    it('devrait échouer si le nom dépasse 30 caractères', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, name: 'a'.repeat(31) });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const nameError = errors.find(e => e.property === 'name');
      expect(nameError).toBeDefined();
      expect(Object.values(nameError?.constraints || {})).toContain(
        'Le nom ne peut pas dépasser 30 caractères',
      );
    });

    it("devrait échouer si l'email est vide", async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, email: '' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const emailError = errors.find(e => e.property === 'email');
      expect(emailError).toBeDefined();
      expect(Object.values(emailError?.constraints || {})).toContain('Email invalide');
    });

    it('devrait échouer si le format email est invalide', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, email: 'not-an-email' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const emailError = errors.find(e => e.property === 'email');
      expect(emailError).toBeDefined();
      const messages = Object.values(emailError?.constraints || {});
      expect(
        messages.some(msg => msg === 'Email invalide' || msg === "Format d'email invalide"),
      ).toBe(true);
    });

    it('devrait échouer si le mot de passe est trop court', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, password: 'Pass1!' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
    });

    it('devrait échouer si le mot de passe manque une majuscule', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, password: 'password123!' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
    });

    it('devrait échouer si le mot de passe manque un chiffre', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, password: 'Password!' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
    });

    it('devrait échouer si le mot de passe manque un caractère spécial', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, password: 'Password123' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
    });

    it('devrait échouer si le mot de passe ne respecte pas les critères', async () => {
      const dto = new CreateUserDto();
      Object.assign(dto, { ...testUser, password: 'faible' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      const passwordError = errors.find(e => e.property === 'password');
      expect(passwordError).toBeDefined();
      expect(Object.values(passwordError?.constraints || {})).toContain(
        'Mot de passe: min 8, 1 majuscule, 1 chiffre, 1 spécial',
      );
    });
  });

  // Tests logique métier du service
  describe('logique métier du service', () => {
    it("devrait lancer une ConflictException si l'email existe déjà", async () => {
      await usersService.create(testUser);

      await expect(usersService.create(testUser)).rejects.toThrow(ConflictException);
    });
  });

  // Tests findAll()
  describe('findAll', () => {
    it('devrait retourner un tableau vide si aucun utilisateur', async () => {
      const users = await usersService.findAll();

      expect(users).toEqual([]);
      expect(users.length).toBe(0);
    });

    it('devrait retourner tous les utilisateurs', async () => {
      // Créer plusieurs utilisateurs
      await usersService.create(testUser);
      await usersService.create({ ...testUser, email: 'user2@example.com' });
      await usersService.create({ ...testUser, email: 'user3@example.com' });

      const users = await usersService.findAll();

      expect(users.length).toBe(3);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
    });

    it('ne devrait pas exposer les mots de passe', async () => {
      await usersService.create(testUser);
      await usersService.create({ ...testUser, email: 'user2@example.com' });

      const users = await usersService.findAll();

      users.forEach(user => {
        expect(user).not.toHaveProperty('password');
        expect(user).not.toHaveProperty('refreshToken');
      });
    });

    it('devrait retourner les utilisateurs triés par date (plus récent en premier)', async () => {
      // Créer 3 utilisateurs avec un petit délai
      const user1 = await usersService.create(testUser);
      await new Promise(resolve => setTimeout(resolve, 10));

      const user2 = await usersService.create({ ...testUser, email: 'user2@example.com' });
      await new Promise(resolve => setTimeout(resolve, 10));

      const user3 = await usersService.create({ ...testUser, email: 'user3@example.com' });

      const users = await usersService.findAll();

      expect(users[0].id).toBe(user3.id);
      expect(users[1].id).toBe(user2.id);
      expect(users[2].id).toBe(user1.id);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un utilisateur par ID', async () => {
      const newUser = await usersService.create(testUser);

      const foundUser = await usersService.findOne(newUser.id);

      expect(foundUser.id).toBe(newUser.id);
      expect(foundUser.email).toBe(newUser.email);
    });

    it("devrait lancer une NotFoundException si l'utilisateur n'existe pas ou si l'ID est invalide", async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(usersService.findOne(fakeId)).rejects.toThrow(
        `Utilisateur avec l'ID ${fakeId} non trouvé.`,
      );
      await expect(usersService.findOne('')).rejects.toThrow(
        'invalid input syntax for type uuid: ""',
      );
    });
  });

  describe('update', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await usersService.create(testUser);
      userId = user.id;
    });

    // Cas valides
    it('devrait mettre à jour le nom uniquement', async () => {
      const updated = await usersService.update(userId, { name: 'New Name' });

      expect(updated.name).toBe('New Name');
      expect(updated.email).toBe(testUser.email);
      expect(updated.id).toBe(userId);
    });

    it("devrait mettre à jour l'email uniquement", async () => {
      const updated = await usersService.update(userId, { email: 'new@example.com' });

      expect(updated.email).toBe('new@example.com');
      expect(updated.name).toBe(testUser.name);
    });

    it('devrait mettre à jour plusieurs champs en même temps', async () => {
      const updated = await usersService.update(userId, {
        name: 'Updated Name',
        email: 'updated@example.com',
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.email).toBe('updated@example.com');
    });

    it('devrait hasher le nouveau mot de passe', async () => {
      await usersService.update(userId, { password: 'NewPass123!' });

      const userInDb = await prismaService.user.findUnique({ where: { id: userId } });
      expect(userInDb?.password).not.toBe('NewPass123!');
      expect(userInDb?.password).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('ne devrait pas exposer le mot de passe dans la réponse', async () => {
      const updated = await usersService.update(userId, { name: 'Test' });

      expect(updated).not.toHaveProperty('password');
      expect(updated).not.toHaveProperty('refreshToken');
    });

    it('devrait mettre à jour updatedAt', async () => {
      const originalUser = await usersService.findOne(userId);
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await usersService.update(userId, { name: 'Changed' });

      expect(updated.updatedAt.getTime()).toBeGreaterThan(originalUser.updatedAt.getTime());
    });

    // Cas d'erreur
    it('devrait lancer NotFoundException si ID inexistant', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(usersService.update(fakeId, { name: 'Test' })).rejects.toThrow(
        `Utilisateur avec l'ID ${fakeId} non trouvé`,
      );
    });

    it('devrait lancer ConflictException si email déjà utilisé', async () => {
      await usersService.create({ ...testUser, email: 'other@example.com' });

      await expect(usersService.update(userId, { email: 'other@example.com' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('devrait permettre de garder le même email', async () => {
      const updated = await usersService.update(userId, { email: testUser.email });

      expect(updated.email).toBe(testUser.email);
    });

    it("devrait lancer une erreur si l'ID est invalide", async () => {
      await expect(usersService.update('', { name: 'Test' })).rejects.toThrow();
    });
  });

  describe('Delete tests', () => {
    let userId: string;

    beforeEach(async () => {
      const user = await usersService.create(testUser);
      userId = user.id;
    });

    it('devrait supprimer un utilisateur existant', async () => {
      const response = await usersService.remove(userId);

      expect(response).toEqual({ message: `Utilisateur ${testUser.name} supprimé avec succès` });

      await expect(usersService.findOne(userId)).rejects.toThrow(
        `Utilisateur avec l'ID ${userId} non trouvé.`,
      );
    });

    it("devrait lancer NotFoundException si l'utilisateur n'existe pas", async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      await expect(usersService.remove(fakeId)).rejects.toThrow(
        `Utilisateur avec l'ID ${fakeId} non trouvé`,
      );
    });
  });
});

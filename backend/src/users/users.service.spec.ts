import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

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
    it('devrait créer un nouvel utilisateur', async () => {
      const newUser = await usersService.create(testUser);

      expect(newUser).toHaveProperty('id');
      expect(newUser.name).toBe(testUser.name);
      expect(newUser.email).toBe(testUser.email);
      expect(newUser.createdAt).toBeInstanceOf(Date);
      expect(newUser.isCreator).toBe(false);
      expect(newUser).not.toHaveProperty('password');
    });

    it('ne devrait pas montrer le mot de passe dans la réponse', async () => {
      const newUser = await usersService.create({
        ...testUser,
        email: 'another@example.com',
      });
      expect(newUser).not.toHaveProperty('password');
    });

    it("devrait lancer une ConflictException si l'email existe déjà", async () => {
      await usersService.create(testUser);

      await expect(usersService.create(testUser)).rejects.toThrow('Cet email est déjà utilisé');
    });
  });

  describe('création avec donénes mauvaises', () => {
    it('devrait lancer une erreur si le nom est manquant', async () => {
      const wrongName = { ...testUser, name: '' };

      await expect(usersService.create(wrongName)).rejects.toThrow('Le nom est requis');
    });
  });
});

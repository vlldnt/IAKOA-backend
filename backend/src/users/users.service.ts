import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Créer l'utilisateur
    try {
      const user = await this.prisma.user.create({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          isCreator: createUserDto.isCreator || false,
        },
      });

      return this.toResponseDto(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(user => this.toResponseDto(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé.`);
    }

    return this.toResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Vérifier si l'utilisateur existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Cet email est déjà utilisé');
      }
    }

    // Hasher le nouveau mot de passe si fourni
    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Mettre à jour l'utilisateur
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });

      return this.toResponseDto(user);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Cet email est déjà utilisé');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
    }

    try {
      await this.prisma.user.delete({
        where: { id },
      });

      return { message: `Utilisateur ${user.name} supprimé avec succès` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`);
      }
      throw error;
    }
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<UserResponseDto> {
    const user = await this.findByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    const { password, refreshToken, ...result } = user;
    return result;
  }
}

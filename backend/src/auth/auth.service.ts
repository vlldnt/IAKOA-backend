import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { RegisterUserDto } from '../users/dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    // Créer l'utilisateur avec isCreator défini à false par défaut
    const user = await this.usersService.create({
      ...registerUserDto,
      isCreator: false,
    });
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.validateUser(loginUserDto);
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      user,
      ...tokens,
    };
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findOne(userId);
    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      return { message: 'Déconnexion réussie' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      throw error;
    }
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'votre-secret-super-securise-a-changer',
        expiresIn: '15m', // Token court pour la sécurité
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'votre-refresh-secret-super-securise',
        expiresIn: '7d', // Refresh token valide 7 jours
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashedRefreshToken },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }
      throw error;
    }
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Accès refusé');
      }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Accès refusé');
      }

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Accès refusé');
    }
  }

  async validateUserById(userId: string) {
    return this.usersService.findOne(userId);
  }
}

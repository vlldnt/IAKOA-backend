import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';
import { UserFavoriteResponseDto } from './dto/user-favorite-response.dto';

@Injectable()
export class UserFavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ajouter un événement aux favoris d'un utilisateur
   */
  async create(createUserFavoriteDto: CreateUserFavoriteDto): Promise<UserFavoriteResponseDto> {
    try {
      // Vérifier que l'utilisateur existe
      const userExists = await this.prisma.user.findUnique({
        where: { id: createUserFavoriteDto.userId },
      });

      if (!userExists) {
        throw new NotFoundException(
          `Utilisateur avec l'ID ${createUserFavoriteDto.userId} non trouvé`,
        );
      }

      // Vérifier que l'événement existe
      const eventExists = await this.prisma.event.findUnique({
        where: { id: createUserFavoriteDto.eventId },
      });

      if (!eventExists) {
        throw new NotFoundException(
          `Événement avec l'ID ${createUserFavoriteDto.eventId} non trouvé`,
        );
      }

      // Créer le favori
      const favorite = await this.prisma.userFavorite.create({
        data: {
          userId: createUserFavoriteDto.userId,
          eventId: createUserFavoriteDto.eventId,
        },
        include: {
          event: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isCreator: true,
            },
          },
        },
      });

      return new UserFavoriteResponseDto(favorite);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException(`L'utilisateur a déjà ajouté cet événement à ses favoris`);
      }
      throw new InternalServerErrorException("Erreur lors de l'ajout du favori");
    }
  }

  /**
   * Obtenir tous les favoris d'un utilisateur
   */
  async findByUserId(userId: string): Promise<UserFavoriteResponseDto[]> {
    try {
      // Vérifier que l'utilisateur existe
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
      }

      const favorites = await this.prisma.userFavorite.findMany({
        where: { userId },
        include: {
          event: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return favorites.map(favorite => new UserFavoriteResponseDto(favorite));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des favoris');
    }
  }

  /**
   * Obtenir tous les utilisateurs qui ont ajouté un événement en favori
   */
  async findByEventId(eventId: string): Promise<UserFavoriteResponseDto[]> {
    try {
      // Vérifier que l'événement existe
      const eventExists = await this.prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!eventExists) {
        throw new NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);
      }

      const favorites = await this.prisma.userFavorite.findMany({
        where: { eventId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              isCreator: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return favorites.map(favorite => new UserFavoriteResponseDto(favorite));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des favoris');
    }
  }

  /**
   * Vérifier si un événement est dans les favoris d'un utilisateur
   */
  async isFavorite(userId: string, eventId: string): Promise<boolean> {
    try {
      const favorite = await this.prisma.userFavorite.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      return !!favorite;
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la vérification du favori');
    }
  }

  /**
   * Retirer un événement des favoris d'un utilisateur
   */
  async remove(userId: string, eventId: string): Promise<{ message: string }> {
    try {
      // Vérifier que le favori existe
      const favorite = await this.prisma.userFavorite.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      if (!favorite) {
        throw new NotFoundException(
          `Favori non trouvé pour l'utilisateur ${userId} et l'événement ${eventId}`,
        );
      }

      await this.prisma.userFavorite.delete({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      });

      return { message: 'Favori supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la suppression du favori');
    }
  }

  /**
   * Obtenir le nombre de favoris pour un événement
   */
  async countByEventId(eventId: string): Promise<number> {
    try {
      return await this.prisma.userFavorite.count({
        where: { eventId },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors du comptage des favoris');
    }
  }

  /**
   * Supprimer tous les favoris d'un utilisateur
   */
  async removeAllByUserId(userId: string): Promise<{ message: string; count: number }> {
    try {
      const result = await this.prisma.userFavorite.deleteMany({
        where: { userId },
      });

      return {
        message: "Tous les favoris de l'utilisateur ont été supprimés",
        count: result.count,
      };
    } catch (error) {
      throw new InternalServerErrorException('Erreur lors de la suppression des favoris');
    }
  }
}

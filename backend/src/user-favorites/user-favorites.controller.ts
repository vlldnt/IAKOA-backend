import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserFavoritesService } from './user-favorites.service';
import { CreateUserFavoriteDto } from './dto/create-user-favorite.dto';
import { UserFavoriteResponseDto } from './dto/user-favorite-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Role } from '@prisma/client';

@ApiTags('user-favorites')
@Controller('user-favorites')
export class UserFavoritesController {
  constructor(private readonly userFavoritesService: UserFavoritesService) {}

  /**
   * POST /user-favorites - Ajouter un événement aux favoris
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ajouter un événement aux favoris',
    description: "Permet à un utilisateur d'ajouter un événement à sa liste de favoris.",
  })
  @ApiBody({ type: CreateUserFavoriteDto })
  @ApiResponse({
    status: 201,
    description: 'Favori ajouté avec succès',
    type: UserFavoriteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur ou événement non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: "L'événement est déjà dans les favoris",
  })
  create(@Body(ValidationPipe) createUserFavoriteDto: CreateUserFavoriteDto, @GetUser() user: UserResponseDto) {
    return this.userFavoritesService.create(createUserFavoriteDto, user.id);
  }

  /**
   * GET /user-favorites/user/:userId - Obtenir tous les favoris d'un utilisateur
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: "Obtenir tous les favoris d'un utilisateur",
    description: "Retourne la liste de tous les événements favoris d'un utilisateur. Vous ne pouvez consulter que vos propres favoris (sauf ADMIN).",
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    example: 'cm2xxxxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: "Liste des favoris de l'utilisateur",
    type: [UserFavoriteResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - vous ne pouvez consulter que vos propres favoris',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  findByUserId(@Param('userId') userId: string) {
    return this.userFavoritesService.findByUserId(userId);
  }

  /**
   * GET /user-favorites/event/:eventId - Obtenir tous les utilisateurs ayant mis un événement en favori (ADMIN uniquement)
   */
  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Obtenir les utilisateurs ayant mis un événement en favori',
    description:
      'Retourne la liste de tous les utilisateurs qui ont ajouté un événement à leurs favoris. Réservé aux administrateurs.',
  })
  @ApiParam({
    name: 'eventId',
    description: "ID de l'événement",
    example: 'cm2yyyyyyyyyyyy',
  })
  @ApiResponse({
    status: 200,
    description: "Liste des utilisateurs ayant mis l'événement en favori",
    type: [UserFavoriteResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - réservé aux administrateurs',
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  findByEventId(@Param('eventId') eventId: string) {
    return this.userFavoritesService.findByEventId(eventId);
  }

  /**
   * GET /user-favorites/check/:userId/:eventId - Vérifier si un événement est en favori
   */
  @Get('check/:userId/:eventId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Vérifier si un événement est dans les favoris',
    description: 'Vérifie si un utilisateur a ajouté un événement spécifique à ses favoris. Vous ne pouvez vérifier que vos propres favoris (sauf ADMIN).',
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    example: 'cm2xxxxxxxxxxxx',
  })
  @ApiParam({
    name: 'eventId',
    description: "ID de l'événement",
    example: 'cm2yyyyyyyyyyyy',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de la vérification',
    schema: {
      type: 'object',
      properties: {
        isFavorite: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - vous ne pouvez vérifier que vos propres favoris',
  })
  async isFavorite(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    const isFavorite = await this.userFavoritesService.isFavorite(userId, eventId);
    return { isFavorite };
  }

  /**
   * GET /user-favorites/event/:eventId/count - Obtenir le nombre de favoris pour un événement
   */
  @Get('event/:eventId/count')
  @ApiOperation({
    summary: "Compter les favoris d'un événement",
    description: "Retourne le nombre d'utilisateurs ayant ajouté un événement à leurs favoris.",
  })
  @ApiParam({
    name: 'eventId',
    description: "ID de l'événement",
    example: 'cm2yyyyyyyyyyyy',
  })
  @ApiResponse({
    status: 200,
    description: 'Nombre de favoris',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 42 },
      },
    },
  })
  async countByEventId(@Param('eventId') eventId: string) {
    const count = await this.userFavoritesService.countByEventId(eventId);
    return { count };
  }

  /**
   * DELETE /user-favorites/:userId/:eventId - Retirer un événement des favoris
   */
  @Delete(':userId/:eventId')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retirer un événement des favoris',
    description: 'Permet à un utilisateur de retirer un événement de sa liste de favoris. Vous ne pouvez supprimer que vos propres favoris (sauf ADMIN).',
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    example: 'cm2xxxxxxxxxxxx',
  })
  @ApiParam({
    name: 'eventId',
    description: "ID de l'événement",
    example: 'cm2yyyyyyyyyyyy',
  })
  @ApiResponse({
    status: 200,
    description: 'Favori supprimé avec succès',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Favori supprimé avec succès' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - vous ne pouvez supprimer que vos propres favoris',
  })
  @ApiResponse({
    status: 404,
    description: 'Favori non trouvé',
  })
  remove(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.userFavoritesService.remove(userId, eventId);
  }

  /**
   * DELETE /user-favorites/user/:userId/all - Supprimer tous les favoris d'un utilisateur
   */
  @Delete('user/:userId/all')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Supprimer tous les favoris d'un utilisateur",
    description: "Supprime tous les événements favoris d'un utilisateur. Vous ne pouvez supprimer que vos propres favoris (sauf ADMIN).",
  })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    example: 'cm2xxxxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Tous les favoris ont été supprimés',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: "Tous les favoris de l'utilisateur ont été supprimés",
        },
        count: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Non authentifié',
  })
  @ApiResponse({
    status: 403,
    description: 'Accès refusé - vous ne pouvez supprimer que vos propres favoris',
  })
  removeAllByUserId(@Param('userId') userId: string) {
    return this.userFavoritesService.removeAllByUserId(userId);
  }
}

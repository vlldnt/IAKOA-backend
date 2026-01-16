import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users - Créer un nouvel utilisateur (création administrative)
   * Pour l'inscription publique, utiliser /auth/register
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
    description:
      "Création administrative d'un utilisateur. Pour l'inscription publique, utiliser /auth/register. Réservé aux administrateurs.",
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé - réservé aux administrateurs' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users/me - Récupérer l'utilisateur connecté
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer le profil de l\'utilisateur connecté',
    description: 'Retourne les informations de l\'utilisateur authentifié via le JWT.',
  })
  @ApiResponse({ status: 200, description: 'Profil de l\'utilisateur connecté', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  getMe(@GetUser() user: UserResponseDto): UserResponseDto {
    return user;
  }

  /**
   * GET /users - Récupérer tous les utilisateurs
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs',
    description:
      'Retourne la liste de tous les utilisateurs enregistrés. Réservé aux administrateurs.',
  })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé - réservé aux administrateurs' })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id - Récupérer un utilisateur par ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par ID',
    description: "Retourne les détails d'un utilisateur spécifique. Vous ne pouvez consulter que votre propre profil (sauf ADMIN).",
  })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur", example: 'cm2xxxxxxxxxxxx' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé - vous ne pouvez consulter que votre profil' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id - Mettre à jour un utilisateur
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour un utilisateur',
    description: "Met à jour partiellement les informations d'un utilisateur. Vous ne pouvez modifier que votre propre profil (sauf ADMIN).",
  })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur", example: 'cm2xxxxxxxxxxxx' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur mis à jour avec succès',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé - vous ne pouvez modifier que votre profil' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto, @GetUser() user: UserResponseDto) {
    return this.usersService.update(id, updateUserDto, user.role);
  }

  /**
   * DELETE /users/:id - Supprimer un utilisateur
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnerGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description: 'Supprime définitivement un utilisateur. Vous ne pouvez supprimer que votre propre compte (sauf ADMIN).',
  })
  @ApiParam({ name: 'id', description: "ID de l'utilisateur", example: 'cm2xxxxxxxxxxxx' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé - vous ne pouvez supprimer que votre compte' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

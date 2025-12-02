import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users - Créer un nouvel utilisateur (création administrative)
   * Pour l'inscription publique, utiliser /auth/register
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un nouvel utilisateur',
    description: 'Création administrative d\'un utilisateur. Pour l\'inscription publique, utiliser /auth/register.',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users - Récupérer tous les utilisateurs
   */
  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les utilisateurs',
    description: 'Retourne la liste de tous les utilisateurs enregistrés.',
  })
  @ApiResponse({ status: 200, description: 'Liste des utilisateurs', type: [UserResponseDto] })
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id - Récupérer un utilisateur par ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un utilisateur par ID',
    description: 'Retourne les détails d\'un utilisateur spécifique.',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur', example: 'cm2xxxxxxxxxxxx' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id - Mettre à jour un utilisateur
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Mettre à jour un utilisateur',
    description: 'Met à jour partiellement les informations d\'un utilisateur.',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur', example: 'cm2xxxxxxxxxxxx' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour avec succès', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id - Supprimer un utilisateur
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un utilisateur',
    description: 'Supprime définitivement un utilisateur.',
  })
  @ApiParam({ name: 'id', description: 'ID de l\'utilisateur', example: 'cm2xxxxxxxxxxxx' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

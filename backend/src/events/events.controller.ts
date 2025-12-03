import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserResponseDto } from '../users/dto/user-response.dto';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * POST /events - Créer un nouvel événement
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer un nouvel événement',
    description: 'Crée un événement pour une entreprise dont l\'utilisateur connecté est propriétaire.',
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Événement créé avec succès',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé - vous devez être propriétaire de l\'entreprise' })
  @ApiResponse({ status: 404, description: 'Entreprise non trouvée' })
  create(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: UserResponseDto,
  ) {
    return this.eventsService.create(createEventDto, createEventDto.companyId, user.id);
  }

  /**
   * GET /events - Récupérer tous les événements (PUBLIC)
   */
  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les événements',
    description: 'Retourne la liste de tous les événements publics. Accessible sans authentification.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des événements',
    type: [EventResponseDto],
  })
  findAll() {
    return this.eventsService.findAll();
  }

  /**
   * GET /events/my-events - Récupérer mes événements
   */
  @Get('my-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Récupérer mes événements',
    description: 'Retourne tous les événements appartenant aux entreprises de l\'utilisateur connecté.',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste de mes événements',
    type: [EventResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  findAllByOwner(@GetUser() user: UserResponseDto) {
    return this.eventsService.findAllByOwner(user.id);
  }

  /**
   * GET /events/:id - Récupérer un événement par ID (PUBLIC)
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Récupérer un événement par ID',
    description: 'Retourne les détails d\'un événement spécifique. Accessible sans authentification.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'événement',
    example: 'cm3xxxxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Événement trouvé',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOnePublic(id);
  }

  /**
   * PATCH /events/:id - Mettre à jour un événement
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Mettre à jour un événement',
    description: 'Met à jour partiellement les informations d\'un événement.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'événement',
    example: 'cm3xxxxxxxxxxxx',
  })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Événement mis à jour avec succès',
    type: EventResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @GetUser() user: UserResponseDto,
  ) {
    return this.eventsService.update(id, updateEventDto, user.id, user.role);
  }

  /**
   * DELETE /events/:id - Supprimer un événement
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Supprimer un événement',
    description: 'Supprime définitivement un événement.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de l\'événement',
    example: 'cm3xxxxxxxxxxxx',
  })
  @ApiResponse({ status: 200, description: 'Événement supprimé avec succès' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  remove(@Param('id') id: string, @GetUser() user: UserResponseDto) {
    return this.eventsService.remove(id, user.id, user.role);
  }
}

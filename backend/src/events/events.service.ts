import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Prisma, Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    companyId: string,
    userId: string,
  ): Promise<EventResponseDto> {
    // Vérifier que la company existe et que l'utilisateur en est le propriétaire
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Entreprise avec l'ID ${companyId} non trouvée.`);
    }

    if (company.ownerId !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez créer un événement que pour une entreprise dont vous êtes propriétaire.',
      );
    }

    try {
      // Créer l'événement
      const event = await this.prisma.event.create({
        data: {
          name: createEventDto.name,
          date: createEventDto.date,
          description: createEventDto.description,
          pricing: createEventDto.pricing,
          location: createEventDto.location
            ? JSON.parse(JSON.stringify(createEventDto.location))
            : undefined,
          companyId: companyId,
          website: createEventDto.website,
        },
      });

      // Créer les médias si présents
      if (createEventDto.media && createEventDto.media.length > 0) {
        await this.mediaService.createMany(createEventDto.media, event.id);
      }

      // Récupérer l'événement avec les médias
      const eventWithMedia = await this.prisma.event.findUnique({
        where: { id: event.id },
        include: { media: true },
      });

      if (!eventWithMedia) {
        throw new InternalServerErrorException('Événement introuvable après création.');
      }

      return new EventResponseDto(eventWithMedia);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException(`Un événement avec ce nom ${createEventDto.name} existe déjà.`);
      }
      throw new InternalServerErrorException("Erreur lors de la création de l'événement.");
    }
  }

  async findAll(): Promise<EventResponseDto[]> {
    const events = await this.prisma.event.findMany({
      include: { media: true },
      orderBy: { date: 'desc' },
    });
    return events.map(event => new EventResponseDto(event));
  }

  async findAllByOwner(userId: string): Promise<EventResponseDto[]> {
    const events = await this.prisma.event.findMany({
      where: {
        company: {
          ownerId: userId,
        },
      },
      include: { media: true },
      orderBy: { date: 'desc' },
    });
    return events.map(event => new EventResponseDto(event));
  }

  async findOnePublic(id: string): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        media: true,
        company: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé.`);
    }

    return new EventResponseDto(event);
  }

  async findOne(id: string, userId: string, userRole: Role): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        media: true,
        company: true,
      },
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé.`);
    }

    // Vérifier que l'utilisateur est propriétaire de la company (sauf admin)
    if (userRole !== Role.ADMIN && event.company.ownerId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cet événement.");
    }

    return new EventResponseDto(event);
  }

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
    userRole: Role,
  ): Promise<EventResponseDto> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé.`);
    }

    // Vérifier que l'utilisateur est propriétaire de la company (sauf admin)
    if (userRole !== Role.ADMIN && event.company.ownerId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cet événement.");
    }

    try {
      const updatedEvent = await this.prisma.event.update({
        where: { id },
        data: {
          name: updateEventDto.name ?? undefined,
          date: updateEventDto.date ?? undefined,
          description: updateEventDto.description ?? undefined,
          pricing: updateEventDto.pricing ?? undefined,
          location: updateEventDto.location
            ? JSON.parse(JSON.stringify(updateEventDto.location))
            : undefined,
          website: updateEventDto.website ?? undefined,
        },
        include: { media: true },
      });

      return new EventResponseDto(updatedEvent);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(`Un événement avec ce nom existe déjà.`);
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`Événement avec l'ID ${id} non trouvé.`);
      }
      throw new InternalServerErrorException("Erreur lors de la mise à jour de l'événement.");
    }
  }

  async remove(id: string, userId: string, userRole: Role): Promise<{ message: string }> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { company: true },
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé.`);
    }

    // Vérifier que l'utilisateur est propriétaire de la company (sauf admin)
    if (userRole !== Role.ADMIN && event.company.ownerId !== userId) {
      throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer cet événement.");
    }

    try {
      await this.prisma.event.delete({
        where: { id },
      });

      return { message: `Événement ${event.name} supprimé avec succès.` };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Événement avec l'ID ${id} non trouvé.`);
      }
      throw new InternalServerErrorException("Erreur lors de la suppression de l'événement.");
    }
  }
}

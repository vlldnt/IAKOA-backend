import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventResponseDto } from './dto/event-response.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) { }

  async create(createEventDto: CreateEventDto, companyId: string): Promise<EventResponseDto> {
    try {
      // Créer l'événement
      const event = await this.prisma.event.create({
        data: {
          name: createEventDto.name,
          date: createEventDto.date,
          description: createEventDto.description,
          pricing: createEventDto.pricing,
          location: createEventDto.location ? JSON.parse(JSON.stringify(createEventDto.location)) : undefined,
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
      if (error.code === 'P2002') {
        throw new ConflictException(`Un événement avec ce nom ${createEventDto.name} existe déjà.`);
      }
      throw new InternalServerErrorException('Erreur lors de la création de l\'événement.');
    }
  }

  findAll() {
    return `This action returns all events`;
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  update(id: number, updateEventDto: UpdateEventDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}

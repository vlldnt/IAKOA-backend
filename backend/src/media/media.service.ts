import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaResponseDto } from './dto/media-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(
    createMediaDtos: CreateMediaDto[],
    eventId: string,
  ): Promise<MediaResponseDto[]> {
    try {
      const mediaData = createMediaDtos.map((dto) => ({
        url: dto.url,
        type: dto.type,
        eventId: eventId,
      }));

      const createdMedia = await this.prisma.$transaction(
        mediaData.map((data) => this.prisma.media.create({ data })),
      );

      return createdMedia.map((media) => new MediaResponseDto(media));
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la création des médias.',
      );
    }
  }

  async findByEventId(eventId: string): Promise<MediaResponseDto[]> {
    try {
      const media = await this.prisma.media.findMany({
        where: { eventId },
        orderBy: { createdAt: 'asc' },
      });

      return media.map((m) => new MediaResponseDto(m));
    } catch (error) {
      throw new InternalServerErrorException(
        'Erreur lors de la récupération des médias.',
      );
    }
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { Media } from '@prisma/client';

export class MediaResponseDto {
  @ApiProperty({
    description: 'Identifiant unique du média',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création du média',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-01-20T14:45:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'URL du média',
    example: 'https://example.com/images/event-photo.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Type de média',
    example: 'image/jpeg',
  })
  type: string;

  @ApiProperty({
    description: "ID de l'événement associé",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  eventId: string;

  constructor(media: Media) {
    this.id = media.id;
    this.createdAt = media.createdAt;
    this.updatedAt = media.updatedAt;
    this.url = media.url;
    this.type = media.type;
    this.eventId = media.eventId;
  }
}

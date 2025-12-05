// Réponse API évènement: format de sortie
import { ApiProperty } from '@nestjs/swagger';
import { Event } from '@prisma/client';
import { MediaResponseDto } from '../../media/dto/media-response.dto';

export class EventResponseDto {
  @ApiProperty({
    description: "Identifiant unique de l'évènement",
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: "Date de création de l'évènement",
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-01-20T14:45:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Nom de l'évènement",
    example: "Soirée jeux de société au bar 'Le TEX'",
  })
  name: string;

  @ApiProperty({
    description: "Date de l'évènement",
    example: '2024-12-25T20:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: "Description détaillée de l'évènement",
    example:
      "Venez profiter d'une soirée conviviale autour de jeux de société. Ambiance garantie !",
  })
  description: string;

  @ApiProperty({
    description: "Prix de l'évènement en centimes",
    example: 2500,
  })
  pricing: number;

  @ApiProperty({
    description: "Localisation de l'évènement",
    example: {
      address: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
  })
  location: Record<string, any>;

  @ApiProperty({
    description: 'ID de la société organisatrice',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  companyId: string;

  @ApiProperty({
    description: "Site web de l'évènement",
    example: 'https://example.com/event',
    nullable: true,
  })
  website: string | null;

  @ApiProperty({
    description: "Liste des médias associés à l'évènement",
    type: [MediaResponseDto],
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
        url: 'https://example.com/images/event1.jpg',
        type: 'image/jpeg',
        eventId: '550e8400-e29b-41d4-a716-446655440000',
      },
    ],
  })
  media: MediaResponseDto[];

  constructor(event: Event & { media?: any[] }) {
    this.id = event.id;
    this.createdAt = event.createdAt;
    this.updatedAt = event.updatedAt;
    this.name = event.name;
    this.date = event.date;
    this.description = event.description;
    this.pricing = event.pricing;
    this.location = event.location as Record<string, any>;
    this.companyId = event.companyId;
    this.website = event.website;
    this.media = event.media ? event.media.map(m => new MediaResponseDto(m)) : [];
  }
}

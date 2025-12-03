// Réponse API entreprise: format de sortie.
import { ApiProperty } from "@nestjs/swagger";
import { SocialNetworksDto } from "./social-networks.dto";
import { Company } from "@prisma/client";

export class CompanyResponseDto {
  @ApiProperty({
    description: "Identifiant unique de l'entreprise",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  id: string;

  @ApiProperty({
    description: "Date de création de l'entreprise",
    example: "2024-01-15T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Date de dernière mise à jour",
    example: "2024-01-20T14:45:00.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Nom de l'entreprise",
    example: "Entreprise SARL",
  })
  name: string;

  @ApiProperty({
    description: "Numéro SIREN de l'entreprise",
    example: "123456789",
  })
  siren: string;

  @ApiProperty({
    description: "Statut de validation de l'entreprise",
    example: false,
  })
  isValidated: boolean;

  @ApiProperty({
    description: "Site web de l'entreprise",
    example: "https://www.entreprise.com",
    required: false,
  })
  website?: string;

  @ApiProperty({
    description: "Description de l'entreprise",
    example: "Une entreprise spécialisée dans...",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Réseaux sociaux de l'entreprise",
    type: SocialNetworksDto,
    required: false,
  })
  socialNetworks?: SocialNetworksDto;

  @ApiProperty({
    description: "Identifiant du propriétaire de l'entreprise",
    example: "cm2xxxxxxxxxxxx",
  })
  ownerId: string;

  @ApiProperty({
    description: "Liste des événements de l'entreprise",
    type: [String],
    example: [],
    required: false,
  })
  eventsList?: string[];

  constructor(company: Company) {
    this.id = company.id;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
    this.name = company.name;
    this.siren = company.siren;
    this.isValidated = company.isValidated;
    this.website = company.website ?? undefined;
    this.description = company.description ?? undefined;
    this.socialNetworks = company.socialNetworks as SocialNetworksDto;
    this.ownerId = company.ownerId;
    this.eventsList = [];
  }
}

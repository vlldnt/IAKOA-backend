// Création entreprise: nom, description, site, réseaux sociaux.
import {
  IsString,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsUrl,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SocialNetworksDto } from './social-networks.dto';

export class CreateCompanyDto {
  @ApiProperty({
    description: "Nom de l'entreprise",
    example: 'Entreprise SARL',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100, { message: "Le nom de l'entreprise ne peut pas dépasser 100 caractères" })
  name: string;

  @ApiProperty({
    description: "Numéro SIREN de l'entreprise (9 chiffres)",
    example: '123456789',
    pattern: '^\\d{9}$',
  })
  @IsString()
  @Matches(/^\d{9}$/, { message: 'Le SIREN doit contenir exactement 9 chiffres' })
  siren: string;

  @ApiProperty({
    description: "Description de l'entreprise",
    example: 'Une entreprise spécialisée dans...',
    maxLength: 300,
    required: false,
  })
  @IsString()
  @MaxLength(300, { message: 'La description ne peut pas dépasser 300 caractères' })
  description?: string;

  @ApiProperty({
    description: "Statut de validation de l'entreprise",
    example: false,
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isValidated?: boolean;

  @ApiProperty({
    description: "Site web de l'entreprise",
    example: 'https://www.entreprise.com',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL de site web invalide' })
  @MaxLength(500, { message: 'Le site web ne peut pas dépasser 500 caractères' })
  website?: string;

  @ApiProperty({
    description: "Réseaux sociaux de l'entreprise",
    type: SocialNetworksDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialNetworksDto)
  socialNetworks?: SocialNetworksDto;
}

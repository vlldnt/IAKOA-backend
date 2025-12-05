// Réseaux sociaux: URLs optionnelles validées.
import { IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SocialNetworksDto {
  @ApiProperty({
    description: 'URL de la page Facebook',
    example: 'https://www.facebook.com/entreprise',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({
    description: 'URL du compte Instagram',
    example: 'https://www.instagram.com/entreprise',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({
    description: 'URL du compte X (Twitter)',
    example: 'https://x.com/entreprise',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  x?: string;

  @ApiProperty({
    description: 'URL de la chaîne YouTube',
    example: 'https://www.youtube.com/@entreprise',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  youtube?: string;

  @ApiProperty({
    description: 'URL du compte TikTok',
    example: 'https://www.tiktok.com/@entreprise',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  tiktok?: string;
}

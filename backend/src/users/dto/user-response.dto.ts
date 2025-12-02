import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// Réponse API utilisateur: format public des données.
export class UserResponseDto {
  @ApiProperty({
    description: 'Identifiant unique de l\'utilisateur',
    example: 'cm2xxxxxxxxxxxx',
  })
  id: string;

  @ApiProperty({
    description: 'Date de création du compte',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date de dernière mise à jour',
    example: '2024-01-20T14:45:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Nom de l\'utilisateur',
    example: 'Jean Dupont',
  })
  name: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'jean.dupont@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Rôle de l\'utilisateur dans le système',
    example: 'USER',
    enum: Role,
  })
  role: Role;

  @ApiProperty({
    description: 'Indique si l\'utilisateur est un créateur de contenu',
    example: false,
  })
  isCreator: boolean;
}

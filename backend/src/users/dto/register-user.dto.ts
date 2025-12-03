// DTO pour l'inscription publique: nom, email, mot de passe uniquement
import { IsEmail, IsString, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Nom de l\'utilisateur',
    example: 'Jean Dupont',
    maxLength: 30,
  })
  @IsString()
  @MaxLength(30, { message: 'Le nom ne peut pas dépasser 30 caractères' })
  name: string;

  @ApiProperty({
    description: 'Adresse email de l\'utilisateur',
    example: 'jean.dupont@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Format d\'email invalide'
  })
  email: string;

  @ApiProperty({
    description: 'Mot de passe (min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)',
    example: 'Password123!',
    minLength: 8,
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message:
      'Mot de passe: min 8, 1 majuscule, 1 chiffre, 1 spécial',
  })
  password: string;
}

// Création utilisateur administrative: nom, email, mot de passe, isCreator (optionnel), role (optionnel)
// Pour l'inscription publique, utiliser RegisterUserDto
import { IsEmail, IsString, MaxLength, IsOptional, IsBoolean, Matches, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({
    description: "Nom de l'utilisateur",
    example: 'Jean Dupont',
    maxLength: 30,
  })
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MaxLength(30, { message: 'Le nom ne peut pas dépasser 30 caractères' })
  @Matches(/^(?!\s*$).+/, { message: 'Le nom ne peut pas être vide' })
  name: string;

  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email invalide' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: "Format d'email invalide",
  })
  email: string;

  @ApiProperty({
    description: 'Mot de passe (min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial)',
    example: 'Password123!',
    minLength: 8,
  })
  @IsString({ message: 'Le mot de passe doit être une chaîne de caractères' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message: 'Mot de passe: min 8, 1 majuscule, 1 chiffre, 1 spécial',
  })
  password: string;

  @ApiPropertyOptional({
    description:
      "Indique si l'utilisateur est un créateur de contenu (réservé aux administrateurs)",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCreator?: boolean;

  @ApiPropertyOptional({
    description:
      "Rôle de l'utilisateur (réservé aux administrateurs)",
    example: 'USER',
    enum: Role,
    default: 'USER',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Le rôle doit être USER ou ADMIN' })
  role?: Role;
}

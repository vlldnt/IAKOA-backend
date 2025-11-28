// Création utilisateur: valider nom, email, mot de passe.
import { IsEmail, IsString, MaxLength, IsOptional, IsBoolean, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(30, { message: 'Le nom ne peut pas dépasser 30 caractères' })
  name: string;

  @IsEmail({}, { message: 'Email invalide' })
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Format d\'email invalide'
  })
  email: string;

  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/, {
    message:
      'Mot de passe: min 8, 1 majuscule, 1 chiffre, 1 spécial',
  })
  password: string;

  @IsOptional()
  @IsBoolean()
  isCreator?: boolean;
}

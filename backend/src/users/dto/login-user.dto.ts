// Connexion utilisateur: email et mot de passe.
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: "Adresse email de l'utilisateur",
    example: 'jean.dupont@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    description: "Mot de passe de l'utilisateur",
    example: 'Password123!',
  })
  @IsString()
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserFavoriteDto {
  @ApiProperty({
    description: "ID de l'utilisateur",
    example: 'cm2xxxxxxxxxxxx',
  })
  @IsNotEmpty({ message: "L'ID utilisateur est requis" })
  @IsString({ message: "L'ID utilisateur doit être une chaîne de caractères" })
  @IsUUID('4', { message: "L'ID utilisateur doit être un UUID valide" })
  userId: string;

  @ApiProperty({
    description: "ID de l'événement",
    example: 'cm2yyyyyyyyyyyy',
  })
  @IsNotEmpty({ message: "L'ID événement est requis" })
  @IsString({ message: "L'ID événement doit être une chaîne de caractères" })
  @IsUUID('4', { message: "L'ID événement doit être un UUID valide" })
  eventId: string;
}

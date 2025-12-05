import { IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({
    description: 'URL du média',
    example: 'https://example.com/images/event-photo.jpg',
  })
  @IsUrl({}, { message: "L'URL doit être valide." })
  url: string;

  @ApiProperty({ description: 'Type de média', maxLength: 50, example: 'image/jpeg' })
  @IsString({ message: 'Le type doit être une chaîne de caractères.' })
  @MaxLength(50, { message: 'Le type ne peut pas dépasser 50 caractères.' })
  type: string;
}

import { IsString, IsDateString, MaxLength, IsInt, Min, IsUUID, IsOptional, IsUrl, IsObject, IsArray, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CreateMediaDto } from "../../media/dto/create-media.dto";

export class CreateEventDto {
    @ApiProperty({ description: "Nom de l'événement", maxLength: 100, example: "Concert de Jazz" })
    @IsString({ message: "Le nom doit être une chaîne de caractères." })
    @MaxLength(100, { message: "Le nom de l'événement ne peut pas dépasser 100 caractères." })
    name: string;

    @ApiProperty({ description: "Date de l'événement", example: "2024-12-25T20:00:00Z" })
    @IsDateString({}, { message: "La date doit être au format ISO 8601 valide." })
    date: string;

    @ApiProperty({ description: "Description de l'événement", maxLength: 5000, example: "Un concert exceptionnel..." })
    @IsString({ message: "La description doit être une chaîne de caractères." })
    @MaxLength(5000, { message: "La taille maximale de la description est de 5000 caractères." })
    description: string;

    @ApiProperty({ description: "Prix de l'événement en centimes", minimum: 0, default: 0, example: 2500 })
    @IsInt({ message: "Le prix doit être un nombre entier." })
    @Min(0, { message: "Le prix ne peut pas être négatif." })
    pricing: number;

    @ApiProperty({
        description: "Localisation de l'événement (format JSON)",
        example: { address: "123 Rue de la Paix", city: "Paris", postalCode: "75001", country: "France", coordinates: { lat: 48.8566, lng: 2.3522 } }
    })
    @IsObject({ message: "La localisation doit être un objet JSON valide." })
    location: Record<string, any>;

    @ApiProperty({ description: "ID de la société organisatrice", example: "550e8400-e29b-41d4-a716-446655440000" })
    @IsUUID("4", { message: "L'ID de la société doit être un UUID valide." })
    companyId: string;

    @ApiProperty({ description: "Site web de l'événement", required: false, example: "https://example.com/event" })
    @IsOptional()
    @IsUrl({}, { message: "Le site web doit être une URL valide." })
    website?: string;

    @ApiProperty({
        description: "Liste des médias associés à l'événement",
        required: false,
        type: [CreateMediaDto],
        example: [
            { url: "https://example.com/images/event1.jpg", type: "image/jpeg" },
            { url: "https://example.com/images/event2.jpg", type: "image/jpeg" }
        ]
    })
    @IsOptional()
    @IsArray({ message: "Les médias doivent être un tableau." })
    @ValidateNested({ each: true })
    @Type(() => CreateMediaDto)
    media?: CreateMediaDto[];
}

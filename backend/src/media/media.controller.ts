import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { MediaResponseDto } from './dto/media-response.dto';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * GET /media/:eventId - Récupérer les médias d'un événement (PUBLIC)
   */
  @Get(':eventId')
  @ApiOperation({
    summary: "Récupérer les médias d'un événement",
    description:
      'Retourne tous les médias associés à un événement public. Accessible sans authentification.',
  })
  @ApiParam({
    name: 'eventId',
    description: "ID de l'événement",
    example: 'cm3xxxxxxxxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: "Liste des médias de l'événement",
    type: [MediaResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Événement non trouvé' })
  findByEventId(@Param('eventId') eventId: string) {
    return this.mediaService.findByEventIdPublic(eventId);
  }
}

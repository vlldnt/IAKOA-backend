import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Vérifie l\'état de santé de l\'application.',
  })
  @ApiResponse({
    status: 200,
    description: 'Application en bonne santé',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        uptime: { type: 'number', example: 12345.67 },
      },
    },
  })
  check() {
    function formatUptime(seconds: number) {
      const days = Math.floor(seconds / (24 * 3600));
      seconds %= 24 * 3600;
      const hours = Math.floor(seconds / 3600);
      seconds %= 3600;
      const minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      return `${days}j ${hours}h ${minutes}m ${seconds}s`;
    }

    return {
      status: 'Serveur IAKOA-backend fonctionne.',
      timestamp: new Date().toISOString(),
      uptime: formatUptime(process.uptime()),
    };
  }
}

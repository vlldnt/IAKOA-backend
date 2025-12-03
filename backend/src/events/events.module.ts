import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MediaModule } from 'src/media/media.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}

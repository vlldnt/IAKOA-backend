import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}

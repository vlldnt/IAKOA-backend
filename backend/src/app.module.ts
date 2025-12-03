import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';
import { CompaniesModule } from './companies/companies.module';
import { EventsResolver } from './events/events.resolver';
import { EventsModule } from './events/events.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    EventsModule,
    MediaModule,
  ],
  controllers: [HealthController],
  providers: [EventsResolver],
})
export class AppModule {}

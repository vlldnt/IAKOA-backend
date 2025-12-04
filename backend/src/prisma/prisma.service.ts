import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private pool: Pool;

  constructor() {
    const pool = new Pool({
      host: process.env.PGHOST || '127.0.0.1',
      port: parseInt(process.env.PGPORT || '5432'),
      user: process.env.PGUSER || 'iakoa_dev',
      password: process.env.PGPASSWORD || 'Awlmpzw12',
      database: process.env.PGDATABASE || 'iakoa-backend',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log: [
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
      errorFormat: 'pretty',
    });

    this.pool = pool;

    // Log Prisma errors and warnings only
    this.$on('error' as never, (e: any) => {
      // Extraire un message d'erreur plus clair
      const errorMessage = this.formatPrismaError(e);
      this.logger.error(`Prisma Error: ${errorMessage}`);
    });

    this.$on('warn' as never, (e: any) => {
      this.logger.warn(`Prisma Warning: ${e.message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to database');
      // Test query
      const count = await this.user.count();
      this.logger.log(`📊 Database has ${count} users`);
    } catch (error) {
      this.logger.error('❌ Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    this.logger.log('Disconnected from database');
  }

  /**
   * Formate les erreurs Prisma pour les rendre plus lisibles
   */
  private formatPrismaError(e: any): string {
    const message = e.message || '';
    const target = e.target || '';

    // Extraire le message d'erreur principal sans les détails de code
    if (message.includes('invalid input syntax for type uuid')) {
      const match = message.match(/invalid input syntax for type uuid: "(.*?)"/);
      const invalidValue = match ? match[1] : 'valeur invalide';
      return `UUID invalide: "${invalidValue}" (table: ${target})`;
    }

    if (message.includes('No record was found for an update')) {
      return `Enregistrement introuvable pour mise à jour (table: ${target})`;
    }

    if (message.includes('Unique constraint failed')) {
      const match = message.match(/Unique constraint failed on the fields: \((.*?)\)/);
      const fields = match ? match[1] : 'champ inconnu';
      return `Contrainte d'unicité violée sur: ${fields}`;
    }

    if (message.includes('Foreign key constraint failed')) {
      return `Contrainte de clé étrangère violée (table: ${target})`;
    }

    // Si aucun pattern ne correspond, retourner un message simplifié
    const firstLine = message.split('\n')[0];
    return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
  }
}
    
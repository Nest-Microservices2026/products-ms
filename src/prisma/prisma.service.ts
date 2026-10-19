
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger('PrismaService');

    constructor(configService: ConfigService) {
        const adapter = new PrismaBetterSqlite3({
            url: configService.getOrThrow<string>('DATABASE_URL'),
        });
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Data base connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

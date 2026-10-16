import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductService],
  imports: [PrismaModule]
})
export class ProductsModule { }

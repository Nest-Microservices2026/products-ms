
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto
    })
    return product;
  }

}

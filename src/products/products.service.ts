
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto';


@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto
    })
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPage = await this.prisma.product.count();

    const lastPage = Math.ceil(totalPage / limit!);

    return {
      data: await this.prisma.product.findMany({
        skip: (page! - 1) * limit!,
        take: limit
      }),
      meta: {
        totalpage: totalPage,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: id
      }
    });

    if (!product) {
      throw new NotFoundException(`The product with the id : ${id} was not found`);
    }
    return product;
  }
}


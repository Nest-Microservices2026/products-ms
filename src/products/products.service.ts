
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto.js';


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

    const totalPage = await this.prisma.product.count({
      where:{available:true}
    });

    const lastPage = Math.ceil(totalPage / limit!);

    return {
      data: await this.prisma.product.findMany({
        skip: (page! - 1) * limit!,
        take: limit,
        where:({available:true})
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
        id: id,
        available:true
      }
    });

    if (!product) {
      throw new NotFoundException(`The product with the id : ${id} was not found`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const { name, price } = updateProductDto;
    const product = await this.prisma.product.update({
      where: {
        id: id
      },
      data: {
        name: name,
        price: price
      }
    })
    return product;
  }

  async remove(id: number) {
    await this.findOne(id);
    //This is #1 option
    // await this.prisma.product.delete({
    //   where: {
    //     id: id
    //   }
    // });

    // This is the #2 option
    await this.prisma.product.update({
      where: { id: id },
      data: { available: false }
    })
    return {
      message: "The product has been deleted."
    }
  }
}


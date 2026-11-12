
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) { }


  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: createProductDto
      });

      return product;

    } catch (error) {
      throw new RpcException({
        message: error,
        status: HttpStatus.BAD_REQUEST
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPage = await this.prisma.product.count({
      where: { available: true }
    });

    const lastPage = Math.ceil(totalPage / limit!);

    return {
      data: await this.prisma.product.findMany({
        skip: (page! - 1) * limit!,
        take: limit,
        where: ({ available: true })
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
        available: true
      }
    });

    if (!product) {
      throw new RpcException({
        message: `The product with the id : ${id} was not found`,
        status: HttpStatus.BAD_REQUEST
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { ...data } = updateProductDto;
    await this.findOne(id);
    const product = await this.prisma.product.update({
      where: {
        id: id
      },
      data: {
        ...data
      }
    })
    return product;
  }


  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.update({
      where: { id: id },
      data: { available: false }
    });
    return {
      message: "The product has been deleted."
    }
  }

  async validateProducts(ids: number[]) {
    ids = Array.from(new Set(ids));

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        message: "Some products were not found.",
        status: HttpStatus.BAD_REQUEST
      });
    }

    return products;
  }
}


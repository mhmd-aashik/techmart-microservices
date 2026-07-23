import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [products, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count(),
    ]);

    return {
      products,
      totalItems,
    };
  }

  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }
}

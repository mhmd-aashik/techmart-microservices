import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const normalizedSearch = search?.trim();

    const where: Prisma.ProductWhereInput = normalizedSearch
      ? {
          OR: [
            {
              name: {
                contains: normalizedSearch,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: normalizedSearch,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              sku: {
                contains: normalizedSearch,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [products, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({
        where,
      }),
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

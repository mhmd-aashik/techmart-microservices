import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Prisma } from 'generated/prisma/client';
import { GetProductsDto } from '../dto/get-products.dto';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll(query: GetProductsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const normalizedSearch = search?.trim();

    const where: Prisma.ProductWhereInput = {
      ...(normalizedSearch
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
        : {}),

      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined
                ? { gte: new Prisma.Decimal(minPrice) }
                : {}),
              ...(maxPrice !== undefined
                ? { lte: new Prisma.Decimal(maxPrice) }
                : {}),
            },
          }
        : {}),

      ...(inStock === true
        ? {
            stockQuantity: {
              gt: 0,
            },
          }
        : {}),

      ...(inStock === false
        ? {
            stockQuantity: 0,
          }
        : {}),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [products, totalItems] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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

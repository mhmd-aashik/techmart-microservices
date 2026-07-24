import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { Prisma, Product } from 'generated/prisma/client';
import { GetProductsDto } from '../dto/get-products.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

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
      isActive: true,
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
        isActive: true,
      },
    });
  }

  async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
    const data: Prisma.ProductUpdateInput = {
      ...(dto.name !== undefined && {
        name: dto.name,
      }),
      ...(dto.description !== undefined && {
        description: dto.description,
      }),
      ...(dto.sku !== undefined && {
        sku: dto.sku,
      }),
      ...(dto.price !== undefined && {
        price: new Prisma.Decimal(dto.price),
      }),
      ...(dto.stockQuantity !== undefined && {
        stockQuantity: dto.stockQuantity,
      }),
    };

    return this.prisma.product.update({
      where: { id, isActive: true },
      data,
    });
  }

  async updateInventory(id: number, stockQuantity: number) {
    return this.prisma.product.update({
      where: {
        id,
        isActive: true,
      },
      data: {
        stockQuantity,
      },
    });
  }

  async disableProduct(id: number) {
    return this.prisma.product.update({
      where: {
        id,
        isActive: true,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsRepository } from '../repositories/products.repository';
import { GetProductsDto } from '../dto/get-products.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateProductDto } from '../dto/update-product.dto';
import { status } from '@grpc/grpc-js';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async create(dto: CreateProductDto) {
    return this.repository.createProduct(dto);
  }

  async findAll(query: GetProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { products, totalItems } = await this.repository.findAll(query);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      products,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: number) {
    return this.repository.findById(id);
  }

  async update(id: number, dto: UpdateProductDto) {
    if (Object.keys(dto).length === 0) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'At least one product field must be provided.',
      });
    }

    try {
      return await this.repository.updateProduct(id, dto);
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RpcException({
            code: status.NOT_FOUND,
            message: `Product ${id} was not found.`,
          });
        }

        if (error.code === 'P2002') {
          throw new RpcException({
            code: status.ALREADY_EXISTS,
            message: 'The SKU already exists.',
          });
        }
      }

      throw error;
    }
  }
}

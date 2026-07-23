import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly repository: ProductsRepository) {}

  async create(dto: CreateProductDto) {
    return this.repository.createProduct(dto);
  }

  async findAll(page: number, limit: number) {
    const { products, totalItems } = await this.repository.findAll(page, limit);

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
}

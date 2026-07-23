import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../services/products.service';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(dto: CreateProductDto) {
    const product = await this.productsService.create(dto);
    return {
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService', 'GetProducts')
  async getProducts() {
    const products = await this.productsService.findAll();

    return {
      products: products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      })),
    };
  }
}

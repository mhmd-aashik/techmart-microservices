import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsService } from '../services/products.service';
import { GetProductByIdDto } from '../dto/get-product-by-id.dto';
import { GetProductsDto } from '../dto/get-products.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

interface UpdateProductRequest extends UpdateProductDto {
  id: number;
}

interface UpdateInventoryRequest {
  id: number;
  stockQuantity: number;
}

interface DisableProductRequest {
  id: number;
}

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
  async getProducts(data: GetProductsDto) {
    const result = await this.productsService.findAll(data);

    return {
      products: result.products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      })),
      meta: result.meta,
    };
  }

  @GrpcMethod('ProductService', 'GetProductById')
  async getProductById(data: GetProductByIdDto) {
    const product = await this.productsService.findById(data.id);

    if (!product) {
      throw new RpcException('Product not found');
    }

    return {
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService', 'UpdateProduct')
  async updateProduct(request: UpdateProductRequest) {
    const { id, ...dto } = request;

    const product = await this.productsService.update(id, dto);

    return {
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService', 'UpdateInventory')
  async updateInventory(request: UpdateInventoryRequest) {
    const product = await this.productsService.updateInventory(
      request.id,
      request.stockQuantity,
    );

    return {
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }

  @GrpcMethod('ProductService', 'DisableProduct')
  async disableProduct(request: DisableProductRequest) {
    const product = await this.productsService.disableProduct(request.id);

    return {
      ...product,
      price: product.price.toNumber(),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      deletedAt: product.deletedAt?.toISOString(),
    };
  }
}

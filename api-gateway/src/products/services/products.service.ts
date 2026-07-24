import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  ProductResponse,
  ProductServiceClient,
} from '../interfaces/product-grpc.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { GetProductsQueryDto } from '../dto/get-products-query.dto';
import { Observable } from 'rxjs';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

@Injectable()
export class ProductsService implements OnModuleInit {
  private productService: ProductServiceClient;

  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceClient>('ProductService');
  }

  createProduct(dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  findAll(query: GetProductsQueryDto) {
    return this.productService.getProducts(query);
  }

  findById(id: number) {
    return this.productService.getProductById({
      id,
    });
  }

  update(id: number, dto: UpdateProductDto): Observable<ProductResponse> {
    return this.productService.updateProduct({
      id,
      ...dto,
    });
  }

  updateInventory(
    id: number,
    dto: UpdateInventoryDto,
  ): Observable<ProductResponse> {
    return this.productService.updateInventory({
      id,
      stockQuantity: dto.stockQuantity,
    });
  }
}

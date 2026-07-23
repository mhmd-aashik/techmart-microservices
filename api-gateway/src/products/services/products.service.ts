import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  GetProductsResponse,
  ProductServiceClient,
} from '../interfaces/product-grpc.interface';
import { CreateProductDto } from '../dto/create-product.dto';
import { Observable } from 'rxjs';

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

  findAll(): Observable<GetProductsResponse> {
    return this.productService.getProducts({});
  }
}

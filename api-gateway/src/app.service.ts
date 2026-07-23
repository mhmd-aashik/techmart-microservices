import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import {
  GetProductsResponse,
  ProductGrpcService,
} from 'src/product-grpc.interface';
import { Observable } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private productService!: ProductGrpcService;

  constructor(
    @Inject('PRODUCT_PACKAGE')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit(): void {
    this.productService =
      this.client.getService<ProductGrpcService>('ProductService');
  }

  getProducts(): Observable<GetProductsResponse> {
    return this.productService.getProducts({});
  }
}

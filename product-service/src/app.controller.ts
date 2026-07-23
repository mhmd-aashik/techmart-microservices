import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface GetProductsResponse {
  products: Product[];
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('ProductService', 'GetProducts')
  getProducts(): GetProductsResponse {
    return {
      products: [
        {
          id: 1,
          name: 'MacBook Pro',
          price: 1999,
        },
        {
          id: 2,
          name: 'Mechanical Keyboard',
          price: 120,
        },
      ],
    };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

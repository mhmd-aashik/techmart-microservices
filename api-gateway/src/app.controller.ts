import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { GetProductsResponse } from 'src/product-grpc.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getProducts(): Observable<GetProductsResponse> {
    return this.appService.getProducts();
  }
}

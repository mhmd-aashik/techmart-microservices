// src/products/products.module.ts

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsService } from './services/products.service';
import { join } from 'node:path';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'product',
          protoPath: join(process.cwd(), '../packages/proto/product.proto'),
          url: process.env.PRODUCT_SERVICE_GRPC_URL ?? 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

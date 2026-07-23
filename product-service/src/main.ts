import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(__dirname, '../../proto/product.proto'),
        url: 'localhost:50051',
      },
    },
  );
  await app.listen();
  console.log('Product Service gRPC server running on localhost:50051');
}
void bootstrap();

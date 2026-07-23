import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { GetProductsQueryDto } from '../dto/get-products-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query.page, query.limit);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { GetProductsQueryDto } from '../dto/get-products-query.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Patch(':id/inventory')
  updateInventory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.productsService.updateInventory(id, dto);
  }
}

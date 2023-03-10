import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { DeleteResult } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { ReturnProductDto } from './dtos/return-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dtos/update-product.dto';

@Roles(UserType.Admin, UserType.User)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  async findAll(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAll([], true)).map(
      (product) => new ReturnProductDto(product),
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProductDto);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct(
    @Body() updateProductDto: UpdateProductDto,
    @Param('productId') productId: number,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProductDto, productId);
  }
}

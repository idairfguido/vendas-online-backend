import { Body, Controller, Delete, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { UserId } from '../decorators/user-id.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CartService } from './cart.service';
import { InsertCartDto } from './dtos/insert-cart.dto';
import { ReturnCartDto } from './dtos/return-cart.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('cart')
export class CartController {

    constructor(
        private readonly cartService: CartService
    ) { }

    @UsePipes(ValidationPipe)
    @Post()
    async createCart(
        @Body() insertCartDto: InsertCartDto,
        @UserId() userId: number,
    ): Promise<ReturnCartDto> {
        return new ReturnCartDto(
            await this.cartService.insertProductInCart(insertCartDto, userId),
        );
    }

    @Get()
    async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto> {
        return new ReturnCartDto(
            await this.cartService.findCartByUserId(userId, true),
        );
    }

    @Delete()
    async clearCart(@UserId() userId: number): Promise<DeleteResult> {
        return this.cartService.clearCart(userId);
    }
}

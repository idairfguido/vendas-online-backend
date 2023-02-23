import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductService } from '../cart-product/cart-product.service';
import { Repository } from 'typeorm';
import { InsertCartDto } from './dtos/insert-cart.dto';
import { CartEntity } from './entities/cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartEntity)
        private readonly cartRepository: Repository<CartEntity>,
        private readonly cartProductService: CartProductService,
    ) { }

    async findCartById(
        userId: number,
        isRelations?: boolean
    ): Promise<CartEntity> {
        const relations = isRelations
            ? {
                cartProduct: {
                    product: true,
                },
            }
            : undefined;

        const cart = await this.cartRepository.findOne({
            where: {
                userId,
                active: true,
            },
            relations,
        });

        if (!cart) {
            throw new NotFoundException('Cart active not found');
        }

        return cart;
    }



    async createCart(userId: number): Promise<CartEntity> {
        return this.cartRepository.save({
            active: true,
            userId,
        });
    }

    async insertProductInCart(
        insertCartDto: InsertCartDto,
        userId: number,
    ): Promise<CartEntity> {
        const cart = await this.findCartById(userId).catch(async () => {
            return this.createCart(userId);
        });

        await this.cartProductService.insertProductInCart(insertCartDto, cart);

        return this.findCartById(userId, true);
    }
}

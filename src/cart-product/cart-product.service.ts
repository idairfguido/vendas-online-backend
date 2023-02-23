import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertCartDto } from '../cart/dtos/insert-cart.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { Repository } from 'typeorm';
import { CartProdutEntity } from './entities/cart-product.entity';

@Injectable()
export class CartProductService {
    constructor(
        @InjectRepository(CartProdutEntity)
        private readonly cartProductRepository: Repository<CartProdutEntity>,
    ) { }

    async verifyProductInCart(
        productId: number,
        cartId: number,
    ): Promise<CartProdutEntity> {
        const cartProduct = await this.cartProductRepository.findOne({
            where: {
                productId,
                cartId,
            },
        });

        if (!cartProduct) {
            throw new NotFoundException('Product not found in cart');
        }

        return cartProduct;
    }

    async createProductInCart(
        insertCartDto: InsertCartDto,
        cartId: number,
    ): Promise<CartProdutEntity> {
        return this.cartProductRepository.save({
            amount: insertCartDto.amount,
            productId: insertCartDto.productId,
            cartId,
        });
    }

    async insertProductInCart(
        insertCartDto: InsertCartDto,
        cart: CartEntity,
    ): Promise<CartProdutEntity> {
        const cartProduct = await this.verifyProductInCart(
            insertCartDto.productId,
            cart.id,
        ).catch(() => undefined);

        if (!cartProduct) {
            return this.createProductInCart(insertCartDto, cart.id);
        }

        return this.cartProductRepository.save({
            ...cartProduct,
            amount: cartProduct.amount + insertCartDto.amount,
        });
    }
}

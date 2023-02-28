import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type CreateOrderDto } from '../order/dtos/create-order.dto';
import { Repository } from 'typeorm';
import { PaymentType } from '../payment-status/enums/payment-type.enum';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { PaymentEntity } from './entities/payment.entity';
import { type CartEntity } from '../cart/entities/cart.entity';
import { type ProductEntity } from '../product/entities/product.entity';
import { type CartProductEntity } from '../cart-product/entities/cart-product.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) { }

  generateFinalPrice(cart: CartEntity, products: ProductEntity[]): number {
    if (!cart.cartProduct || cart.cartProduct.length === 0) {
      return 0
    }

    return Number(
      cart.cartProduct
        .map((cartProduct: CartProductEntity) => {
          const product = products.find(
            (product) => product.id === cartProduct.productId,
          );
          if (product) {
            return cartProduct.amount * product.price;
          }

          return 0;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        .toFixed(2),
    );
  }

  async createPayment(
    createOrderDto: CreateOrderDto,
    products: ProductEntity[],
    cart: CartEntity
  ): Promise<PaymentEntity> {
    const finalPrice = this.generateFinalPrice(cart, products)
    if (createOrderDto.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDto
      )
      return await this.paymentRepository.save(paymentCreditCard)
    } else if (createOrderDto.codePix && createOrderDto.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDto
      )
      return await this.paymentRepository.save(paymentPix)
    }

    throw new BadRequestException(
      'Amount Payments or code pix or date payment not found'
    )
  }
}

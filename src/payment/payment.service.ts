import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderDto } from "../order/dtos/create-order.dto";
import { Repository } from "typeorm";
import { PaymentType } from "../payment-status/enums/payment-type.enum";
import { PaymentCreditCardEntity } from "./entities/payment-credit-card.entity";
import { PaymentPixEntity } from "./entities/payment-pix.entity";
import { PaymentEntity } from "./entities/payment.entity";
import { CartEntity } from "src/cart/entities/cart.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { CartProductEntity } from "src/cart-product/entities/cart-product.entity";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) { }

  async createPayment(
    createOrderDto: CreateOrderDto,
    products: ProductEntity[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {
    const finalPrice = cart.cartProduct
      ?.map((cartProduct: CartProductEntity) => {
        const product = products.find(
          (product) => product.id === cartProduct.productId,
        );
        console.log('product', products);
        if (product) {
          return cartProduct.amount * product.price;
        }

        return 0;
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    if (createOrderDto.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDto,
      );
      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDto.codePix && createOrderDto.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        finalPrice,
        0,
        finalPrice,
        createOrderDto
      );
      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException(
      "Amount Payments or code pix or date payment not found"
    );
  }
}

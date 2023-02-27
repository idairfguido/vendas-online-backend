import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderEntity } from "./entities/order.entity";
import { PaymentService } from "../payment/payment.service";
import { PaymentEntity } from "../payment/entities/payment.entity";
import { CartService } from "../cart/cart.service";
import { OrderProductService } from "../order-product/order-product.service";
import { ProductService } from "../product/product.service";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) { }

  async createOrder(
    createOrderDto: CreateOrderDto,
    cartId: number,
    userId: number
  ): Promise<OrderEntity> {
    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrderDto
    );

    const order = await this.orderRepository.save({
      addressId: createOrderDto.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    });

    const cart = await this.cartService.findCartByUserId(userId, true);

    const products = await this.productService.findAll(
      cart.cartProduct?.map((cartProduct) => cartProduct.productId),
    );

    await Promise.all(
      cart.cartProduct?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.productId,
          order.id,
          products.find((product) => product.id === cartProduct.productId)
            ?.price || 0,
          cartProduct.amount,
        ),
      ),
    );

    return order;
  }
}

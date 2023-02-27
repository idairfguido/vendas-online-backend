import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateOrderDto } from "../order/dtos/create-order.dto";
import { Repository } from "typeorm";
import { PaymentType } from "../payment-status/enums/payment-type.enum";
import { PaymentCreditCardEntity } from "./entities/payment-credit-card.entity";
import { PaymentPixEntity } from "./entities/payment-pix.entity";
import { PaymentEntity } from "./entities/payment.entity";

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) { }

  async createPayment(createOrderDto: CreateOrderDto): Promise<PaymentEntity> {
    if (createOrderDto.amountPayments) {
      const paymentCreditCard = new PaymentCreditCardEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDto
      );
      return this.paymentRepository.save(paymentCreditCard);
    } else if (createOrderDto.codePix && createOrderDto.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        0,
        0,
        0,
        createOrderDto
      );
      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException(
      "Amount Payments or code pix or date payment not found"
    );
  }
}

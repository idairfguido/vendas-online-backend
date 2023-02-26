import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderEntity } from "./entities/order.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderEntity: Repository<OrderEntity>
  ) { }

  async createOrder(createOrderDto: CreateOrderDto, cartId: number) {
    return null;
  }
}

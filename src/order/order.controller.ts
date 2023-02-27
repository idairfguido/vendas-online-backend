import {
  Body,
  Controller,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserId } from "src/decorators/user-id.decorator";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post("/cart/:cartId")
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Param("cartId") cartId: number,
    @UserId("userId") userId: number
  ) {
    return this.orderService.createOrder(createOrderDto, cartId, userId);
  }
}

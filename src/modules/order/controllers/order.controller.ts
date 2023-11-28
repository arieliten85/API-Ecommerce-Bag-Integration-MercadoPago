import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { OrderService } from "../application/service/order.service";
import { Order } from "../domain/order.domain";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAll(): Promise<Order[]> {
    return await this.orderService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<Order> {
    return await this.orderService.getById(id);
  }

  @Post()
  async create(@Body() body: CreateOrderDto): Promise<Order> {
    return await this.orderService.create(body);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() body: UpdateOrderDto,
  ): Promise<Order> {
    return await this.orderService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<Order> {
    return await this.orderService.delete(id);
  }
}

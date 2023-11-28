import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";

import { OrderItemsService } from "../application/order-items.service";
import { OrderItems } from "../domain/order-items.domain";
import { CreateOrderItemsDto } from "./dto/create-order-items.dto";
import { UpdateOrderItemsDto } from "./dto/update-order-items.dto";

@Controller("order-items")
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Get()
  async getAll(): Promise<OrderItems[]> {
    return await this.orderItemsService.getAll();
  }

  @Get(":id")
  async getById(@Param("id") id: number): Promise<OrderItems> {
    return await this.orderItemsService.getById(id);
  }

  @Post()
  async create(@Body() body: CreateOrderItemsDto): Promise<OrderItems> {
    return await this.orderItemsService.create(body);
  }

  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() body: UpdateOrderItemsDto,
  ): Promise<OrderItems> {
    return await this.orderItemsService.update(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<OrderItems> {
    return await this.orderItemsService.delete(id);
  }
}

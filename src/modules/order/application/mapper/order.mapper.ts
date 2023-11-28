import { Inject, Injectable, forwardRef } from "@nestjs/common";

import { CreateOrderDto } from "../../controllers/dto/create-order.dto";
import { UpdateOrderDto } from "../../controllers/dto/update-order.dto";
import { Order } from "../../domain/order.domain";
import { OrderEntity } from "../../infrastructure/entities/order.entity";
import { MapperServiceOrderItems } from "../../../order-items/application/mapper/order-items.mapper";
import { MapperUserService } from "../../../user/aplication/mappers/user.mapper";

@Injectable()
export class MapperServiceOrder {
  constructor(
    @Inject(forwardRef(() => MapperServiceOrderItems))
    private readonly mapperServiceOrderItems: MapperServiceOrderItems,

    private readonly mapperUserService: MapperUserService,
  ) {}
  dtoToClass(orderDto: CreateOrderDto | UpdateOrderDto): Order {
    const newOrderClass = new Order();
    newOrderClass.user_id = orderDto.user_id;
    // newOrderClass.total = orderDto.total;
    return newOrderClass;
  }

  entityToClass(orderEntity: OrderEntity): Order {
    const newOrderClass = new Order();
    newOrderClass.id = orderEntity.id;
    newOrderClass.user_id = orderEntity.user_id;
    // newOrderClass.total = orderEntity.total;
    newOrderClass.createdAt = orderEntity.createdAt;
    newOrderClass.modifiedAt = orderEntity.modifiedAt;

    if (orderEntity.user) {
      newOrderClass.user = this.mapperUserService.entityToClass(
        orderEntity.user,
      );
    }
    if (orderEntity.orderItems) {
      newOrderClass.orderItems = orderEntity.orderItems.map(
        this.mapperServiceOrderItems.entityToClass,
      );
    }
    return newOrderClass;
  }

  classToEntity(orderClass: Order): OrderEntity {
    const newOrderEntity = new OrderEntity();
    newOrderEntity.id = orderClass.id;
    newOrderEntity.user_id = orderClass.user_id;
    // newOrderEntity.total = orderClass.total;
    if (orderClass.user) {
      newOrderEntity.user = this.mapperUserService.classToEntity(
        orderClass.user,
      );
    }
    return newOrderEntity;
  }
}

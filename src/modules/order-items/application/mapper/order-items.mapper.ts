import { Inject, Injectable } from "@nestjs/common";

import { CreateOrderItemsDto } from "../../controllers/dto/create-order-items.dto";
import { UpdateOrderItemsDto } from "../../controllers/dto/update-order-items.dto";
import { OrderItems } from "../../domain/order-items.domain";
import { OrderItemsEntity } from "../../infrastructure/entities/order-items.entity";
import { MapperProduct } from "../../../product/aplication/mappers/mappers.product";
import { MapperServiceOrder } from "../../../order/application/mapper/order.mapper";

@Injectable()
export class MapperServiceOrderItems {
  constructor(
    @Inject(MapperProduct)
    private readonly mapperServiceProduct: MapperProduct,
    @Inject(MapperServiceOrder)
    private readonly mapperServiceOrder: MapperServiceOrder,
  ) {}

  dtoToClass(
    orderItemsDto: CreateOrderItemsDto | UpdateOrderItemsDto,
  ): OrderItems {
    const newOrderItems = new OrderItems();

    newOrderItems.order_id = orderItemsDto.order_id;
    newOrderItems.product_id = orderItemsDto.product_id;
    newOrderItems.quantity = orderItemsDto.quantity;
    newOrderItems.unit_price = orderItemsDto.unit_price;
    return newOrderItems;
  }

  entityToClass(orderItemsEntity: OrderItemsEntity): OrderItems {
    const newOrderItemsClass = new OrderItems();
    newOrderItemsClass.id = orderItemsEntity.id;
    newOrderItemsClass.order_id = orderItemsEntity.order_id;
    newOrderItemsClass.product_id = orderItemsEntity.product_id;
    newOrderItemsClass.quantity = orderItemsEntity.quantity;
    newOrderItemsClass.unit_price = orderItemsEntity.unit_price;
    newOrderItemsClass.createdAt = orderItemsEntity.createdAt;
    newOrderItemsClass.modifiedAt = orderItemsEntity.modifiedAt;
    if (orderItemsEntity.orderDetails) {
      newOrderItemsClass.order = this.mapperServiceOrder.entityToClass(
        orderItemsEntity.orderDetails,
      );
    }
    if (orderItemsEntity.product) {
      newOrderItemsClass.product = this.mapperServiceProduct.entityToClass(
        orderItemsEntity.product,
      );
    }
    return newOrderItemsClass;
  }

  classToEntity(orderItems: OrderItems): OrderItemsEntity {
    const newOrderItemsEntity = new OrderItemsEntity();
    newOrderItemsEntity.id = orderItems.id;
    newOrderItemsEntity.product_id = orderItems.product_id;
    newOrderItemsEntity.quantity = orderItems.quantity;
    newOrderItemsEntity.unit_price = orderItems.unit_price;
    if (orderItems.product) {
      newOrderItemsEntity.product = this.mapperServiceProduct.classToEntity(
        orderItems.product,
      );
    }
    if (orderItems.order) {
      newOrderItemsEntity.orderDetails = this.mapperServiceOrder.classToEntity(
        orderItems.order,
      );
    }
    return newOrderItemsEntity;
  }
}

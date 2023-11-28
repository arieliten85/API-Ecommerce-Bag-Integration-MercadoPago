import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { CreateOrderItemsDto } from "../controllers/dto/create-order-items.dto";
import { UpdateOrderItemsDto } from "../controllers/dto/update-order-items.dto";
import { OrderItems } from "../domain/order-items.domain";
import { MapperServiceOrderItems } from "./mapper/order-items.mapper";
import {
  ORDER_ITEMS_REPOSITORY,
  OrderItemsRepository,
} from "./repository/order-items.repository";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../product/aplication/repository/product.repositorio";
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from "../../order/application/repository/order.repository";

export const ERROR_MESSAGES = {
  ORDER_ITEMS_NOT_FOUND: "Order items not found",
  PRODUCT_NOT_FOUND: "The product does not exist",
  ORDER_NOT_FOUND: "The Order does not exist",
};

@Injectable()
export class OrderItemsService {
  constructor(
    @Inject(ORDER_ITEMS_REPOSITORY)
    private readonly orderItemsRepository: OrderItemsRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(MapperServiceOrderItems)
    private readonly mapperServiceOrderItems: MapperServiceOrderItems,
  ) {}

  async getAll(): Promise<OrderItems[]> {
    return await this.orderItemsRepository.findAll();
  }

  async getById(id: number): Promise<OrderItems> {
    const foundOrderItems = await this.orderItemsRepository.findById(id);
    if (!foundOrderItems) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_ITEMS_NOT_FOUND);
    }

    return foundOrderItems;
  }

  async create(orderItemsDto: CreateOrderItemsDto): Promise<OrderItems> {
    const existOrder = await this.orderRepository.findById(
      orderItemsDto.order_id,
    );
    if (!existOrder) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    const existProduct = await this.productRepository.findOne(
      orderItemsDto.product_id,
    );
    if (!existProduct) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const orderItemsClass =
      this.mapperServiceOrderItems.dtoToClass(orderItemsDto);
    orderItemsClass.product = existProduct;
    orderItemsClass.order = existOrder;
    const orderItems = await this.orderItemsRepository.create(orderItemsClass);

    return orderItems;
  }

  async update(
    id: number,
    orderItemsDto: UpdateOrderItemsDto,
  ): Promise<OrderItems> {
    const foundOrderItems = await this.orderItemsRepository.findById(id);
    if (!foundOrderItems) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_ITEMS_NOT_FOUND);
    }

    const existOrder = await this.orderRepository.findById(
      orderItemsDto.order_id,
    );
    if (!existOrder) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
    }

    const existProduct = await this.productRepository.findOne(
      orderItemsDto.product_id,
    );
    if (!existProduct) {
      throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    const orderItemsClass =
      this.mapperServiceOrderItems.dtoToClass(orderItemsDto);
    const updatedOrderItems = await this.orderItemsRepository.update(
      id,
      orderItemsClass,
    );
    return updatedOrderItems;
  }

  async delete(id: number): Promise<OrderItems> {
    const foundOrderItems = await this.orderItemsRepository.findById(id);
    if (!foundOrderItems) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_ITEMS_NOT_FOUND);
    }

    await this.orderItemsRepository.delete(id);
    return foundOrderItems;
  }
}

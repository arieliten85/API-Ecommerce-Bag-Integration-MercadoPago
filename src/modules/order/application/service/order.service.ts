import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { CreateOrderDto } from "../../controllers/dto/create-order.dto";
import { UpdateOrderDto } from "../../controllers/dto/update-order.dto";
import { Order } from "../../domain/order.domain";
import { MapperServiceOrder } from "../mapper/order.mapper";
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from "../repository/order.repository";
import {
  USER_REPOSITORY,
  UserRepository,
} from "../../../user/aplication/repository/user.repository";

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: "The user does not exist",
  ORDER_DETAILS_NOT_FOUND: "Order details not found",
};

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(MapperServiceOrder)
    private readonly mapperServiceOrder: MapperServiceOrder,
  ) {}

  async getAll(): Promise<Order[]> {
    return await this.orderRepository.findAll();
  }

  async getById(id: number): Promise<Order> {
    const foundOrderDetails = await this.orderRepository.findById(id);
    if (!foundOrderDetails) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_DETAILS_NOT_FOUND);
    }

    return foundOrderDetails;
  }

  async create(orderDetailsDto: CreateOrderDto): Promise<Order> {
    const existUser = await this.userRepository.findById(
      orderDetailsDto.user_id,
    );

    if (!existUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const orderDetailsClass =
      this.mapperServiceOrder.dtoToClass(orderDetailsDto);

    orderDetailsClass.user = existUser;
    const orderDetails = await this.orderRepository.create(orderDetailsClass);

    return orderDetails;
  }

  async update(id: number, orderDetailsDto: UpdateOrderDto): Promise<Order> {
    const foundOrderDetails = await this.orderRepository.findById(id);
    if (!foundOrderDetails) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_DETAILS_NOT_FOUND);
    }

    const existUser = await this.userRepository.findById(
      orderDetailsDto.user_id,
    );

    if (!existUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const orderDetailsClass =
      this.mapperServiceOrder.dtoToClass(orderDetailsDto);
    orderDetailsClass.user = existUser;
    const orderDetails = await this.orderRepository.update(
      id,
      orderDetailsClass,
    );

    return orderDetails;
  }

  async delete(id: number): Promise<Order> {
    const foundOrderDetails = await this.orderRepository.findById(id);
    if (!foundOrderDetails) {
      throw new NotFoundException(ERROR_MESSAGES.ORDER_DETAILS_NOT_FOUND);
    }

    await this.orderRepository.delete(id);
    return foundOrderDetails;
  }
}

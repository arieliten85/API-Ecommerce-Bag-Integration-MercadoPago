import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MapperServiceOrder } from "../application/mapper/order.mapper";
import { OrderRepository } from "../application/repository/order.repository";
import { Order } from "../domain/order.domain";
import { OrderEntity } from "./entities/order.entity";

@Injectable()
export class OrderMysqlRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderDetailsRepository: Repository<OrderEntity>,
    private readonly mapperServiceOrder: MapperServiceOrder,
  ) {}

  async findAll(): Promise<Order[]> {
    const orderDetailsEntities = await this.orderDetailsRepository.find({
      relations: { user: true, orderItems: true },
    });

    return orderDetailsEntities.map((orderDetails) =>
      this.mapperServiceOrder.entityToClass(orderDetails),
    );
  }

  async findById(id: number): Promise<Order> {
    const foundOrderDetails = await this.orderDetailsRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!foundOrderDetails) {
      return null;
    }

    return this.mapperServiceOrder.entityToClass(foundOrderDetails);
  }

  async create(orderDetails: Order): Promise<Order> {
    const orderDetailsEntity =
      await this.mapperServiceOrder.classToEntity(orderDetails);

    const createdOrderDetails =
      await this.orderDetailsRepository.save(orderDetailsEntity);

    return this.mapperServiceOrder.entityToClass(createdOrderDetails);
  }

  async update(id: number, orderDetails: Order): Promise<Order> {
    const foundOrderDetails = await this.orderDetailsRepository.findOne({
      where: { id },
    });

    const orderDetailsEntity =
      this.mapperServiceOrder.classToEntity(orderDetails);
    await this.orderDetailsRepository.merge(
      foundOrderDetails,
      orderDetailsEntity,
    );
    const updatedOrderDetails =
      await this.orderDetailsRepository.save(foundOrderDetails);

    return this.mapperServiceOrder.entityToClass(updatedOrderDetails);
  }

  async delete(id: number): Promise<Order> {
    const foundOrderDetails = await this.orderDetailsRepository.findOne({
      where: { id },
    });

    await this.orderDetailsRepository.delete(id);
    return this.mapperServiceOrder.entityToClass(foundOrderDetails);
  }
}

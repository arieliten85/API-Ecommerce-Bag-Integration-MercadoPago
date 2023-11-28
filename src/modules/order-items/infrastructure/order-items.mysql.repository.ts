import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderItemsRepository } from "../application/repository/order-items.repository";
import { OrderItemsEntity } from "./entities/order-items.entity";
import { MapperServiceOrderItems } from "../application/mapper/order-items.mapper";
import { OrderItems } from "../domain/order-items.domain";

@Injectable()
export class OrderItemsMysqlRepository implements OrderItemsRepository {
  constructor(
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemsRepository: Repository<OrderItemsEntity>,
    private readonly mapperServiceOrderItems: MapperServiceOrderItems,
  ) {}

  async findAll(): Promise<OrderItems[]> {
    const orderItemsEntities = await this.orderItemsRepository.find({
      relations: { product: true },
    });

    const resp = orderItemsEntities.map((orderItemsEntity) =>
      this.mapperServiceOrderItems.entityToClass(orderItemsEntity),
    );
    return resp;
  }

  async findById(id: number): Promise<OrderItems> {
    const foundOrderItems = await this.orderItemsRepository.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!foundOrderItems) {
      return null;
    }

    return this.mapperServiceOrderItems.entityToClass(foundOrderItems);
  }

  async create(orderItems: OrderItems): Promise<OrderItems> {
    const orderItemsEntity =
      this.mapperServiceOrderItems.classToEntity(orderItems);

    const createdOrderItems =
      await this.orderItemsRepository.save(orderItemsEntity);

    return this.mapperServiceOrderItems.entityToClass(createdOrderItems);
  }

  async update(id: number, orderItems: OrderItems): Promise<OrderItems> {
    const foundOrderItems = await this.orderItemsRepository.findOne({
      where: { id },
    });

    const orderItemsEntity =
      this.mapperServiceOrderItems.classToEntity(orderItems);
    this.orderItemsRepository.merge(foundOrderItems, orderItemsEntity);
    const updatedOrderItems =
      await this.orderItemsRepository.save(foundOrderItems);

    return this.mapperServiceOrderItems.entityToClass(updatedOrderItems);
  }

  async delete(id: number): Promise<OrderItems> {
    const foundOrderItems = await this.orderItemsRepository.findOne({
      where: { id },
    });

    await this.orderItemsRepository.delete(id);
    return this.mapperServiceOrderItems.entityToClass(foundOrderItems);
  }
}

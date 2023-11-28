import { Order } from "../../domain/order.domain";

export const ORDER_REPOSITORY = "ORDER_REPOSITORY";

export interface OrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: number): Promise<Order>;
  create(orderDetails: Order): Promise<Order>;
  update(id: number, orderDetails: Order): Promise<Order>;
  delete(id: number): Promise<Order>;
}

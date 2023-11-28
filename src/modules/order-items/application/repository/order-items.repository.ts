import { OrderItems } from "../../domain/order-items.domain";

export const ORDER_ITEMS_REPOSITORY = "ORDER_ITEMS_REPOSITORY";

export interface OrderItemsRepository {
  findAll(): Promise<OrderItems[]>;
  findById(id: number): Promise<OrderItems>;
  create(orderItems: OrderItems): Promise<OrderItems>;
  update(id: number, orderItems: OrderItems): Promise<OrderItems>;
  delete(id: number): Promise<OrderItems>;
}

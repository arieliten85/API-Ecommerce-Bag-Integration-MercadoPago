import { OrderItems } from "../../order-items/domain/order-items.domain";
import { User } from "../../user/domain/user.domain";

export class Order {
  id: number;
  user_id: number;
  // total: number;
  createdAt?: Date;
  modifiedAt?: Date;
  user?: User;
  orderItems?: OrderItems[];
}

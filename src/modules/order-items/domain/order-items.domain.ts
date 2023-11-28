import { Order } from "../../order/domain/order.domain";
import { Product } from "../../product/dominio/producto.domain";

export class OrderItems {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  createdAt?: Date;
  modifiedAt?: Date;
  order?: Order;
  product?: Product;
}

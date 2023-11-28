import { OrderEntity } from "../../../order/infrastructure/entities/order.entity";
import { ProductEntity } from "../../../product/infrastucture/entities/product.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("order_items")
export class OrderItemsEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  order_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column()
  unit_price: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "modified_at" })
  modifiedAt: Date;

  @ManyToOne(() => OrderEntity, (orderDetails) => orderDetails.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "order_id" })
  orderDetails?: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.id, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product?: ProductEntity;
}

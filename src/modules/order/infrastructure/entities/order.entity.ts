import { OrderItemsEntity } from "../../../order-items/infrastructure/entities/order-items.entity";
import { UserEntity } from "../../../user/infrastructure/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("order")
export class OrderEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  user_id: number;

  // @Column()
  // total: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "modified_at" })
  modifiedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: "user_id" })
  user?: UserEntity;

  @OneToMany(() => OrderItemsEntity, (orderItems) => orderItems.orderDetails)
  orderItems?: OrderItemsEntity[];
}

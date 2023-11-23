import { ProductEntity } from "../../../product/infrastucture/entities/product.entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("images")
export class ImagesEntity {
  @PrimaryGeneratedColumn("increment")
  id?: number;

  @Column()
  url: string;

  @ManyToOne(() => ProductEntity, (product) => product.images)
  @JoinColumn({ name: "product_id" })
  product?: ProductEntity;
}

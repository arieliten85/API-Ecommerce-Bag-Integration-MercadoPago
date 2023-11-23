import { Category } from "src/modules/category/domain/category.domain";
import { Images } from "src/modules/images/domain/images.domain";

export class Product {
  id?: number;
  name: string;
  desc: string;
  price: number;
  images?: Images[];
  category?: Category;
  createAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

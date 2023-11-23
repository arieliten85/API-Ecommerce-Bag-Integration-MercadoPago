import { Product } from "../../dominio/producto.domain";
import { ProductEntity } from "../../infrastucture/entities/product.entity";

export const PRODUCT_REPOSITORY = "PRODUCT_REPOSITORY";

export interface ProductRepository {
  create(product: any): Promise<Product>;
  findAll(): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
  update(product: ProductEntity, editProduct: Product): Promise<Product>;
  delete(id: number): Promise<number>;
}

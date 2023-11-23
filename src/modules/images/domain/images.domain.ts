import { Product } from "src/modules/product/dominio/producto.domain";

export class Images {
  id?: number;
  product_id?: number;
  url: string;
  product?: Product;
}

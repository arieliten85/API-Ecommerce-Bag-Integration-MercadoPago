import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from "class-validator";
import { Product } from "src/modules/product/dominio/producto.domain";

export class CreateImagesDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @Length(5, 200)
  url: string;

  product?: Product;

  @IsNumber()
  product_id?: number;

  @IsNotEmpty()
  buffer: Buffer;
}

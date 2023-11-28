import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateOrderItemsDto {
  @IsInt()
  @IsNotEmpty()
  order_id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  unit_price: number;
}

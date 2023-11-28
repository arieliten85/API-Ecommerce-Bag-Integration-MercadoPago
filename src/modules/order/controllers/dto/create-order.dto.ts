import { IsInt, IsNotEmpty } from "class-validator";

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  user_id: number;

  // @IsInt()
  // @Min(1)
  // total: number;
}

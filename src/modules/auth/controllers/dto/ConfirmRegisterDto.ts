import { IsString } from "class-validator";

export class ConfirmAccountDto {
  @IsString()
  token: string;
}

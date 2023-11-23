import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}

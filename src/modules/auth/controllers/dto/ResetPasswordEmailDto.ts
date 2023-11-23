import { IsEmail } from "class-validator";

export class SendPasswordResetDto {
  @IsEmail()
  email: string;
}

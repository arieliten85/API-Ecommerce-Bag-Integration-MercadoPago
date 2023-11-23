import { IsEmail } from "class-validator";

export class ReSendConfirmAccountDto {
  @IsEmail()
  email: string;
}

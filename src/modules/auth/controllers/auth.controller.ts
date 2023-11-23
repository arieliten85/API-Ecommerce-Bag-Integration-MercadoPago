import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "../aplication/auth.service";
import { RegisterDto } from "./dto/RegisterDto";
import { LoginDto } from "./dto/LoginDto";
import { ConfirmAccountDto } from "./dto/ConfirmRegisterDto";
import { SendPasswordResetDto } from "./dto/ResetPasswordEmailDto";
import { ResetPasswordDto } from "./dto/ResetPasswordDto";
import { ReSendConfirmAccountDto } from "./dto/ConfirmRegisterDto copy";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post("/confirm-email")
  async confirmAccount(@Body() confirmAccountDto: ConfirmAccountDto) {
    return await this.authService.confirmAccount(confirmAccountDto);
  }

  @Post("/resend-confirm-email")
  async reSendConfirmAccount(
    @Body() reSendConfirmAccountDto: ReSendConfirmAccountDto,
  ) {
    return await this.authService.reSendConfirmAccount(reSendConfirmAccountDto);
  }

  @Post("send-password-reset-email")
  async sendPasswordReset(@Body() sendPasswordResetDto: SendPasswordResetDto) {
    return await this.authService.sendPasswordReset(sendPasswordResetDto);
  }

  @Post("reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }
}

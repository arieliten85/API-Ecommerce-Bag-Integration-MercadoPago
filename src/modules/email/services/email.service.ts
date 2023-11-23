// email.service.ts

import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../../user/domain/user.domain";

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendUserEmail_validation(user: User, token: string) {
    const confirmation_url = `http://localhost:3000/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to Demo App! Confirm your Email",
      template: "./welcome",
      context: {
        name: user.firstName,
        confirmation_url,
      },
    });
  }

  async sendUserEmail_resetPassword(user: User, token: string) {
    const reset_password_url = `http://localhost:3000/auth/resetPassword?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Password Reset Request for Demo App",
        template: "./resetPassword",
        context: {
          name: user.firstName,
          reset_password_url,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendUserEmail_reconfirmAcound(user: User, token: string) {
    const reconfirmation_url = `http://localhost:3000/auth/confirm?token=${token}`;

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: "Please Confirm Your Account for Demo App",
        template: "./reconfirmAcound",
        context: {
          name: user.firstName,
          reconfirmation_url,
        },
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// email.module.ts

import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { Global, Module } from "@nestjs/common";
import { EmailService } from "./services/email.service";
import { join } from "path";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: process.env.NODEMAILER_HOST,
          auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
          },
        },
        defaults: {
          from: `${process.env.NAME_APP} <${config.get(
            process.env.NODEMAILER_USER,
          )}>`,
        },
        template: {
          dir: join(__dirname, "../../../src/modules/email/templates"),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

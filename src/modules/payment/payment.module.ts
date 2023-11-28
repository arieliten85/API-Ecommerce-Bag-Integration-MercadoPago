import { Module } from "@nestjs/common";
import { PaymentController } from "./controllers/payment.controller";
import { PaymentService } from "./aplication/payment.service";
import { Preference, MercadoPagoConfig } from "mercadopago";

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    Preference,
    {
      provide: MercadoPagoConfig,
      useValue: {
        accessToken: "<ACCESS_TOKEN>",
      },
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}

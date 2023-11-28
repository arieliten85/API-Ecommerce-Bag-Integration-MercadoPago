import { Controller, Get, Post, Body } from "@nestjs/common";
import { PaymentService } from "../aplication/payment.service";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("create_preference")
  async create(@Body() createPaymentDto: any) {
    return await this.paymentService.create(createPaymentDto);
  }

  @Get("feedback")
  feedback() {
    return this.paymentService.feedback();
  }
}

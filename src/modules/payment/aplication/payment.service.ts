import { Injectable } from "@nestjs/common";
import { MercadoPagoConfig, Preference } from "mercadopago";

@Injectable()
export class PaymentService {
  async create(createPaymentDto: any) {
    try {
      const client = this.createPaymentClient();
      const payment = this.createPaymentPreference(client);

      const items = createPaymentDto.map((item: any) => ({
        title: item.name,
        unit_price: Number(item.price),
        currency_id: "ARG",
        quantity: Number(item.quantity),

        statement_descriptor: "MEUNEGOCIO",
      }));

      const body: any = {
        items,
        marketplace: "ariel",
        back_urls: {
          success: "http://localhost:8080/feedback",
          failure: "http://localhost:8080/feedback",
          pending: "http://localhost:8080/feedback",
        },
        auto_return: "approved",
      };

      const resp = await payment.create({ body });

      return { id: resp.id };
    } catch (error) {
      console.error(error);
    }
  }

  feedback() {
    return `Esta acción devuelve todos los pagos`;
  }

  // UTILS
  private createPaymentClient() {
    return new MercadoPagoConfig({
      accessToken: process.env.ACCES_TOKEN_PAYMENT,
      options: { timeout: 5000, idempotencyKey: "abc" },
    });
  }
  private createPaymentPreference(client: MercadoPagoConfig): Preference {
    return new Preference(client);
  }
}

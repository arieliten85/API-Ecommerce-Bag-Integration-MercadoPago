import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "../config/configuration";
import { ProductModule } from "./product/product.module";
import { CategoryModule } from "./category/category.module";

import { ImagesModule } from "./images/images.module";
import { PaymentModule } from "./payment/payment.module";
import { OrderItemsModule } from "./order-items/order-items.module";
import { OrderModule } from "./order/order.module";
import { NotificatioHookModule } from "./notificatio-hook/notificatio-hook.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
    }),

    UserModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    ImagesModule,
    PaymentModule,
    OrderItemsModule,
    OrderModule,
    NotificatioHookModule,
  ],
  controllers: [],
  providers: [AuthModule],
})
export class AppModule {}

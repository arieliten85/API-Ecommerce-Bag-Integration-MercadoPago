import { Module } from "@nestjs/common";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "../config/configuration";
import { ProductModule } from "./product/product.module";
import { CategoryModule } from "./category/category.module";

import { ImagesModule } from "./images/images.module";

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
  ],
  controllers: [],
  providers: [AuthModule],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { OrderEntity } from "./infrastructure/entities/order.entity";
import { UserEntity } from "../user/infrastructure/entities/user.entity";
import { OrderItemsEntity } from "../order-items/infrastructure/entities/order-items.entity";
import { OrderItemsModule } from "../order-items/order-items.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderController } from "./controllers/order.controller";
import { OrderService } from "./application/service/order.service";
import { MapperServiceOrder } from "./application/mapper/order.mapper";
import { MapperServiceOrderItems } from "../order-items/application/mapper/order-items.mapper";
import { MapperProduct } from "../product/aplication/mappers/mappers.product";
import { MapperImages } from "../images/aplication/mappers/mapper.service.images";
import { ORDER_REPOSITORY } from "./application/repository/order.repository";
import { OrderMysqlRepository } from "./infrastructure/order.mysql.repository";
import { USER_REPOSITORY } from "../user/aplication/repository/user.repository";
import { UserMysqlRepository } from "../user/infrastructure/user.mysql.repository";
import { MapperUserService } from "../user/aplication/mappers/user.mapper";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, UserEntity, OrderItemsEntity]),

    OrderItemsModule,
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    MapperServiceOrder,
    MapperServiceOrderItems,
    MapperProduct,
    MapperImages,
    MapperUserService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderMysqlRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: UserMysqlRepository,
    },
  ],
  exports: [
    OrderService,
    MapperServiceOrder,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderMysqlRepository,
    },
  ],
})
export class OrderModule {}

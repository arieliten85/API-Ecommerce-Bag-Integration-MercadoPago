import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItemsEntity } from "./infrastructure/entities/order-items.entity";
import { ProductEntity } from "../product/infrastucture/entities/product.entity";
import { ImagesEntity } from "../images/infrastruture/entities/images.entity";
import { OrderEntity } from "../order/infrastructure/entities/order.entity";
import { OrderItemsController } from "./controllers/order-items.controller";
import { OrderItemsService } from "./application/order-items.service";
import { MapperUserService } from "../user/aplication/mappers/user.mapper";
import { MapperProduct } from "../product/aplication/mappers/mappers.product";
import { MapperImages } from "../images/aplication/mappers/mapper.service.images";
import { MapperServiceOrderItems } from "./application/mapper/order-items.mapper";
import { MapperServiceOrder } from "../order/application/mapper/order.mapper";
import { ORDER_ITEMS_REPOSITORY } from "./application/repository/order-items.repository";
import { OrderItemsMysqlRepository } from "./infrastructure/order-items.mysql.repository";
import { PRODUCT_REPOSITORY } from "../product/aplication/repository/product.repositorio";
import { ProductMysqlRepository } from "../product/infrastucture/product.mysql.repository";
import { ORDER_REPOSITORY } from "../order/application/repository/order.repository";
import { OrderMysqlRepository } from "../order/infrastructure/order.mysql.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderItemsEntity,
      ProductEntity,
      ImagesEntity,
      OrderEntity,
    ]),
  ],
  controllers: [OrderItemsController],
  providers: [
    OrderItemsService,
    MapperUserService,
    MapperProduct,
    MapperImages,
    MapperServiceOrderItems,
    MapperServiceOrder,
    {
      provide: ORDER_ITEMS_REPOSITORY,
      useClass: OrderItemsMysqlRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductMysqlRepository,
    },
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderMysqlRepository,
    },
  ],
  exports: [
    OrderItemsService,
    MapperServiceOrderItems,
    {
      provide: ORDER_ITEMS_REPOSITORY,
      useClass: OrderItemsMysqlRepository,
    },
  ],
})
export class OrderItemsModule {}

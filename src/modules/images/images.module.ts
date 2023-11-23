import { TypeOrmModule } from "@nestjs/typeorm";
import { ImagesEntity } from "./infrastruture/entities/images.entity";
import { ProductEntity } from "../product/infrastucture/entities/product.entity";
import { ImagesController } from "./controllers/images.controller";
import { ImagesService } from "./aplication/images.service";
import { MapperImages } from "./aplication/mappers/mapper.service.images";
import { Module } from "@nestjs/common";
import { IMAGES_REPOSITORY } from "./aplication/repository/images.repository";
import { ImagesMysqlRepository } from "./infrastruture/images.mysql.repository";
import { IMAGES_STORAGE_FS_REPOSITORY } from "./aplication/repository/images.fs.repository";
import { ImagesStorageFsRepository } from "./infrastruture/image-storage.fs.repository.ts";
import { PRODUCT_REPOSITORY } from "../product/aplication/repository/product.repositorio";
import { ProductMysqlRepository } from "../product/infrastucture/product.mysql.repository";
import { MapperProduct } from "../product/aplication/mappers/mappers.product";

@Module({
  imports: [TypeOrmModule.forFeature([ImagesEntity, ProductEntity])],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    MapperImages,
    MapperProduct,

    {
      provide: IMAGES_REPOSITORY,
      useClass: ImagesMysqlRepository,
    },
    {
      provide: IMAGES_STORAGE_FS_REPOSITORY,
      useClass: ImagesStorageFsRepository,
    },
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductMysqlRepository,
    },
  ],
  exports: [ImagesService],
})
export class ImagesModule {}

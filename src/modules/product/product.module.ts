import { Module } from "@nestjs/common";
import { ProductService } from "./aplication/product.service";
import { ProductController } from "./controllers/product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./infrastucture/entities/product.entity";
import { PRODUCT_REPOSITORY } from "./aplication/repository/product.repositorio";
import { ProductMysqlRepository } from "./infrastucture/product.mysql.repository";
import { MapperProduct } from "./aplication/mappers/mappers.product";
import { CATEGORY_REPOSITORY } from "../category/aplication/repository/category.repository";
import { CategoryMysqlRepository } from "../category/infrastructure/category.mysql.repository";
import { MapperCategory } from "../category/aplication/mappers/mapperCategory";
import { CategoryEntity } from "../category/infrastructure/entities/category.entity";
import { ImagesStorageFsRepository } from "../images/infrastruture/image-storage.fs.repository.ts";
import { IMAGES_STORAGE_FS_REPOSITORY } from "../images/aplication/repository/images.fs.repository";
import { IMAGES_REPOSITORY } from "../images/aplication/repository/images.repository";
import { ImagesMysqlRepository } from "../images/infrastruture/images.mysql.repository";
import { MapperImages } from "../images/aplication/mappers/mapper.service.images";
import { ImagesEntity } from "../images/infrastruture/entities/images.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, ImagesEntity]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    MapperCategory,
    MapperProduct,
    MapperImages,
    { provide: PRODUCT_REPOSITORY, useClass: ProductMysqlRepository },
    { provide: CATEGORY_REPOSITORY, useClass: CategoryMysqlRepository },
    {
      provide: IMAGES_STORAGE_FS_REPOSITORY,
      useClass: ImagesStorageFsRepository,
    },
    { provide: IMAGES_REPOSITORY, useClass: ImagesMysqlRepository },
  ],
  exports: [ProductService],
})
export class ProductModule {}

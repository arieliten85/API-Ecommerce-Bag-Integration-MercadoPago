import { Module } from "@nestjs/common";
import { CategoryService } from "./aplication/category.service";
import { CategoryController } from "./controllers/category.controller";
import { MapperCategory } from "./aplication/mappers/mapperCategory";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryEntity } from "./infrastructure/entities/category.entity";
import { CategoryMysqlRepository } from "./infrastructure/category.mysql.repository";
import { CATEGORY_REPOSITORY } from "./aplication/repository/category.repository";

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    MapperCategory,
    { provide: CATEGORY_REPOSITORY, useClass: CategoryMysqlRepository },
  ],
})
export class CategoryModule {}

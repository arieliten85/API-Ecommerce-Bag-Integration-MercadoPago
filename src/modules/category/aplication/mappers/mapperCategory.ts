import { CreateCategoryDto } from "../../controllers/dto/create-category.dto";
import { UpdateCategoryDto } from "../../controllers/dto/update-category.dto";
import { Category } from "../../domain/category.domain";
import { CategoryEntity } from "../../infrastructure/entities/category.entity";

export class MapperCategory {
  dtoToClass(categoryDto: CreateCategoryDto | UpdateCategoryDto) {
    const categoryClass = new Category();

    categoryClass.name = categoryDto.name;
    categoryClass.desc = categoryDto.desc;

    return categoryClass;
  }

  classToEntity(categoryClass: Category) {
    const categoryEntity = new CategoryEntity();

    categoryEntity.id = categoryClass.id;
    categoryEntity.name = categoryClass.name;
    categoryEntity.desc = categoryClass.desc;

    return categoryEntity;
  }

  entityToClass(categoryEntity: CategoryEntity) {
    const categoryClass = new Category();

    categoryClass.id = categoryEntity.id;
    categoryClass.name = categoryEntity.name;
    categoryClass.desc = categoryEntity.desc;

    return categoryClass;
  }
}

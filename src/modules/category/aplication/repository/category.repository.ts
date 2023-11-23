import { CreateCategoryDto } from "../../controllers/dto/create-category.dto";
import { Category } from "../../domain/category.domain";
import { CategoryEntity } from "../../infrastructure/entities/category.entity";

export const CATEGORY_REPOSITORY = "CATEGORY_REPOSITORY";

export interface CetegoryRepository {
  create(category: CreateCategoryDto): Promise<Category>;
  findAll(): Promise<Category[]>;
  findOne(id: number): Promise<Category>;
  update(
    currentCategory: CategoryEntity,
    editCategory: Category,
  ): Promise<Category>;
  delete(id: number): Promise<number>;
}

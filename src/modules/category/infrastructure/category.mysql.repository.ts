import { InjectRepository } from "@nestjs/typeorm";
import { CetegoryRepository } from "../aplication/repository/category.repository";

import { Category } from "../domain/category.domain";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import { MapperCategory } from "../aplication/mappers/mapperCategory";

export class CategoryMysqlRepository implements CetegoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    private readonly mapperCategory: MapperCategory,
  ) {}

  async create(category: Category): Promise<Category> {
    const categoryEntity = this.mapperCategory.classToEntity(category);
    const newCategory = await this.categoryRepository.save(categoryEntity);
    return this.mapperCategory.entityToClass(newCategory);
  }

  async findAll(): Promise<Category[]> {
    const allCategoryEntity = await this.categoryRepository.find();
    const allCategoryClass = allCategoryEntity.map((category) =>
      this.mapperCategory.entityToClass(category),
    );
    return allCategoryClass;
  }

  async findOne(id: number): Promise<Category> {
    const categoryFound = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!categoryFound) return null;

    return this.mapperCategory.entityToClass(categoryFound);
  }
  // prettier-ignore
  async update( currentCategory: CategoryEntity,  editCategory: Category, ): Promise<Category> {
    const categoryMerged = this.categoryRepository.merge(  currentCategory,  editCategory,  );
    const categorySave = await this.categoryRepository.save(categoryMerged);
    return this.mapperCategory.entityToClass(categorySave);
  }
  async delete(id: number): Promise<number> {
    const { affected } = await this.categoryRepository.delete(id);

    return affected;
  }
}

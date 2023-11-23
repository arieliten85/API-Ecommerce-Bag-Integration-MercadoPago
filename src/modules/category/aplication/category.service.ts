import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateCategoryDto } from "../controllers/dto/create-category.dto";
import { UpdateCategoryDto } from "../controllers/dto/update-category.dto";
import { MapperCategory } from "./mappers/mapperCategory";
import { Category } from "../domain/category.domain";
import { CATEGORY_REPOSITORY } from "./repository/category.repository";
import { CategoryMysqlRepository } from "../infrastructure/category.mysql.repository";

const MESSAGE_ERROR = {
  CATEGORY_NOT_FOUND: "Category not found.",
  CATEGORY_NOT_DELETE: "Opps, the category dont has been deleted.",
};

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryMysqlRepository,
    private readonly mapperCategory: MapperCategory,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryClass = this.mapperCategory.dtoToClass(createCategoryDto);

    return await this.categoryRepository.create(categoryClass);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne(id);
  }
  // prettier-ignore
  async update( id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const categoryFound = await this.categoryRepository.findOne(id);

    if (!categoryFound) throw new NotFoundException("Category not found");

    const editCategory = this.mapperCategory.dtoToClass(updateCategoryDto);
    const currentCategory = this.mapperCategory.classToEntity(categoryFound);

    return await this.categoryRepository.update(currentCategory, editCategory);
  }

  async remove(id: number) {
    const categoryFound: Category = await this.findOne(id);

    if (!categoryFound) {
      throw new NotFoundException(MESSAGE_ERROR.CATEGORY_NOT_FOUND);
    }
    const affected = await this.categoryRepository.delete(id);

    if (affected !== 1) {
      throw new BadRequestException(MESSAGE_ERROR.CATEGORY_NOT_DELETE);
    }
    return `The category id: ${id} has been deleted`;
  }
}

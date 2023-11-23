import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { CreateProductDto } from "../controllers/dto/create-product.dto";
import { UpdateProductDto } from "../controllers/dto/update-product.dto";
import { ProductMysqlRepository } from "../infrastucture/product.mysql.repository";
import { PRODUCT_REPOSITORY } from "./repository/product.repositorio";
import { MapperProduct } from "./mappers/mappers.product";
import { Product } from "../dominio/producto.domain";
import { CATEGORY_REPOSITORY } from "../../category/aplication/repository/category.repository";
import { CategoryMysqlRepository } from "../../category/infrastructure/category.mysql.repository";
import {
  IMAGES_STORAGE_FS_REPOSITORY,
  ImagesFsRepository,
} from "../../images/aplication/repository/images.fs.repository";
import {
  IMAGES_REPOSITORY,
  ImagesRepository,
} from "../../images/aplication/repository/images.repository";
import { Images } from "../../images/domain/images.domain";

const MESSAGE_ERROR = {
  PRODUCT_NOT_FOUND: "Product not found.",
  PRODUCT_NOT_DELETE: "Opps, the product dont has been deleted.",
  CATEGORY_NOT_FOUND: "Category not found.",
};

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductMysqlRepository,

    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryMysqlRepository,

    @Inject(IMAGES_STORAGE_FS_REPOSITORY)
    private readonly imagesFsRepository: ImagesFsRepository,

    @Inject(IMAGES_REPOSITORY)
    private readonly imagesRepository: ImagesRepository,

    private readonly mapperProduct: MapperProduct,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { imagesFiles, category_id } = createProductDto;

    const productClass: Product =
      this.mapperProduct.dtoToClass(createProductDto);

    const categoryFound = await this.categoryRepository.findOne(category_id);
    if (!categoryFound) {
      throw new BadRequestException(MESSAGE_ERROR.CATEGORY_NOT_FOUND);
    }
    productClass.category = categoryFound;

    const newProduct = await this.productRepository.create(productClass);

    const filePathImage =
      await this.imagesFsRepository.createArrayPathImages(imagesFiles);

    const newImages = filePathImage.map((filePath) => {
      const newImage = new Images();
      newImage.url = filePath;
      newImage.product = newProduct;

      return newImage;
    });

    await Promise.all(
      newImages.map(async (item) => {
        await this.imagesRepository.create(item);
      }),
    );

    return newProduct;
  }
  async findAll(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
  async findOne(id: number): Promise<Product> {
    const productFound = await this.productRepository.findOne(id);
    if (!productFound) {
      throw new BadRequestException(MESSAGE_ERROR.PRODUCT_NOT_FOUND);
    }
    return productFound;
  }
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const userFound: Product = await this.findOne(id);
    if (!userFound) {
      throw new BadRequestException(MESSAGE_ERROR.PRODUCT_NOT_FOUND);
    }
    const userFoundEntity = this.mapperProduct.classToEntity(userFound);
    const productClass = this.mapperProduct.dtoToClass(updateProductDto);
    return this.productRepository.update(userFoundEntity, productClass);
  }
  async delete(id: number): Promise<string> {
    const userFound: Product = await this.findOne(id);
    if (!userFound) {
      throw new BadRequestException(MESSAGE_ERROR.PRODUCT_NOT_FOUND);
    }
    const arrayImagesPathProduct = userFound.images;
    arrayImagesPathProduct.map((item) =>
      this.imagesFsRepository.delete(item.url),
    );
    const arrayIdImagesProduct = userFound.images;
    arrayIdImagesProduct.map((item) => this.imagesRepository.delete(item.id));
    const affected = await this.productRepository.delete(id);
    if (affected !== 1) {
      throw new BadRequestException(MESSAGE_ERROR.PRODUCT_NOT_DELETE);
    }
    return `The product id: ${id} has been deleted`;
  }
}

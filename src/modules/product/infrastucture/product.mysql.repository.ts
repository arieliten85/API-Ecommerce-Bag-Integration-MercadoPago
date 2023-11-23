import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "../aplication/repository/product.repositorio";
import { ProductEntity } from "./entities/product.entity";
import { Repository } from "typeorm";
import { Product } from "../dominio/producto.domain";
import { MapperProduct } from "../aplication/mappers/mappers.product";

export class ProductMysqlRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    private readonly mapperProduct: MapperProduct,
  ) {}
  async create(productClass: Product): Promise<Product> {
    const newProductCreated = await this.productRepository.save(productClass);
    return this.mapperProduct.classToEntity(newProductCreated);
  }
  async findAll(): Promise<Product[]> {
    const allUserEntity = await this.productRepository.find({
      relations: { category: true, images: true },
    });
    return allUserEntity.map((product) =>
      this.mapperProduct.entityToClass(product),
    );
  }
  async findOne(id: number): Promise<Product> {
    const userFound = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, images: true },
    });

    if (!userFound) {
      return null;
    }
    return userFound;
  }
  async update(product: ProductEntity, editProduct: Product): Promise<Product> {
    const productMerge = this.productRepository.merge(product, editProduct);
    const productUpdated = await this.productRepository.save(productMerge);
    return this.mapperProduct.entityToClass(productUpdated);
  }
  async delete(id: number): Promise<number> {
    const resp = await this.productRepository.delete(id);
    return resp.affected;
  }
}

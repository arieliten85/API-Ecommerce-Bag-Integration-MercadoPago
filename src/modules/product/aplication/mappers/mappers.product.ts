import { CreateProductDto } from "../../controllers/dto/create-product.dto";
import { UpdateProductDto } from "../../controllers/dto/update-product.dto";
import { Product } from "../../dominio/producto.domain";
import { ProductEntity } from "../../infrastucture/entities/product.entity";

export class MapperProduct {
  dtoToClass(productDto: CreateProductDto | UpdateProductDto): Product {
    const productClass = new Product();

    productClass.name = productDto.name;
    productClass.desc = productDto.desc;
    productClass.price = productDto.price;

    return productClass;
  }

  classToEntity(producClass: Product): ProductEntity {
    const productEntity = new ProductEntity();

    productEntity.id = producClass.id;
    productEntity.name = producClass.name;
    productEntity.desc = producClass.desc;
    productEntity.price = producClass.price;

    return productEntity;
  }

  entityToClass(productEntity: ProductEntity): Product {
    const productClass = new Product();

    productClass.id = productEntity.id;
    productClass.name = productEntity.name;
    productClass.desc = productEntity.desc;
    productClass.price = productEntity.price;
    productClass.category = productEntity.category;
    productClass.images = productEntity.images;

    return productClass;
  }
}

import { Injectable } from "@nestjs/common";
import { CreateImagesDto } from "../../controllers/dto/create-image.dto";
import { Images } from "../../domain/images.domain";
import { ImagesEntity } from "../../infrastruture/entities/images.entity";
import { ProductEntity } from "src/modules/product/infrastucture/entities/product.entity";

import { UpdateImageDto } from "../../controllers/dto/update-image.dto";

@Injectable()
export class MapperImages {
  dtoToClass(imagesDto: CreateImagesDto | UpdateImageDto) {
    const newImages = new Images();

    newImages.url = imagesDto.url;
    newImages.product_id = imagesDto.product_id;
    newImages.product = imagesDto.product;
    return newImages;
  }

  classToEntity(classInstance: Images): ImagesEntity {
    const newEntity = new ImagesEntity();

    newEntity.id = classInstance.id;
    newEntity.url = classInstance.url;
    newEntity.product = classInstance.product as ProductEntity;
    return newEntity;
  }
  entityToClass(classEntity: ImagesEntity) {
    const newImages = new Images();

    newImages.id = classEntity.id;
    newImages.url = classEntity.url;
    newImages.product = classEntity.product;

    return newImages;
  }
}

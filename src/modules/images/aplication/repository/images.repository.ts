import { Images } from "../../domain/images.domain";
import { ImagesEntity } from "../../infrastruture/entities/images.entity";

export const IMAGES_REPOSITORY = "IMAGES_REPOSITORY";

export interface ImagesRepository {
  create(images: Images): Promise<Images>;
  findAll(): Promise<Images[]>;
  findById(id: number): Promise<Images>;
  update(currentImages: ImagesEntity, imagesEdit: Images): Promise<Images>;
  delete(id: number): Promise<number>;
}

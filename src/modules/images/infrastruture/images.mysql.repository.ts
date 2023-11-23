import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ImagesRepository } from "../aplication/repository/images.repository";
import { ImagesEntity } from "./entities/images.entity";
import { Images } from "../domain/images.domain";
import { MapperImages } from "../aplication/mappers/mapper.service.images";

@Injectable()
export class ImagesMysqlRepository implements ImagesRepository {
  constructor(
    @InjectRepository(ImagesEntity)
    private readonly imagesRepository: Repository<ImagesEntity>,
    private readonly mapperImages: MapperImages,
  ) {}

  async create(images: Images) {
    const imageEntity = this.mapperImages.classToEntity(images);
    const savedImage = await this.imagesRepository.save(imageEntity);
    return this.mapperImages.entityToClass(savedImage);
  }

  async findAll(): Promise<Images[]> {
    const imagesEntities = await this.imagesRepository.find({
      relations: { product: true },
    });

    return imagesEntities.map((imgEntity) =>
      this.mapperImages.entityToClass(imgEntity),
    );
  }

  async findById(id: number): Promise<Images> {
    const imageEntity = await this.imagesRepository.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!imageEntity) {
      return null;
    }

    const imagesClass = this.mapperImages.entityToClass(imageEntity);

    return imagesClass;
  }

  // prettier-ignore
  async update(currentImages: ImagesEntity, imagesEdit: Images): Promise<Images> {
    const imagesMerged = this.imagesRepository.merge(currentImages, imagesEdit);
    const updatedImage = await this.imagesRepository.save(imagesMerged);
    return this.mapperImages.entityToClass(updatedImage);
  }

  async delete(id: number): Promise<number> {
    const response = await this.imagesRepository.delete(id);
    return response.affected;
  }
}

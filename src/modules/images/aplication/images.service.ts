import {
  Inject,
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { CreateImagesDto } from "../controllers/dto/create-image.dto";
import { UpdateImageDto } from "../controllers/dto/update-image.dto";
import {
  IMAGES_REPOSITORY,
  ImagesRepository,
} from "./repository/images.repository";

import { Images } from "../domain/images.domain";
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from "../../product/aplication/repository/product.repositorio";
import {
  IMAGES_STORAGE_FS_REPOSITORY,
  ImagesFsRepository,
} from "./repository/images.fs.repository";
import { MapperImages } from "./mappers/mapper.service.images";

const MESSAGE_ERROR = {
  IMAGES_NOT_FOUND: "Images not found.",
  PRODUCT_NOT_FOUND: "Product not found.",
  IMAGES_NOT_DELETE: "Opps, the images dont has been deleted.",
};

@Injectable()
export class ImagesService {
  constructor(
    @Inject(IMAGES_REPOSITORY)
    private readonly imagesRepository: ImagesRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
    @Inject(IMAGES_STORAGE_FS_REPOSITORY)
    private readonly imagesFsRepository: ImagesFsRepository,

    private readonly mapperImages: MapperImages,
  ) {}

  async create(createImagesDto: CreateImagesDto) {
    const { buffer, url, product_id } = createImagesDto;
    const productFind = await this.productRepository.findOne(product_id);
    if (!productFind) {
      throw new NotFoundException(MESSAGE_ERROR.PRODUCT_NOT_FOUND);
    }
    const filePathImage = await this.imagesFsRepository.create(buffer, url);
    const newImagesUrl = new Images();
    newImagesUrl.url = filePathImage;
    newImagesUrl.product = productFind;
    const ImagesCreated = await this.imagesRepository.create(newImagesUrl);
    return ImagesCreated;
  }

  async findAll(): Promise<Images[]> {
    try {
      return await this.imagesRepository.findAll();
    } catch (error) {
      throw new HttpException(
        "Error while fetching images",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Images> {
    const imageFound = await this.imagesRepository.findById(id);
    if (!imageFound) {
      throw new NotFoundException(MESSAGE_ERROR.IMAGES_NOT_FOUND);
    }
    return imageFound;
  }

  async update(updateImageDto: UpdateImageDto) {
    const { buffer, url, image_id } = updateImageDto;
    const imageFound = await this.imagesRepository.findById(image_id);
    if (!imageFound) {
      throw new NotFoundException(MESSAGE_ERROR.IMAGES_NOT_FOUND);
    }
    //UPDATE PATH
    const imageUpdate = await this.imagesFsRepository.update(
      imageFound.url,
      buffer,
      url,
    );
    const imagesClass = this.mapperImages.dtoToClass(updateImageDto);
    imagesClass.url = imageUpdate;
    const imagesEntity = this.mapperImages.classToEntity(imageFound);

    //UPDATE DB
    return await this.imagesRepository.update(imagesEntity, imagesClass);
  }

  async remove(id: number) {
    const imageFound: Images = await this.imagesRepository.findById(id);
    if (!imageFound) {
      throw new BadRequestException(MESSAGE_ERROR.IMAGES_NOT_FOUND);
    }
    //DELETE PATH
    await this.imagesFsRepository.delete(imageFound.url);
    //DELETE DB
    const affected = await this.imagesRepository.delete(id);
    if (affected !== 1) {
      throw new BadRequestException(MESSAGE_ERROR.IMAGES_NOT_DELETE);
    }
    this.imagesFsRepository.delete(imageFound.url);
    return `The image id: ${id} has been deleted`;
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from "@nestjs/common";
import { ImagesService } from "../aplication/images.service";

import { FileInterceptor } from "@nestjs/platform-express";

import { UpdateImageDto } from "./dto/update-image.dto";
import { memoryStorage } from "multer";
import { CreateImagesDto } from "./dto/create-image.dto";
import { Images } from "../domain/images.domain";

const storage = memoryStorage();

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: storage,
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body("product_id", ParseIntPipe) product_id: number,
  ) {
    const createImagesDto: CreateImagesDto = {
      url: file.originalname,
      product_id: product_id,
      buffer: file.buffer,
    };

    return this.imagesService.create(createImagesDto);
  }

  @Get()
  async findAll(): Promise<Images[]> {
    return await this.imagesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return await this.imagesService.findOne(id);
  }

  @Put()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: storage,
    }),
  )
  async update(
    @UploadedFile() file: Express.Multer.File,

    @Body("image_id", ParseIntPipe) image_id: number,
  ) {
    const updateImageDto: UpdateImageDto = {
      url: file.originalname,
      image_id: image_id,
      buffer: file.buffer,
    };
    return await this.imagesService.update(updateImageDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.imagesService.remove(id);
  }
}

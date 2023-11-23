import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ProductService } from "../aplication/product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "../dominio/producto.domain";
import { FilesInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
const storage = memoryStorage();
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor("file", 4, {
      storage: storage,
    }),
  )
  async createProductWithImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Body("price", ParseIntPipe) price: number,
    @Body("category_id", ParseIntPipe) category_id: number,
    @Body()
    createProductDto: CreateProductDto & {
      price: string;
      category_id: string;
    },
  ) {
    const parsedCreateProductDto = {
      imagesFiles: files,
      ...createProductDto,
      price,
      category_id,
    };

    console.log(parsedCreateProductDto);
    return await this.productService.create(parsedCreateProductDto);
  }
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number): Promise<Product> {
    return await this.productService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    return await this.productService.delete(id);
  }
}

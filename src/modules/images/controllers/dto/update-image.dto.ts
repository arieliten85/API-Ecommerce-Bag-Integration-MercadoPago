import { PartialType } from "@nestjs/mapped-types";
import { CreateImagesDto } from "./create-image.dto";
import { IsNumber } from "class-validator";

export class UpdateImageDto extends PartialType(CreateImagesDto) {
  @IsNumber()
  image_id?: number;
}

import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import { ImagesFsRepository } from "../aplication/repository/images.fs.repository";

@Injectable()
export class ImagesStorageFsRepository implements ImagesFsRepository {
  async create(buffer: Buffer, originalName: string): Promise<string> {
    const outputPath = path.join("upload-images");

    const fileName = `${uuidv4()}_${path.basename(originalName)}`;
    const filePath = path.join(outputPath, fileName);

    await fs.writeFile(filePath, buffer);

    return filePath.toString();
  }

  async delete(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  async update(
    filePath: string,
    buffer: Buffer,
    originalName: string,
  ): Promise<string> {
    // Delete the old file
    await this.delete(filePath);

    // Create the new file
    const outputPath = path.join("upload-images");

    const fileName = `${uuidv4()}_${path.basename(originalName)}`;
    const newFilePath = path.join(outputPath, fileName);

    await fs.writeFile(newFilePath, buffer);

    return newFilePath.toString();
  }

  //prettier-ignore
  async createArrayPathImages(  imagesFiles: Express.Multer.File[], ): Promise<string[]> {
    const filePaths = await Promise.all(
      imagesFiles.map(async (file) => {
        const { buffer, originalname } = file;
        const filePath = await this.create(buffer, originalname);
        return filePath;
      }),
    );
    return filePaths;
  }
}

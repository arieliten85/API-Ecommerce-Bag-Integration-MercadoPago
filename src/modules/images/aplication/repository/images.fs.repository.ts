export const IMAGES_STORAGE_FS_REPOSITORY = "IMAGES_STORAGE_FS_REPOSITORY";

export interface ImagesFsRepository {
  create(buffer: Buffer, file: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  update(
    filePath: string,
    buffer: Buffer,
    originalName: string,
  ): Promise<string>;

  createArrayPathImages(imagesFiles: Express.Multer.File[]): Promise<string[]>;
}

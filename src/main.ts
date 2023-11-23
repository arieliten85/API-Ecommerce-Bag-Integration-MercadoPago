import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import * as express from "express";
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  app.setGlobalPrefix("api");

  app.useGlobalPipes(new ValidationPipe());

  app.use(
    "/upload-images",
    express.static(path.join(__dirname, "..", "upload-images")),
  );

  await app.listen(configService.get("PORT"));
}

bootstrap();

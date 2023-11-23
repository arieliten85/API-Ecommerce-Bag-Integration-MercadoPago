import { Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./aplication/services/user.service";
import { MapperUserService } from "./aplication/mappers/user.mapper";
import { USER_REPOSITORY } from "./aplication/repository/user.repository";
import { UserMysqlRepository } from "./infrastructure/user.mysql.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./infrastructure/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    MapperUserService,
    { provide: USER_REPOSITORY, useClass: UserMysqlRepository },
  ],
  exports: [MapperUserService],
})
export class UserModule {}

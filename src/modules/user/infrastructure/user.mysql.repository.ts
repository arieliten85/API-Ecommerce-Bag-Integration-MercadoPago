import { Repository } from "typeorm";
import { UserRepository } from "../aplication/repository/user.repository";
import { UserEntity } from "../infrastructure/entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { MapperUserService } from "../aplication/mappers/user.mapper";
import { User } from "../domain/user.domain";

@Injectable()
export class UserMysqlRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly mapperUserService: MapperUserService,
  ) {}

  async finByEmail(email: string): Promise<UserEntity> {
    const userFound = await this.userRepository.findOne({
      where: { email },
    });
    if (!userFound) {
      return null;
    }
    return userFound;
  }
  async create(user: User): Promise<User> {
    const userEntity = this.mapperUserService.classToEntity(user);
    const createdUserEntity = await this.userRepository.save(userEntity);
    return this.mapperUserService.entityToClass(createdUserEntity);
  }
  async findAll(): Promise<User[]> {
    const usersEntities = await this.userRepository.find();
    return usersEntities.map((usersEntities) =>
      this.mapperUserService.entityToClass(usersEntities),
    );
  }
  async findById(id: number): Promise<User> {
    const userFound = await this.userRepository.findOne({ where: { id } });
    if (!userFound) {
      return null;
    }
    return this.mapperUserService.entityToClass(userFound);
  }
  async update(id: number, newUser: User): Promise<User> {
    const currentUserEntity = await this.userRepository.findOne({
      where: { id },
    });
    const newUserEntity = this.mapperUserService.classToEntity(newUser);
    this.userRepository.merge(currentUserEntity, newUserEntity);
    const savedUserEntity = await this.userRepository.save(currentUserEntity);
    return this.mapperUserService.entityToClass(savedUserEntity);
  }
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

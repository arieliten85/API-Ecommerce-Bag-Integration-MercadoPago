import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "../../controllers/dto/create-user.dto";
import { UpdateUserDto } from "../../controllers/dto/update-user.dto";

import { User } from "../../domain/user.domain";
import { MapperUserService } from "../mappers/user.mapper";
import { USER_REPOSITORY, UserRepository } from "../repository/user.repository";

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: "User not found",
};
import { ConfigService } from "@nestjs/config";
@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly mapperUserService: MapperUserService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userClass = this.mapperUserService.dtoToClass(createUserDto);
    return await this.userRepository.create(userClass);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async findById(id: number): Promise<User> {
    const userFound = await this.userRepository.findById(id);
    if (!userFound) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return userFound;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const newUserClass = this.mapperUserService.dtoToClass(updateUserDto);
    return await this.userRepository.update(id, newUserClass);
  }
  async delete(id: number): Promise<string> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    this.userRepository.delete(id);
    return `The ID ${id} has been deleted`;
  }
}

import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UserService } from "../aplication/services/user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "../domain/user.domain";
import { AuthGuard } from "@nestjs/passport";
@UseGuards(AuthGuard("jwt"))
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req) {
    const userProfile = req.user;

    return { ...userProfile };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @Get("/allUsers")
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<User> {
    return this.userService.findById(+id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Param("id") id: string): Promise<string> {
    return this.userService.delete(+id);
  }
}

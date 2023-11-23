import { User } from "../../domain/user.domain";
import { UserEntity } from "../../infrastructure/entities/user.entity";

export const USER_REPOSITORY = "USER_REPOSITORY";

export interface UserRepository {
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User>;
  update(id: number, newUser: User): Promise<User>;
  delete(id: number): Promise<void>;
  finByEmail(email: string): Promise<UserEntity>;
}

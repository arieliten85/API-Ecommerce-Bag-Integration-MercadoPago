import { CreateUserDto } from "../../controllers/dto/create-user.dto";
import { UpdateUserDto } from "../../controllers/dto/update-user.dto";
import { User } from "../../domain/user.domain";
import { UserEntity } from "../../infrastructure/entities/user.entity";

export class MapperUserService {
  dtoToClass(classDto: CreateUserDto | UpdateUserDto) {
    const newClass = new User();

    newClass.firstName = classDto.firstName;
    newClass.lastName = classDto.lastName;
    newClass.email = classDto.email;
    newClass.password = classDto.password;
    newClass.isEmailActive = classDto.isEmailActive;

    return newClass;
  }

  classToEntity(userClass: User) {
    const newEntity = new UserEntity();

    newEntity.id = userClass.id;
    newEntity.first_name = userClass.firstName;
    newEntity.last_name = userClass.lastName;
    newEntity.email = userClass.email;
    newEntity.password = userClass.password;
    newEntity.isEmailActive = userClass.isEmailActive;

    return newEntity;
  }

  entityToClass(userEntity: UserEntity) {
    const newClass = new User();
    newClass.id = userEntity.id;
    newClass.firstName = userEntity.first_name;
    newClass.lastName = userEntity.last_name;
    newClass.email = userEntity.email;
    newClass.isEmailActive = userEntity.isEmailActive;

    return newClass;
  }

  entityToClassResetPassword(userEntity: UserEntity) {
    const newClass = new User();
    newClass.id = userEntity.id;
    newClass.firstName = userEntity.first_name;
    newClass.lastName = userEntity.last_name;
    newClass.email = userEntity.email;
    newClass.isEmailActive = userEntity.isEmailActive;
    newClass.password = userEntity.password;

    return newClass;
  }
}

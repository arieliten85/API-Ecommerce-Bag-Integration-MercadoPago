import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "../controllers/dto/RegisterDto";
import {
  USER_REPOSITORY,
  UserRepository,
} from "../../user/aplication/repository/user.repository";

import { MapperUserService } from "../../user/aplication/mappers/user.mapper";
import { LoginDto } from "../controllers/dto/LoginDto";
import { JwtService } from "@nestjs/jwt";
import { comparePassword, hashPassword } from "../utils/bcrypt.utils";
import { jwtConstants } from "../constants";
import { JsonWebTokenError } from "jsonwebtoken";
import { SendPasswordResetDto } from "../controllers/dto/ResetPasswordEmailDto";
import { ResetPasswordDto } from "../controllers/dto/ResetPasswordDto";
import { ConfirmAccountDto } from "../controllers/dto/ConfirmRegisterDto";
import { AUTH_REPOSITORY } from "./repository/auth.repository";
import { AuthMethodsRepository } from "../infrastructure/auth.methods.repository";
import { ReSendConfirmAccountDto } from "../controllers/dto/ConfirmRegisterDto copy";
import { UserEntity } from "src/modules/user/infrastructure/entities/user.entity";
import { User } from "src/modules/user/domain/user.domain";

import { EmailService } from "../../email/services/email.service";

type IResgister = {
  message: string;
};
type ILogin = {
  access_token: string;
};

export const ERROR_MESSAGES = {
  ERROR_EMAIL_EXISTS: "Email already exists",
  ERROR_EMAIL_NOT_EXISTS: "Email does not exist",
  USER_INVALID: "User invalid",
  COUNT_INVALID: "Please verify your email before logging in.",
  COUNT_AREADY_CONFIRM: "Your account is already confirmed.",
  USER_NOT_FOUND: "User not found.",
  ERROR_SEND_EMAIL: "Operation could not be completed.",
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly mapperUserService: MapperUserService,

    @Inject(AUTH_REPOSITORY)
    private readonly authMethodsRepository: AuthMethodsRepository,

    private jwtService: JwtService,

    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILogin> {
    const user = await this.userRepository.finByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_INVALID);
    }
    if (!user.isEmailActive) {
      throw new UnauthorizedException(ERROR_MESSAGES.COUNT_INVALID);
    }

    const isPasswordValid = await comparePassword(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_INVALID);
    }

    const payload = {
      name: user.first_name,
      lasName: user.last_name,
      email: user.email,
      role: user.role,
    };

    const access_token = await this.jwtService.signAsync(payload);
    return {
      access_token,
    };
  }
  async register(registerDto: RegisterDto): Promise<IResgister> {
    const user: UserEntity = await this.userRepository.finByEmail(
      registerDto.email,
    );

    if (user) {
      throw new BadRequestException(ERROR_MESSAGES.ERROR_EMAIL_EXISTS);
    }

    const userResgisterClass: User =
      this.mapperUserService.dtoToClass(registerDto);

    const hashedPassword = await hashPassword(registerDto.password);
    userResgisterClass.password = hashedPassword;

    const newUser = await this.userRepository.create(userResgisterClass);
    const access_token = await this.authMethodsRepository.genetateValidateToken(
      newUser,
      "1d",
    );

    await this.emailService.sendUserEmail_validation(
      userResgisterClass,
      access_token,
    );

    return {
      message: `User created successfully`,
    };
  }

  async confirmAccount({
    token,
  }: ConfirmAccountDto): Promise<{ message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (payload) {
        const user: UserEntity = await this.userRepository.finByEmail(
          payload.email,
        );

        if (!user) {
          throw new UnauthorizedException(ERROR_MESSAGES.USER_INVALID);
        }

        if (user.isEmailActive) {
          throw new UnauthorizedException(ERROR_MESSAGES.COUNT_AREADY_CONFIRM);
        }

        const userClass: User = this.mapperUserService.dtoToClass(user);

        userClass.isEmailActive = true;
        await this.userRepository.update(user.id, userClass);

        return {
          message: `Successful operation.`,
        };
      }
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token has expired");
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException("Invalid token");
      } else if (error.message === ERROR_MESSAGES.COUNT_AREADY_CONFIRM) {
        throw new UnauthorizedException(ERROR_MESSAGES.COUNT_AREADY_CONFIRM);
      } else {
        throw new UnauthorizedException("Authentication error");
      }
    }
  }

  async reSendConfirmAccount({
    email,
  }: ReSendConfirmAccountDto): Promise<{ message: string }> {
    const user: UserEntity = await this.userRepository.finByEmail(email);

    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.ERROR_EMAIL_NOT_EXISTS);
    }

    const access_token = await this.authMethodsRepository.genetateValidateToken(
      user,
      "1d",
    );

    const userClass: User = this.mapperUserService.entityToClass(user);

    const responseSendEmail =
      await this.emailService.sendUserEmail_reconfirmAcound(
        userClass,
        access_token,
      );

    if (!responseSendEmail.success) {
      throw new BadRequestException(ERROR_MESSAGES.ERROR_SEND_EMAIL);
    }

    return {
      message: `Successful operation.`,
    };
  }

  async sendPasswordReset({
    email,
  }: SendPasswordResetDto): Promise<{ message: string }> {
    const user: UserEntity = await this.userRepository.finByEmail(email);
    if (!user) {
      throw new BadRequestException(ERROR_MESSAGES.ERROR_EMAIL_NOT_EXISTS);
    }

    const token = await this.authMethodsRepository.genetateValidateToken(
      {
        sub: user.id,
        email: user.email,
      },
      "1d",
    );

    const userClass: User = this.mapperUserService.entityToClass(user);

    const responseSendEmail =
      await this.emailService.sendUserEmail_resetPassword(userClass, token);

    if (!responseSendEmail.success) {
      throw new BadRequestException(ERROR_MESSAGES.ERROR_SEND_EMAIL);
    }

    return {
      message: `Successful operation.`,
    };
  }

  async resetPassword({
    token,
    password,
  }: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      if (payload) {
        const user = await this.userRepository.finByEmail(payload.email);

        const userClass =
          this.mapperUserService.entityToClassResetPassword(user);

        const hashedPassword = await hashPassword(password);
        userClass.password = hashedPassword;

        await this.userRepository.update(user.id, userClass);
      }

      return {
        message: `Successful operation.`,
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedException("Token has expired");
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException("Invalid token");
      }
    }
  }
}

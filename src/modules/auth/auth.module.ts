import { Module } from "@nestjs/common";
import { AuthService } from "./aplication/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { USER_REPOSITORY } from "../user/aplication/repository/user.repository";
import { UserMysqlRepository } from "../user/infrastructure/user.mysql.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/infrastructure/entities/user.entity";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./infrastructure/passport/jwt.strategy";
import { AUTH_REPOSITORY } from "./aplication/repository/auth.repository";
import { AuthMethodsRepository } from "./infrastructure/auth.methods.repository";
import { EmailModule } from "../email/email.module";
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UserModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "1m" },
      //signOptions: { expiresIn: "1d" },
    }),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: USER_REPOSITORY, useClass: UserMysqlRepository },
    { provide: AUTH_REPOSITORY, useClass: AuthMethodsRepository },
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}

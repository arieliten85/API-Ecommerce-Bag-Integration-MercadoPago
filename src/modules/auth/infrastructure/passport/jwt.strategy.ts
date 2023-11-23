import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "../../constants";
import {
  USER_REPOSITORY,
  UserRepository,
} from "../../../user/aplication/repository/user.repository";
import { Inject } from "@nestjs/common";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const { email } = payload;

    const userFound = await this.userRepository.finByEmail(email);

    const user = {
      firstName: userFound.first_name,
      lastName: userFound.last_name,
      email: userFound.email,
      role: userFound.role,
    };

    return { userId: payload.sub, ...user };
  }
}

import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "../aplication/repository/auth.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthMethodsRepository implements AuthRepository {
  constructor(private readonly jwtService: JwtService) {}

  async genetateValidateToken(
    { id, firstName, lastName, email }: any,
    expiresIn: string,
  ): Promise<string> {
    const payload = {
      id,
      firstName,
      lastName,
      email,
    };

    return await this.jwtService.signAsync(payload, { expiresIn });
  }
}

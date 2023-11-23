export const AUTH_REPOSITORY = "AUTH_REPOSITORY";

export interface AuthRepository {
  genetateValidateToken(user: any, expiresIn: string): Promise<string>;
}

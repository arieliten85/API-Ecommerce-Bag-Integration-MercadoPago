export class User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  resetPasswordToken: string;
  accountVerificationToken: string;
  isEmailActive: boolean;
}

import { IsEmail } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: "user" })
  role: string;

  @Column({ type: "boolean", default: false })
  isEmailActive: boolean;
}

// Create new file: dto/login-user.dto.ts
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
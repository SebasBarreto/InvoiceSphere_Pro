import { IsString, IsEmail, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from 'src/users/role.enum'; // Enum representing user roles

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string; // User's email, must be a valid email format

  @IsString()
  @IsNotEmpty()
  password: string; // User's password, must be a string and not empty

  @IsString()
  @IsNotEmpty()
  name: string; // User's name, must be a string and not empty

  @IsOptional()
  @IsEnum(Role) // Role must be one of the valid roles
  role?: Role; // User's role (optional, defaults if not specified)
}

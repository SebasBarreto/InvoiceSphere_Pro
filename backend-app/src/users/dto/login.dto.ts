import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  /**
   * Email of the user. Must be a valid email address.
   */
  @IsEmail()
  @IsNotEmpty() // Ensures the email is not empty
  email: string;

  /**
   * Password of the user. Must be a non-empty string.
   */
  @IsString()
  @IsNotEmpty() // Ensures the password is not empty
  password: string;
}

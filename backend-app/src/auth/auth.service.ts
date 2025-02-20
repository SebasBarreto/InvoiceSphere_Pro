import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates the user by decoding the JWT payload and checking if the user exists.
   * @param payload JWT payload containing the user's email.
   * @returns The user object if found, else null.
   */
  async validateUser(payload: any) {
    try {
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        this.logger.warn(`User with email ${payload.email} not found`);
        return null;
      }
      return user;
    } catch (error) {
      this.logger.error('Error validating user', error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Handles user login by validating credentials and generating a JWT token.
   * @param loginDto The login data transfer object.
   * @returns An object containing the access token.
   */
  async login(loginDto: LoginDto) {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.email}`);
      const user = await this.usersService.findByEmail(loginDto.email);

      if (!user) {
        this.logger.warn(`User with email ${loginDto.email} does not exist`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Compare passwords using bcrypt
      const isValid = await bcrypt.compare(loginDto.password, user.password);
      if (!isValid) {
        this.logger.warn(`Invalid password attempt for user: ${loginDto.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = { sub: user._id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
      this.logger.log(`User ${user.email} logged in successfully`);

      return { access_token: token };
    } catch (error) {
      this.logger.error('Error during login', error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  /**
   * Registers a new user by hashing the password and creating a new user record.
   * @param createUserDto The user data transfer object for registration.
   * @returns An object containing the access token.
   */
  async register(createUserDto: CreateUserDto) {
    try {
      this.logger.log(`Registering user with email: ${createUserDto.email}`);

      // Hash password before saving to DB
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      // Create the user in the database
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Generate JWT token for the newly registered user
      const payload = { sub: user._id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
      this.logger.log(`User ${user.email} registered successfully`);

      return { access_token: token };
    } catch (error) {
      this.logger.error('Error during user registration', error.stack);
      throw new UnauthorizedException('User registration failed');
    }
  }
}

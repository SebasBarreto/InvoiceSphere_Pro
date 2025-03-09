import { Controller, Get, Put, Delete, Body, Param, UseGuards, Request, ForbiddenException, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from './role.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  /**
   * Fetch all users (Admin only)
   * @returns All users in the system
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAllUsers() {
    this.logger.log('Fetching all users');
    return this.usersService.findAll();
  }

  /**
   * Get a specific user by ID
   * @param id User ID
   * @returns The user data
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserById(@Param('id') id: string) {
    this.logger.log(`Fetching user with id: ${id}`);
    return this.usersService.findOne(id);
  }

  /**
   * Update a user's profile (Admin or user updating their own profile)
   * @param id User ID
   * @param updateUserDto Data to update the user
   * @param req Request object to access authenticated user's data
   * @returns The updated user data
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.User)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
    @Request() req: any,
  ) {
    // Ensuring Admin can update any user and users can update only their own profile
    if (req.user.role !== Role.Admin && req.user.id !== id) {
      throw new ForbiddenException('You do not have permission to update this user');
    }

    this.logger.log(`Updating user with id: ${id}`);
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Delete a user (Admin only)
   * @param id User ID
   * @returns Success message after deletion
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteUser(@Param('id') id: string) {
    this.logger.log(`Deleting user with id: ${id}`);
    return this.usersService.remove(id);
  }
}

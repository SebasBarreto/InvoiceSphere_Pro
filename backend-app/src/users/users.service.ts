import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    
    constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

    /**
     * Fetch user by email
     * @param email The email address of the user
     * @returns The user if found, or null
     */
    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email }).exec();
    }
    
    /**
     * Create a new user
     * @param createUserDto Data transfer object to create a user
     * @returns The created user
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        this.logger.log(`Creando usuario con email ${createUserDto.email}`);
        return createdUser.save();
    }

    /**
     * Fetch all users
     * @returns A list of all users
     */
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    /**
     * Fetch a user by ID
     * @param id The ID of the user to find
     * @returns The user if found
     * @throws NotFoundException If user not found
     */
    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return user;
    }

    /**
     * Update a user's details
     * @param id The ID of the user to update
     * @param updateUserDto Data transfer object with updated user info
     * @returns The updated user
     * @throws NotFoundException If user not found
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        if (updateUserDto.password) {
            // Si se actualiza la contraseña, encriptarla
            const salt = await bcrypt.genSalt(10);
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
        }

        if (updateUserDto.Role) {
            updateUserDto.Role = updateUserDto.Role === 'admin' ? 'admin' : 'user';  
        }

        const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        this.logger.log(`Actualizado usuario ${id} con rol ${updateUserDto.Role}`);
        return user;
    }
    

    /**
     * Remove a user from the system
     * @param id The ID of the user to remove
     * @returns A confirmation message
     * @throws NotFoundException If user not found
     */
    async remove(id: string): Promise<any> {
        const user = await this.userModel.findByIdAndDelete(id).exec();
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        this.logger.log(`Eliminado usuario ${id}`);
        return { message: 'Usuario eliminado' };
    }

    /**
     * Get the total number of users
     * @returns The count of all users
     */
    async getUserCount(): Promise<number> {
        return this.userModel.countDocuments().exec();
    }

    /**
     * Get the total number of admins
     * @returns The count of all users with role 'admin'
     */
    async getAdminCount(): Promise<number> {
        return this.userModel.countDocuments({ role: 'admin' }).exec();
    }
}

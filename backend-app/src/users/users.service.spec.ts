import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.interface';
import { NotFoundException, BadRequestException } from '@nestjs/common';

// Mocking the User model
const mockUserModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,  // Mocking User model
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password', name: 'Test User', role: 'user' };
      mockUserModel.create.mockResolvedValue(createUserDto);

      const result = await service.create(createUserDto);
      expect(result).toEqual(createUserDto);
      expect(mockUserModel.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const createUserDto = { email: '', password: 'password', name: 'Test User' }; // Missing role

      await expect(service.create(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersArray = [
        { email: 'test1@example.com', password: 'password1', name: 'Test User 1', role: 'user' },
        { email: 'test2@example.com', password: 'password2', name: 'Test User 2', role: 'admin' },
      ];
      mockUserModel.find.mockResolvedValue(usersArray);

      const result = await service.findAll();
      expect(result).toEqual(usersArray);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { email: 'test@example.com', password: 'password', name: 'Test User', role: 'user' };
      mockUserModel.findById.mockResolvedValue(user);

      const result = await service.findOne('12345');
      expect(result).toEqual(user);
      expect(mockUserModel.findById).toHaveBeenCalledWith('12345');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.findOne('12345')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto = { name: 'Updated User' };
      const updatedUser = { email: 'test@example.com', password: 'password', name: 'Updated User', role: 'user' };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await service.update('12345', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith('12345', updateUserDto, { new: true });
    });

    it('should throw NotFoundException if user is not found for update', async () => {
      const updateUserDto = { name: 'Updated User' };
      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('12345', updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if role is invalid', async () => {
      const updateUserDto = { role: 'invalidRole' };

      await expect(service.update('12345', updateUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const deleteResponse = { message: 'User deleted' };
      mockUserModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.remove('12345');
      expect(result).toEqual(deleteResponse);
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('12345');
    });

    it('should throw NotFoundException if user is not found for deletion', async () => {
      mockUserModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('12345')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserCount', () => {
    it('should return the count of users', async () => {
      mockUserModel.countDocuments.mockResolvedValue(5);

      const result = await service.getUserCount();
      expect(result).toBe(5);
    });
  });

  describe('getAdminCount', () => {
    it('should return the count of admins', async () => {
      mockUserModel.countDocuments.mockResolvedValue(2);

      const result = await service.getAdminCount();
      expect(result).toBe(2);
    });
  });
});

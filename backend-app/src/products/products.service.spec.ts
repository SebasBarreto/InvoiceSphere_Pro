import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Product } from './product.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Mocking the Product model
const mockProductModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  save: jest.fn(),
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,  // Mocking Product model
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto = { name: 'Product1', price: 100, stock: 10, status: 'active' };
      mockProductModel.create.mockResolvedValue(createProductDto);

      const result = await service.create(createProductDto);
      expect(result).toEqual(createProductDto);
      expect(mockProductModel.create).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw BadRequestException if required fields are missing', async () => {
      const createProductDto = { name: '', price: 100, stock: 10, status: 'active' };

      await expect(service.create(createProductDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const productsArray = [
        { name: 'Product1', price: 100, stock: 10, status: 'active' },
        { name: 'Product2', price: 200, stock: 5, status: 'inactive' },
      ];
      mockProductModel.find.mockResolvedValue(productsArray);

      const result = await service.findAll();
      expect(result).toEqual(productsArray);
    });
  });

  describe('findOne', () => {
    it('should return a product by id or productId', async () => {
      const product = { name: 'Product1', price: 100, stock: 10, status: 'active' };
      mockProductModel.findOne.mockResolvedValue(product);

      const result = await service.findOne('productId');
      expect(result).toEqual(product);
      expect(mockProductModel.findOne).toHaveBeenCalledWith({
        $or: [{ _id: 'productId' }, { productId: 'productId' }],
      });
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductDto = { stock: 5 };
      const updatedProduct = { name: 'Product1', price: 100, stock: 5, status: 'active' };
      mockProductModel.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      const result = await service.update('productId', updateProductDto);
      expect(result).toEqual(updatedProduct);
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'productId',
        updateProductDto,
        { new: true },
      );
    });

    it('should throw NotFoundException if product not found', async () => {
      const updateProductDto = { stock: 5 };
      mockProductModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(service.update('invalidId', updateProductDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if stock is negative', async () => {
      const updateProductDto = { stock: -5 };

      await expect(service.update('productId', updateProductDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a product successfully', async () => {
      const deleteResponse = { message: 'Product deleted' };
      mockProductModel.findByIdAndDelete.mockResolvedValue({});

      const result = await service.remove('productId');
      expect(result).toEqual(deleteResponse);
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith('productId');
    });

    it('should throw NotFoundException if product not found for deletion', async () => {
      mockProductModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(service.remove('invalidId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStock', () => {
    it('should update stock successfully', async () => {
      const product = { name: 'Product1', price: 100, stock: 10, status: 'active' };
      mockProductModel.findById.mockResolvedValue(product);
      mockProductModel.save.mockResolvedValue(product);

      const result = await service.updateStock('productId', 5);
      expect(result.stock).toBe(5);
      expect(mockProductModel.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found for stock update', async () => {
      mockProductModel.findById.mockResolvedValue(null);

      await expect(service.updateStock('invalidId', 5)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if there is not enough stock', async () => {
      const product = { name: 'Product1', price: 100, stock: 2, status: 'active' };
      mockProductModel.findById.mockResolvedValue(product);

      await expect(service.updateStock('productId', 5)).rejects.toThrow(BadRequestException);
    });
  });
});

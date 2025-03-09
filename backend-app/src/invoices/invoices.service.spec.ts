// invoices.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { ProductsService } from 'src/products/products.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoiceDocument } from './schema/invoices.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoices.dto';


describe('InvoicesService', () => {
  let service: InvoicesService;
  let mockProductsService: ProductsService;
  let mockInvoiceModel: Model<InvoiceDocument>;

  beforeEach(async () => {
    // Mocking ProductsService and InvoiceModel
    mockProductsService = {
      findOne: jest.fn(),
    } as any;

    mockInvoiceModel = {
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        { provide: ProductsService, useValue: mockProductsService },
        { provide: getModelToken('Invoice'), useValue: mockInvoiceModel },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFromCart', () => {
    it('should create an invoice successfully', async () => {
      const createInvoiceDto = {
        user_id: 'user1',
        products: [
          { productId: 'product1', quantity: 2 },
          { productId: 'product2', quantity: 1 },
        ],
        total: 100,
        date: new Date(),
        invoiceCode: 'INV123',
      };

      const mockProduct = { _id: 'product1', name: 'Product 1', price: 50 };
      mockProductsService.findOne = jest.fn().mockResolvedValue(mockProduct);
      mockInvoiceModel.create = jest.fn().mockResolvedValue({
        ...createInvoiceDto,
        products: [
          { productId: 'product1', name: 'Product 1', price: 50, quantity: 2, total: 100 },
        ],
      });

      const result = await service.createFromCart(createInvoiceDto);

      expect(result).toHaveProperty('invoiceCode');
      expect(mockInvoiceModel.create).toHaveBeenCalledWith(expect.objectContaining(createInvoiceDto));
    });

    it('should throw BadRequestException for invalid productId', async () => {
      const createInvoiceDto = {
        user_id: 'user1',
        products: [
          { productId: 'invalidProduct', quantity: 2 },
        ],
        total: 100,
        date: new Date(),
        invoiceCode: 'INV123',
      };

      const mockProduct = null; // Product not found
      mockProductsService.findOne = jest.fn().mockResolvedValue(mockProduct);

      await expect(service.createFromCart(createInvoiceDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return the invoice details', async () => {
      const mockInvoice = {
        _id: 'invoice1',
        user_id: 'user1',
        products: [
          { productId: 'product1', name: 'Product 1', price: 50, quantity: 2, total: 100 },
        ],
        total: 100,
        date: new Date(),
        invoiceCode: 'INV123',
      };

      mockInvoiceModel.findById = jest.fn().mockResolvedValue(mockInvoice);

      const result = await service.findOne('invoice1');
      expect(result).toEqual(mockInvoice);
    });

    it('should throw NotFoundException when invoice is not found', async () => {
      mockInvoiceModel.findById = jest.fn().mockResolvedValue(null);

      await expect(service.findOne('nonexistentInvoice')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const mockInvoices = [
        { _id: 'invoice1', total: 100 },
        { _id: 'invoice2', total: 200 },
      ];

      mockInvoiceModel.find = jest.fn().mockResolvedValue(mockInvoices);

      const result = await service.findAll();
      expect(result).toEqual(mockInvoices);
    });
  });

  describe('findUserInvoices', () => {
    it('should return invoices for the given user', async () => {
      const mockUserInvoices = [
        { _id: 'invoice1', user_id: 'user1', total: 100 },
        { _id: 'invoice2', user_id: 'user1', total: 200 },
      ];

      mockInvoiceModel.find = jest.fn().mockResolvedValue(mockUserInvoices);

      const result = await service.findUserInvoices('user1');
      expect(result).toEqual(mockUserInvoices);
    });
  });

  describe('getInvoicesToday', () => {
    it('should return the count of invoices created today', async () => {
      mockInvoiceModel.countDocuments = jest.fn().mockResolvedValue(5);

      const result = await service.getInvoicesToday();
      expect(result).toBe(5);
    });
  });

  describe('getUserPurchasesAnalytics', () => {
    it('should return analytics data for user purchases', async () => {
      mockInvoiceModel.aggregate = jest.fn().mockResolvedValue([
        { _id: 'user1', count: 3 },
      ]);

      const result = await service.getUserPurchasesAnalytics('user1');
      expect(result).toEqual([{ _id: 'user1', count: 3 }]);
    });

    it('should throw BadRequestException for invalid userId format', async () => {
      await expect(service.getUserPurchasesAnalytics('invalidUserId')).rejects.toThrow(BadRequestException);
    });
  });
});

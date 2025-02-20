import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create-invoices.dto';
import { InvoiceSchema, InvoiceDocument } from './schema/invoices.schema';
import { ProductsService } from 'src/products/products.service'; 
import { ObjectId } from 'mongodb';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<InvoiceDocument>,
    private readonly productsService: ProductsService, 
  ) {}

  /**
   * Creates an invoice based on the user's cart.
   * @param createInvoiceDto The invoice data from the cart.
   * @returns The created invoice.
   */
  async createFromCart(createInvoiceDto: CreateInvoiceDto) {
    this.logger.log('Creating invoice from cart');
    
    const productsWithDetails = await Promise.all(createInvoiceDto.products.map(async (item) => {
      const productId = item.productId;

      if (!ObjectId.isValid(productId)) {
        throw new BadRequestException(`Invalid product ID ${productId}`);
      }

      const product = await this.productsService.findOne(productId);

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const total = product.price * item.quantity;

      return {
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: total,
      };
    }));

    const totalInvoice = productsWithDetails.reduce((sum, item) => sum + item.total, 0);

    const invoice = await this.invoiceModel.create({
      ...createInvoiceDto,
      products: productsWithDetails,
      total: totalInvoice,
    });

    this.logger.log(`Invoice created successfully with code: ${invoice.invoiceCode}`);
    
    await this.updateStock(createInvoiceDto.products);

    return invoice;
  }

  /**
   * Updates product stock after invoice creation.
   * @param products The products in the invoice.
   */
  async updateStock(products: any[]) {
    for (const item of products) {
      const product = await this.productsService.findOne(item.productId);

      if (product) {
        product.stock -= item.quantity;
        await product.save();
        this.logger.log(`Stock updated for product ${product.name}, new stock: ${product.stock}`);
      } else {
        this.logger.warn(`Product with ID ${item.productId} not found`);
      }
    }
  }

  /**
   * Fetches an invoice by its ID.
   * @param id The ID of the invoice.
   * @returns The invoice details.
   */
  async findOne(id: string) {
    this.logger.log(`Fetching invoice with ID: ${id}`);
    try {
      const invoice = await this.invoiceModel.findById(id)
        .populate('products.productId')
        .exec();

      if (!invoice) {
        this.logger.error(`Invoice with ID ${id} not found`);
        throw new NotFoundException(`Invoice with ID ${id} not found`);
      }

      return invoice;
    } catch (error) {
      this.logger.error('Error fetching invoice', error.stack);
      throw error;
    }
  }

  /**
   * Fetches all invoices.
   * @returns A list of all invoices.
   */
  async findAll() {
    this.logger.log('Fetching all invoices');
    try {
      return this.invoiceModel.find().exec();
    } catch (error) {
      this.logger.error('Error fetching all invoices', error.stack);
      throw error;
    }
  }

  /**
   * Fetches invoices for a specific user.
   * @param userId The user's ID.
   * @returns A list of the user's invoices.
   */
  async findUserInvoices(userId: string) {
    this.logger.log(`Fetching invoices for user ID: ${userId}`);

    const objectIdUserId = new ObjectId(userId);

    try {
      return this.invoiceModel.find({ user_id: objectIdUserId }).exec();
    } catch (error) {
      this.logger.error('Error fetching user invoices', error.stack);
      throw error;
    }
  }

  /**
   * Fetches the number of invoices created today.
   * @returns The count of today's invoices.
   */
  async getInvoicesToday(): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    this.logger.log('Fetching the number of invoices created today');
    try {
      return this.invoiceModel.countDocuments({
        date: { $gte: startOfDay, $lte: endOfDay },
      }).exec();
    } catch (error) {
      this.logger.error('Error fetching invoices for today', error.stack);
      throw error;
    }
  }

  /**
   * Fetches analytics for user purchases.
   * @param userId The ID of the user.
   * @returns User purchase analytics.
   */
  async getUserPurchasesAnalytics(userId: string): Promise<any> {
    this.logger.log(`Fetching purchase analytics for user ID: ${userId}`);

    if (!ObjectId.isValid(userId)) {
      this.logger.error(`Invalid userId: ${userId}`);
      throw new BadRequestException('Invalid userId format');
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    try {
      return this.invoiceModel.aggregate([
        { $match: { user_id: new ObjectId(userId), date: { $gte: oneMonthAgo } } },
        { $group: { _id: '$user_id', count: { $sum: 1 } } },
      ]);
    } catch (error) {
      this.logger.error('Error fetching user purchase analytics', error.stack);
      throw error;
    }
  }
}

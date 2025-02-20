import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './product.entity';
import { Types } from 'mongoose';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  /**
   * Creates a new product.
   * @param createProductDto The DTO with the product data.
   * @returns The created product.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating product: ${createProductDto.name}`);

    if (!createProductDto.name || !createProductDto.price || !createProductDto.stock || !createProductDto.status) {
      throw new BadRequestException('Required data missing to create product');
    }

    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  /**
   * Retrieves all products.
   * @returns A list of all products.
   */
  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  /**
   * Retrieves a single product by its ID or productId.
   * @param productId The ID of the product to retrieve.
   * @returns The requested product.
   */
  async findOne(productId: string): Promise<ProductDocument> {
    const product = await this.productModel.findOne({
      $or: [{ _id: productId }, { productId: productId }],
    }).exec();

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return product;
  }

  /**
   * Updates an existing product.
   * @param id The ID of the product to update.
   * @param updateProductDto The DTO containing the updated product data.
   * @returns The updated product.
   */
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.logger.log(`Product with ID ${id} updated`);
    return updatedProduct;
  }

  /**
   * Deletes a product by its ID.
   * @param id The ID of the product to delete.
   * @returns A confirmation message.
   */
  async remove(id: string): Promise<{ message: string }> {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    this.logger.log(`Product with ID ${id} deleted`);
    return { message: 'Product deleted' };
  }

  /**
   * Returns the count of active products.
   * @returns The number of active products.
   */
  async getActiveProductsCount(): Promise<number> {
    return this.productModel.countDocuments({ status: 'active' }).exec();
  }

  /**
   * Returns the count of inactive products.
   * @returns The number of inactive products.
   */
  async getInactiveProductsCount(): Promise<number> {
    return this.productModel.countDocuments({ status: 'inactive' }).exec();
  }

  /**
   * Updates the stock of a product by reducing its quantity.
   * @param productId The ID of the product to update.
   * @param quantity The quantity to subtract from the stock.
   * @returns The updated product.
   */
  async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    product.stock -= quantity;
    await product.save();

    this.logger.log(`Stock updated for product with ID ${productId}. New stock: ${product.stock}`);
    return product;
  }
}

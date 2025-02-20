import { Controller, Get, Post, Body, Put, Param, UseGuards, Logger, Delete, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Ensures the user is authenticated
import { RolesGuard } from 'src/auth/roles.guard'; // Ensures role-based access control
import { Roles } from 'src/auth/roles.decorator'; // Custom decorator for roles
import { Role } from 'src/users/role.enum'; // Enum for user roles
import { CreateProductDto } from './dto/create-product.dto'; // DTO for creating products
import { UpdateProductDto } from './dto/update-product.dto'; // DTO for updating products

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  /**
   * Route to fetch all products
   * @returns All products
   */
  @Get()
  @UseGuards(JwtAuthGuard) // Ensures the user is authenticated
  findAll() {
    this.logger.log('Fetching all products');
    return this.productsService.findAll();
  }

  /**
   * Route to create a new product
   * @param createProductDto DTO containing the new product data
   * @returns The created product
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // Role-based access control: Only Admin can create products
  @Roles(Role.Admin)
  async create(@Body() createProductDto: CreateProductDto) {
    // Validate required fields before creating the product
    if (!createProductDto.name || !createProductDto.price || !createProductDto.stock || !createProductDto.status) {
      this.logger.warn('Missing required fields for creating a product');
      throw new BadRequestException('Required data is missing to create the product');
    }

    this.logger.log('Creating a new product');
    return this.productsService.create(createProductDto);
  }

  /**
   * Route to update a product by its ID
   * @param id Product ID
   * @param updateProductDto DTO containing the updated product data
   * @returns The updated product
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Role-based access control: Only Admin can update products
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // Ensure stock is not negative
    if (updateProductDto.stock !== undefined && updateProductDto.stock < 0) {
      this.logger.warn(`Attempt to set negative stock for product ID: ${id}`);
      throw new BadRequestException('Stock cannot be negative');
    }

    this.logger.log(`Updating product with ID ${id}`);
    return this.productsService.update(id, updateProductDto);
  }

  /**
   * Route to delete a product by its ID
   * @param id Product ID
   * @returns The deleted product
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) // Role-based access control: Only Admin can delete products
  @Roles(Role.Admin)
  async remove(@Param('id') id: string) {
    this.logger.log(`Deleting product with ID ${id}`);
    return this.productsService.remove(id);
  }
}

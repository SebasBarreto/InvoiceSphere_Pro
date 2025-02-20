import { Controller, Get, Post, Body, Param, UseGuards, Request, ForbiddenException, Logger } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/users/role.enum';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';

@Controller('invoices')
export class InvoicesController {
  private readonly logger = new Logger(InvoicesController.name);

  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  /**
   * Creates an invoice based on the user's cart.
   * Accessible only to users.
   * @param createInvoiceDto Invoice data from the user's cart
   * @param req Request object that includes user info from JWT
   * @returns The created invoice
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async createInvoice(@Body() createInvoiceDto: any, @Request() req: any) {
    this.logger.log(`User ${req.user.id} is creating an invoice`);
    
    // Assign user_id from JWT token to the invoice
    createInvoiceDto.user_id = req.user.id;

    // Ensure the user can only create invoices for their own purchases
    if (createInvoiceDto.user_id !== req.user.id) {
      this.logger.warn(`User ${req.user.email} attempted to create an invoice for another user`);
      throw new ForbiddenException('You can only create invoices for your own purchases');
    }

    return this.invoicesService.createFromCart(createInvoiceDto);
  }

  /**
   * Fetches all invoices.
   * Accessible only by admins.
   * @returns A list of all invoices
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAllInvoices() {
    this.logger.log('Fetching all invoices');
    return this.invoicesService.findAll();
  }

  /**
   * Fetches an invoice by ID.
   * Accessible only by admins.
   * @param id The ID of the invoice to fetch
   * @returns The invoice with the specified ID
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getInvoiceById(@Param('id') id: string) {
    this.logger.log(`Fetching invoice with id: ${id}`);
    return this.invoicesService.findOne(id);
  }

  /**
   * Fetches all invoices for a specific user.
   * Accessible by the user or admins.
   * @param userId The ID of the user whose invoices to fetch
   * @param req Request object, includes user info from JWT
   * @returns A list of invoices for the user
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  async getUserInvoices(@Param('userId') userId: string, @Request() req: any) {
    // Ensure users can only access their own invoices
    if (req.user.id !== userId) {
      this.logger.warn(`User ${req.user.email} tried to access another user's invoices`);
      throw new ForbiddenException('You are not allowed to view this user\'s invoices');
    }

    return this.invoicesService.findUserInvoices(userId);
  }

  /**
   * Fetches analytics for a specific user.
   * Accessible only by admins.
   * @param userId The ID of the user whose analytics to fetch
   * @param req Request object, includes user info from JWT
   * @returns Analytics data for the user
   */
  @Get('user/:userId/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUserInvoiceAnalytics(@Param('userId') userId: string, @Request() req: any) {
    this.logger.log(`Fetching analytics for user id: ${userId}`);
  
    // Fetch various analytics for the user
    const userAnalytics = await this.invoicesService.getUserPurchasesAnalytics(userId);
    const userCount = await this.usersService.getUserCount();
    const adminCount = await this.usersService.getAdminCount();
    const invoicesToday = await this.invoicesService.getInvoicesToday();
    const activeProducts = await this.productsService.getActiveProductsCount();
    const inactiveProducts = await this.productsService.getInactiveProductsCount();

    return {
      userAnalytics,
      userCount,
      adminCount,
      invoicesToday,
      activeProducts,
      inactiveProducts,
    };
  }
}

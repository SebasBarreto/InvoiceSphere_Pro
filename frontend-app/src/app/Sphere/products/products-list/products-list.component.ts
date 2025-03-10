import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../product.service';
import { Product } from '../product.model';
import { InvoiceService } from '../../invoices/invoice.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  cart: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 9;
  isCartVisible: boolean = false;

  constructor(
    private productService: ProductsService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(
      (products) => {
        this.products = products;
        this.filteredProducts = this.products;
        this.updatePaginatedProducts();
      },
      (error) => {
        console.error('Error loading products', error);
      }
    );
  }

  filterProducts(event: any) {
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) => product.name.toLowerCase().includes(query)
    );
    this.updatePaginatedProducts();
  }

  toggleDescription(product: Product) {
    product.showFullDescription = !product.showFullDescription;
  }

  updatePaginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page < 1 || page > Math.ceil(this.filteredProducts.length / this.itemsPerPage)) {
      return;
    }
    this.currentPage = page;
    this.updatePaginatedProducts();
  }

  addToCart(product: Product) {
    const existingProduct = this.cart.find((item) => item.product._id === product._id);
  
    if (existingProduct) {
      if (existingProduct.quantity < product.stock) {
        existingProduct.quantity++;
        this.cart = [...this.cart];
      } else {
        alert('You cannot add more units, the maximum stock is ' + product.stock);
      }
    } else {
      if (product.stock > 0) {
        this.cart.push({ product: product, quantity: 1 });
        this.cart = [...this.cart];
      } else {
        alert('This product is out of stock.');
      }
    }
  }

  updateCartSummary() {
    this.cart = [...this.cart];
  }

  trackByProductId(index: number, item: any): string {
    return item.product._id;
  }

  removeFromCart(product: Product) {
    const existingProduct = this.cart.find((item) => item.product._id === product._id);
  
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
        this.cart = [...this.cart];
      } else {
        this.cart = this.cart.filter(item => item.product._id !== product._id);
      }
    }
  }

  clearCart() {
    this.cart = [];
  }

  get cartTotal() {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartSummary() {
    return this.cart.map((item) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
      product: item.product
    }));
  }

  toggleCart() {
    this.isCartVisible = !this.isCartVisible;
  }

  closeCart() {
    this.isCartVisible = false;
  }

  generateInvoice() {
    if (this.cart.length === 0) {
      alert('Your cart is empty. Invoice cannot be generated.');
      return;
    }
  
    const invalidItems = this.cart.filter(item => item.quantity > item.product.stock);
    if (invalidItems.length > 0) {
      alert('There are products in the cart with quantities exceeding the available stock.');
      return;
    }
  
    const invoiceItems = this.getCartSummary();
    const totalAmount = invoiceItems.reduce((total, item) => total + item.total, 0);
  
    const invoiceCode = 'INV-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
    const invoiceData = {
      user_id: 'user-id-here',
      products: invoiceItems,
      total: totalAmount,
      date: new Date().toISOString(),
      invoiceCode: invoiceCode,
    };
  
    this.invoiceService.generateInvoice(invoiceData).subscribe(
      (invoice) => {
        this.cart.forEach((item) => {
          const product = this.products.find((p) => p._id === item.product._id);
          if (product) {
            product.stock -= item.quantity;
          }
        });
  
        this.cart = [];
        this.closeCart();
        alert('Invoice generated successfully!');
        this.updatePaginatedProducts();
      },
      (error) => {
        alert('Failed to generate invoice.');
      }
    );
  }
}

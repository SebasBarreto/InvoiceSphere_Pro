import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductsService } from '../product.service';

@Component({
  selector: 'app-products-management',
  templateUrl: './products-management.component.html',
  styleUrls: ['./products-management.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ProductsManagementComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';  // Make sure to define this property
  sortOrder: 'asc' | 'desc' = 'asc';  // Define the order state
  errorMessage: string = '';
  selectedProduct: any = null;
  statusFilter: string = 'all'; // New property for status filter
  searchTermEmail: string = ''; // Email filter (if needed)
  searchTermName: string = '';  // Name filter (if needed)
  newProduct = { name: '', description: '', status: '', stock: 0, price: 0 };
  isAddProductOverlayVisible: boolean = false; // State for Add Product overlay visibility

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = [...this.products]; // Initialize filteredProducts
      },
      (error) => {
        this.errorMessage = 'There was an issue loading the products.';
      }
    );
  }

  // Method to apply filters
  applyFilters(): void {
    let filtered = this.products;

    // Filter by name
    if (this.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === this.statusFilter);
    }

    this.filteredProducts = filtered;
  }

  filterProducts(event: Event): void {
    const input = event.target as HTMLInputElement;  // Get the input value
    this.searchQuery = input.value;  // Assign value to searchQuery
    this.applyFilters();  // Apply filters on search
  }

  sortProducts(): void {
    if (this.sortOrder === 'asc') {
      this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));  // Ascending order
      this.sortOrder = 'desc';
    } else {
      this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));  // Descending order
      this.sortOrder = 'asc';
    }
  }

  deleteProduct(productId: string): void {
    this.productsService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter(product => product._id !== productId);
        console.log('Product deleted');
      },
      error => {
        console.error('Error deleting product:', error);
      }
    );
  }

  saveProduct(): void {
    if (this.selectedProduct) {
      console.log('Product data to update:', this.selectedProduct); // Check that data is correct
      this.productsService.updateProduct(this.selectedProduct._id, this.selectedProduct).subscribe(
        (updatedProduct) => {
          console.log('Product updated', updatedProduct);
          this.loadProducts();
          this.selectedProduct = null;
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
    }
  }

  // Method to open the "Add Product" overlay
  openAddProductOverlay(): void {
    this.isAddProductOverlayVisible = true;
  }

  // Method to close the "Add Product" overlay
  closeAddProductOverlay(): void {
    this.isAddProductOverlayVisible = false;
  }

  // Method to create a new product
  createProduct(): void {
    if (this.newProduct.name && this.newProduct.price > 0 && this.newProduct.stock >= 0) {
      this.productsService.createProduct(this.newProduct).subscribe(
        (data) => {
          console.log('Product created successfully');
          this.products.push(data); // Add new product to the list
          this.newProduct = { name: '', description: '', status: '', stock: 0, price: 0 }; // Clear form
          this.isAddProductOverlayVisible = false; // Close overlay
        },
        (error) => {
          console.error('Error creating product:', error);
        }
      );
    } else {
      console.log('Incomplete data');
    }
  }

  // Method to select a product for editing
  selectProductToEdit(product: any): void {
    this.selectedProduct = { ...product }; // Clone product for editing
  }

  // Method to cancel product editing
  cancelEdit(): void {
    this.selectedProduct = null; // Or logic to cancel editing
  }

  confirmDelete(productId: string): void {
    const isConfirmed = confirm('Are you sure you want to delete this product?');
    if (isConfirmed) {
      // Call delete product function if user confirms
      this.deleteProduct(productId);
    }
  }
}

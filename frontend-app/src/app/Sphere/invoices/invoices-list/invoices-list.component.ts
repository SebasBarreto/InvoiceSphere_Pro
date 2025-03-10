import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { ProductsService } from '../../products/product.service';
import { UserService } from '../../users/user.service';
import { Router } from '@angular/router';
import { JwtService } from '../../auth/jwt.service';  // Service to get the user ID

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css']
})
export class InvoicesListComponent implements OnInit {
  invoices: any[] = [];  // All invoices (unfiltered)
  filteredInvoices: any[] = [];  // Filtered invoices
  searchQuery: string = '';  // Search parameter for invoiceCode
  userSearchQuery: string = '';  // Search parameter for user ID
  errorMessage: string = '';  // Error message in case of issues
  selectedInvoice: any = null;  // Selected invoice
  isModalOpen: boolean = false;  // Whether the modal is open or closed

  // New: Show only the latest 50 invoices
  showAnnouncement: boolean = true;  // Announcement to inform only the latest 50 invoices are displayed

  constructor(
    private invoiceService: InvoiceService,
    private productsService: ProductsService,  // Inject ProductsService
    private userService: UserService,  // Inject UsersService
    private router: Router,
    private jwtService: JwtService  // Service to get the user ID
  ) {}

  ngOnInit(): void {
    this.loadInvoices();  // Load the latest 50 invoices on init
  }

  // Load the latest 50 invoices (sorted by invoiceCode)
  loadInvoices(): void {
    this.invoiceService.getAllInvoices().subscribe(
      (data) => {
        // Sort invoices by invoiceCode alphabetically
        this.invoices = data.sort((a, b) => a.invoiceCode.localeCompare(b.invoiceCode)).slice(0, 50);  // Get only the latest 50 invoices
        this.filteredInvoices = [...this.invoices];  // Initially, display all invoices
      },
      (error) => {
        this.errorMessage = 'There was an issue loading the invoices';
        console.error(this.errorMessage, error);  // Log error in console
      }
    );
  }

  // Filter invoices by invoiceCode or user_id
  filterInvoices(): void {
    let filtered = this.invoices;

    if (this.searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.invoiceCode.includes(this.searchQuery)  // Search by invoiceCode
      );
    }

    if (this.userSearchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.user_id && invoice.user_id.toString().includes(this.userSearchQuery)  // Search by user_id
      );
    }

    this.filteredInvoices = filtered;  // Update the filtered invoices
  }

  // Load the selected invoice with product names and user info
  loadInvoice(invoiceId: string) {
    this.invoiceService.getInvoiceById(invoiceId).subscribe(
      (invoiceData) => {
        // Assign the selected invoice
        this.selectedInvoice = invoiceData;

        // Get product names
        for (let item of this.selectedInvoice.products) {
          // Subscribe to getProductById
          this.productsService.getProductById(item.product).subscribe(
            (product) => {
              item.product.name = product.name;  // Assign the product name
            },
            (err) => {
              console.error("Error fetching product", err);
            }
          );
        }

        // Get the user's name
        this.userService.getUserById(this.selectedInvoice.user_id).subscribe(
          (user) => {
            this.selectedInvoice.user_id.email = user.email;  // Assign the user's email
          },
          (err) => {
            console.error("Error fetching user", err);
          }
        );
      },
      (err) => {
        this.errorMessage = 'Error loading invoice';
        console.error(this.errorMessage, err);
      }
    );
  }

  // Open the modal with the selected invoice
  openInvoiceModal(invoice: any): void {
    this.selectedInvoice = invoice;  // Assign the selected invoice
    this.isModalOpen = true;  // Open the modal
  }

  // Close the invoice modal
  closeInvoiceModal(): void {
    this.isModalOpen = false;  // Close the modal
    this.selectedInvoice = null;  // Clear the selected invoice
  }

  // View the details of an invoice
  viewInvoice(id: string): void {
    this.router.navigate([`/invoices/${id}`]);  // Navigate to the invoice details
  }

  // Delete an invoice
  deleteInvoice(id: string): void {
    this.invoiceService.deleteInvoice(id).subscribe(
      () => {
        // Filter and remove the deleted invoice from the list
        this.invoices = this.invoices.filter(invoice => invoice._id !== id); 
        this.filterInvoices();  // Re-filter invoices to keep the list updated
      },
      (error) => {
        this.errorMessage = 'Error deleting the invoice';
        console.error(this.errorMessage, error);  // Log error in console
      }
    );
  }
}

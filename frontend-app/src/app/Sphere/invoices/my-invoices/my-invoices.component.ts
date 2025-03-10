import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { JwtService } from '../../auth/jwt.service';

@Component({
  selector: 'app-my-invoices',
  templateUrl: './my-invoices.component.html',
  styleUrls: ['./my-invoices.component.css']
})
export class MyInvoicesComponent implements OnInit {
  invoices: any[] = [];  // Store all invoices
  selectedInvoice: any = null;  // Selected invoice for detailed view
  filteredInvoices: any[] = [];  // Store filtered invoices for pagination
  currentPage: number = 1;  // Current page for pagination
  itemsPerPage: number = 9;  // Number of items per page
  totalInvoices: number = 0;  // Total number of invoices
  totalPages: number = 0;  // Total number of pages for pagination
  sortDirection: string = 'asc';  // Sorting direction, default is ascending

  constructor(
    private invoiceService: InvoiceService,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.LoadInvoices();  // Load invoices when component is initialized
  }

  // Load invoices from the service and handle pagination
  LoadInvoices(): void {
    const userId = this.jwtService.getUserIdFromToken();

    if (userId) {
      this.invoiceService.getUserInvoices(userId).subscribe(
        (data) => {
          // Convert the date field to Date object if it exists
          this.invoices = data.map(invoice => {
            if (invoice.date) {
              invoice.date = new Date(invoice.date.toString());  // Convert to Date
            } else {
              console.warn('Invoice date is missing for invoice code:', invoice.invoiceCode);
              invoice.date = new Date();  // Default to current date if missing
            }
            return invoice;
          });
          this.totalInvoices = data.length;  // Set the total invoices count
          this.totalPages = Math.ceil(this.totalInvoices / this.itemsPerPage);  // Calculate total pages
          this.paginateInvoices();  // Call pagination method to show the relevant invoices
        },
        (error) => {
          console.error('Error loading invoices:', error);  // Log error if loading fails
        }
      );
    } else {
      console.error('User ID not found in token');
    }
  }

  // Paginate invoices based on current page
  paginateInvoices(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredInvoices = this.invoices.slice(startIndex, startIndex + this.itemsPerPage);  // Slice invoices array for current page
  }

  // Change to a different page for pagination
  changePage(page: number): void {
    this.currentPage = page;  // Set the current page
    this.paginateInvoices();  // Re-paginate based on the new page
  }

  // Sort invoices by a specific property (either 'price' or 'date')
  sortInvoicesBy(property: string): void {
    if (this.sortDirection === 'asc') {
      this.filteredInvoices.sort((a, b) => {
        if (a[property] < b[property]) {
          return -1;  // Sort in ascending order
        } else if (a[property] > b[property]) {
          return 1;
        }
        return 0;
      });
      this.sortDirection = 'desc';  // Change sorting direction to descending
    } else {
      this.filteredInvoices.sort((a, b) => {
        if (a[property] > b[property]) {
          return -1;  // Sort in descending order
        } else if (a[property] < b[property]) {
          return 1;
        }
        return 0;
      });
      this.sortDirection = 'asc';  // Change sorting direction to ascending
    }
  }

  // Open the invoice details modal for a selected invoice
  openInvoiceDetails(invoice: any): void {
    this.selectedInvoice = invoice;  // Set the selected invoice for detailed view
  }

  // Close the invoice details modal
  closeInvoiceDetails(): void {
    this.selectedInvoice = null;  // Reset selected invoice
  }
}

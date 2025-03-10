import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/enviroments/enviroment';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}

export interface Invoice {
  _id?: string;
  user_id: string;
  products: Array<{
    productId: string;  
    quantity: number;
  }>;
  total: number;
  date?: Date;
  invoiceCode: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  // Method to generate a new invoice
  generateInvoice(invoiceData: { user_id: string; products: { productId: string; quantity: number }[]; total: number; date: string }): Observable<Invoice> {
    console.log('Generating invoice with data:', invoiceData);
    return this.http.post<Invoice>(this.apiUrl, invoiceData, this.getHeaders()).pipe(
      catchError(this.handleError<Invoice>('generateInvoice'))
    );
  }

  // Get an invoice by ID
  getInvoiceById(invoiceId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${invoiceId}`).pipe(
      catchError(error => {
        console.error('Error fetching invoice:', error);
        throw error;
      })
    );
  }

  // Get all invoices (Admin access)
  getAllInvoices(): Observable<Invoice[]> {
    console.log('Fetching all invoices...');
    return this.http.get<Invoice[]>(this.apiUrl, this.getHeaders()).pipe(
      catchError(this.handleError<Invoice[]>('getAllInvoices'))
    );
  }

  // Get invoices for a specific user
  getUserInvoices(userId: string): Observable<Invoice[]> {
    console.log(`Fetching invoices for user ID: ${userId}`);
    return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`, this.getHeaders()).pipe(
      catchError(this.handleError<Invoice[]>('getUserInvoices'))
    );
  }

  // Get the last invoice of a user
  getLastInvoice(userId: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/last/${userId}`, this.getHeaders()).pipe(
      catchError(this.handleError<Invoice>('getLastInvoice'))
    );
  }

  // Delete an invoice (Admin access)
  deleteInvoice(invoiceId: string): Observable<void> {
    console.log(`Deleting invoice with ID: ${invoiceId}`);
    return this.http.delete<void>(`${this.apiUrl}/${invoiceId}`, this.getHeaders()).pipe(
      catchError(this.handleError<void>('deleteInvoice'))
    );
  }

  // Create invoice data from cart items
  createInvoiceData(cartItems: any[]) {
    const products = cartItems.map(item => {
      if (!item.product || !item.product._id) {
        console.error(`Error: productId missing for product: ${JSON.stringify(item.product)}`);
        return null;
      }

      return {
        productId: item.product._id,
        quantity: item.quantity
      };
    }).filter(item => item !== null);

    if (products.length === 0) {
      console.error('No valid products found');
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    return {
      user_id: 'sub',
      products,
      total,
      date: new Date().toISOString(),
    };
  }

  // Configure authorization headers (JWT)
  private getHeaders() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  // Error handling for HTTP requests
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}

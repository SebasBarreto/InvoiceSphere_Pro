import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product } from '../invoices/invoice.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private apiUrl = `${environment.apiUrl}/products`; // Make sure to configure your API URL correctly

  constructor(private http: HttpClient) {}

  // Get all products
  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Create a new product
  createProduct(product: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, product, this.getAuthHeaders()).pipe(
      catchError(this.handleError('createProduct'))
    );
  }

  // Delete a product
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${productId}`, this.getAuthHeaders()).pipe(
      catchError(this.handleError('deleteProduct'))
    );
  }

  // Method to get a product by its ID
  getProductById(productId: string) {
    return this.http.get<Product>(`/api/products/${productId}`);
  }

  // Update a product
  updateProduct(productId: string, product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${productId}`, product, this.getAuthHeaders()).pipe(
      catchError(this.handleError('updateProduct'))
    );
  }

  // Add authentication headers
  private getAuthHeaders() {
    const token = localStorage.getItem('token');  // Make sure the token is stored correctly
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return { headers };
  }

  // Error handling
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);  // Use 'of' instead of 'Observable.of'
    };
  }
}

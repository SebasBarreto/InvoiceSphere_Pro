import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/enviroments/enviroment';
import { Invoice } from '../invoices/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/invoices`; 

  constructor(private http: HttpClient) {}

  // Get user analytics
  getUserAnalytics(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/analytics`);
  }

  // Get invoices for a specific user
  getUserInvoices(userId: string): Observable<Invoice[]> {
    console.log(`Fetching invoices for user ID: ${userId}`);
    return this.http.get<Invoice[]>(`${this.apiUrl}/user/${userId}`).pipe(
      catchError(this.handleError<Invoice[]>('getUserInvoices', [])) // Error handling
    );
  }

  // Error handling function
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T); // Return empty result in case of error
    };
  }
}

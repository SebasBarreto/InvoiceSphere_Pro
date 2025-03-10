import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/enviroments/enviroment';
import { JwtService } from '../auth/jwt.service';

// Define the User interface (adjust fields according to your model)
export interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  admin: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // API endpoint for users

  constructor(
    private http: HttpClient,
    private jwtService: JwtService  // Ensure the JWT service is injected
  ) {}

  /**
   * Fetch all users from the backend.
   * Logs the action and handles errors.
   */
  getAllUsers(): Observable<User[]> {
    this.log('Fetching all users');
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Handle errors from the HTTP request
    );
  }

  /**
   * Fetch a user by their ID.
   * @param id The user's ID
   * Logs the action and handles errors.
   */
  getUserById(id: string): Observable<User> {
    this.log(`Fetching user with id: ${id}`);
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Handle errors from the HTTP request
    );
  }

  /**
   * Fetch the current user's profile using the ID from the JWT token.
   * Logs the action and handles errors.
   */
  getUserProfile(): Observable<User> {
    const userId = this.jwtService.getUserIdFromToken(); // Use the JwtService to get the ID
    
    if (!userId) {
      this.log('No token found in localStorage or token is invalid', 'warn');
      return throwError('Token not found or invalid'); // Error if no token is found or invalid
    }
    
    this.log(`Fetching profile for user ID: ${userId}`);
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      catchError(this.handleError) // Handle errors from the HTTP request
    );
  }

  /**
   * Update the user profile.
   * @param id User ID to update
   * @param userData The data to update
   * Logs the action and handles errors.
   */
  updateUserProfile(id: string, userData: User): Observable<User> {
    const headers = this.getAuthHeaders(); // Get headers with token
    this.log(`Updating user profile for MongoDB ID: ${id}`);
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData, { headers }).pipe(
      catchError(this.handleError) // Handle errors from the HTTP request
    );
  }

  /**
   * Delete a user.
   * @param id User ID to delete
   * Logs the action and handles errors.
   */
  deleteUser(id: string): Observable<any> {
    this.log(`Deleting user with ID: ${id}`);
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Handle errors from the HTTP request
    );
  }

  /**
   * Get the authentication headers with the JWT token.
   * @returns HttpHeaders with Authorization header
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.log('Token not found in localStorage', 'error');
      throw new Error('Token not found');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}` // Set JWT token in the header
    });
  }

  /**
   * Logs actions for debugging or monitoring.
   * @param message The message to log
   * @param level The log level (default is "info")
   */
  private log(message: string, level: string = 'info'): void {
    switch (level) {
      case 'warn':
        console.warn(`[UserService] ${message}`);
        break;
      case 'error':
        console.error(`[UserService] ${message}`);
        break;
      default:
        console.log(`[UserService] ${message}`);
        break;
    }
  }

  /**
   * Handles errors from HTTP requests.
   * @param error The error received from the HTTP request
   * Logs and returns a user-friendly error message.
   */
  private handleError(error: any): Observable<never> {
    this.log('An error occurred: ' + (error.message || error), 'error');
    return throwError(error.message || 'Server error'); // Return a user-friendly error message
  }
}

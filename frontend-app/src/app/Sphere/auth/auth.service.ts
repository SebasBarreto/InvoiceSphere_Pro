import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/enviroment';
import { jwtDecode } from 'jwt-decode'; // Make sure 'jwt-decode' is installed

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Log in with email and password
  login(email: string, password: string): Observable<any> {
    console.log(`Attempting to log in with email: ${email}`);
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  // Register a new user
  register(name: string, email: string, password: string): Observable<any> {
    console.log(`Registering new user with email: ${email}`);
    return this.http.post(`${this.apiUrl}/auth/register`, { name, email, password });
  }

  // Get the user ID from localStorage
  getUserId(): string {
    const userId = localStorage.getItem('userId') || '';
    console.log(`User ID obtained: ${userId}`);
    return userId;
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('role') === 'admin';
    console.log(`Is admin? ${isAdmin}`);
    return isAdmin;
  }

  // Check if the user is a regular user
  isUser(): boolean {
    const isUser = localStorage.getItem('role') === 'user';
    console.log(`Is user? ${isUser}`);
    return isUser;
  }

  // Save the JWT token in localStorage
  saveToken(token: string): void {
    console.log(`Saving token in localStorage`);
    localStorage.setItem('auth_token', token);
  }

  // Retrieve the JWT token from localStorage
  getToken(): string | null {
    const token = localStorage.getItem('auth_token');
    console.log(`Token obtained: ${token}`);
    return token;
  }

  // Remove the JWT token from localStorage (log out)
  logout(): void {
    console.log(`Removing token and logging out`);
    localStorage.removeItem('auth_token');
  }

  // Check if the user is authenticated (if there is a token)
  isAuthenticated(): boolean {
    const authenticated = !!this.getToken();
    console.log(`Is authenticated? ${authenticated}`);
    return authenticated;
  }

  // Get the user's role by decoding the JWT token
  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.role || null;
      console.log(`Decoded role from token: ${role}`);
      return role;
    }
    console.log(`Could not retrieve role from token`);
    return null;
  }

  // Check if the user has the expected role (used for specific roles like admin)
  hasRole(expectedRole: string): boolean {
    const userRole = this.getRole();
    const hasExpectedRole = userRole === expectedRole;
    console.log(`Does the user have the expected role (${expectedRole})? ${hasExpectedRole}`);
    return hasExpectedRole;
  }
}

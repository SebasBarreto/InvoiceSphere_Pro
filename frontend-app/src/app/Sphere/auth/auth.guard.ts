import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.authService.isAuthenticated();
    console.log(`Is authenticated? ${isAuthenticated}`);

    if (isAuthenticated) {
      return true;
    } else {
      console.log('Redirecting to login page, user not authenticated');
      this.router.navigate(['/login']);  // Redirect if not authenticated
      return false;
    }
  }
}

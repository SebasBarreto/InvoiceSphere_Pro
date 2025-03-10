import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = next.data['expectedRole'];  // Get the expected role from route data
    const userRole = this.authService.getRole();    // Get the user's current role

    console.log(`Expected role: ${expectedRole}, User role: ${userRole}`);

    if (userRole === expectedRole) {
      return true;  // Allow navigation if the role matches
    } else {
      console.log('User role does not match expected role. Redirecting to login...');
      this.router.navigate(['/login']);  // Redirect to login if roles don't match
      return false;
    }
  }
}

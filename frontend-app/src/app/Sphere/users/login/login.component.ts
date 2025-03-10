import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        // Guarda el token en localStorage
        this.authService.saveToken(response.access_token);  // Accede a 'access_token' en vez de 'token'
        
        // Redirige a la página de product-list
        this.router.navigate(['/product-list']);
      },
      (error: any) => {
        // Manejo del error
        this.errorMessage = 'Invalid email or password. Please try again.';
      }
    );
  }
}

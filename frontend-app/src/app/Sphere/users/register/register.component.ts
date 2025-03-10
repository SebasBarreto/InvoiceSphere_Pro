import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = { name: '', email: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(
      this.registerData.name,
      this.registerData.email,
      this.registerData.password
    ).subscribe(
      (response: any) => {
        // You can save the token if desired:
        // this.authService.saveToken(response.token);
        // Or redirect to the login page:
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Registration error:', error);
      }
    );
  }
}

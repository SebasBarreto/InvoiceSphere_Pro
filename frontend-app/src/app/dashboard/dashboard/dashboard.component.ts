import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from 'src/app/Sphere/users/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = '';  // To store the user's role

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Get the user profile from the service
    this.userService.getUserProfile().subscribe(
      (user: User) => {
        this.userName = user.name;
        this.userRole = user.role || '';  // Default to '' if 'role' is undefined
      },
      (error: any) => {
        console.error('Error fetching user profile', error);
        this.router.navigate(['/login']);
      }
    );
  }

  // Logout method
  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    return this.userRole === 'admin';  // Check if the user role is 'admin'
  }
}

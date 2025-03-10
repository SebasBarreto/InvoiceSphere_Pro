import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  userToEdit: User | null = null;
  searchTerm: string = ''; // Search term
  searchCategory: string = 'id'; // Filter by id, name, or email
  roleFilter: string = 'all';    // Filter by role (admin or user)

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  /**
   * Fetch all users from the service.
   */
  getUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        this.filteredUsers = users; // Initialize filteredUsers with all users
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  /**
   * Apply filters for ID, email, name, and role.
   */
  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      let matchesSearchTerm = false;

      // Filter by ID, name, or email based on the selected option
      if (this.searchCategory === 'id') {
        matchesSearchTerm = user._id.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchCategory === 'name') {
        matchesSearchTerm = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      } else if (this.searchCategory === 'email') {
        matchesSearchTerm = user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      }

      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;

      return matchesSearchTerm && matchesRole;
    });
  }

  /**
   * Start editing a user.
   * @param user User to edit
   */
  startEditing(user: User): void {
    this.userToEdit = { ...user }; // Clone the user to preserve the original data for canceling
  }

  /**
   * Save the updated user profile.
   */
  saveEdit(): void {
    if (this.userToEdit) {
      this.userService.updateUserProfile(this.userToEdit._id, this.userToEdit).subscribe(
        (updatedUser) => {
          console.log('User updated successfully:', updatedUser);
          this.userToEdit = null; // Close the overlay
          this.getUsers(); // Refresh the user list
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  /**
   * Cancel editing and close the overlay.
   */
  cancelEditing(): void {
    this.userToEdit = null; // Close the overlay
  }

  /**
   * Delete the user.
   * @param userId The user's ID to delete
   */
  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          console.log('User deleted successfully');
          this.getUsers(); // Refresh the user list
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}

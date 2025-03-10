import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './users-profile.component.html',
  styleUrls: ['./users-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;

  constructor(private fb: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // Password validation
    });

    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.user = data;
        console.log('Fetched User:', this.user);  // Añade esto para depurar
        this.profileForm.patchValue(this.user); // Populate form with user data
      },
      error: err => {
        console.error('Error fetching user profile:', err);
        alert('Error fetching user profile');
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const updatedUser: User = {
        ...this.user,  // Retain current user data
        ...this.profileForm.value  // Overwrite with form data
      };
      this.saveEdit(updatedUser);
    } else {
      alert('Invalid form, please check the fields');
      console.warn('Form is invalid:', this.profileForm.errors);
    }
  }

  saveEdit(updatedUser: User): void {
    if (this.profileForm.valid) {
      // Verifica que el _id no sea undefined antes de proceder
      if (this.user._id) {  // Cambia user.id por user._id
        console.log('User ID:', this.user._id);  // Añadir esto para depurar
        this.userService.updateUserProfile(this.user._id, this.profileForm.value).subscribe({
          next: (response) => {
            console.log('User updated successfully:', response);
            alert('User updated successfully');
          },
          error: (err: any) => {
            console.error('Error updating user:', err);
            alert('Error updating user');
          }
        });
      } else {
        console.error('User ID is undefined, cannot update.');
        alert('User ID is undefined, cannot update.');
      }
    } else {
      console.warn('Form validation failed on submit');
    }
  }
  
}

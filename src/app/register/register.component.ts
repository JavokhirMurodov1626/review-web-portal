import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthResponse, AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('f') registerForm!: NgForm;
  userFullname: string = '';
  userEmail: string = '';
  userPassword: string = '';
  isLoading: boolean = false;

  constructor(
    private authservice: AuthService,
    private toastr: ToastrService,
    private router:Router
  ) {}

  onSubmit() {
    if (!this.registerForm.valid) {
      return;
    }
    this.isLoading = true;
    this.authservice
      .register(this.userFullname, this.userEmail, this.userPassword)
      .subscribe({
        next: (response: AuthResponse) => {
          this.toastr.success(response.message);
          this.isLoading = false;
          this.router.navigate(['/login'])
        },
        error: (error: string) => {
          this.toastr.error(error);
          this.isLoading = false;
        },
      });
    this.registerForm.reset();
  }
}

import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userEmail: string = '';
  userPassword: string = '';
  isLoading = false;
  @ViewChild('f') loginForm!: NgForm;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private http: HttpClient,

  ) {}

  onSubmit() {
    this.isLoading = true;
    if (!this.loginForm.valid) return;
    this.authService.login(this.userEmail, this.userPassword).subscribe({
      next: (response) => {
        console.log(response);
        this.isLoading = false;
        this.toastr.success(response.message);
        this.loginForm.reset();
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.log(error);
        this.toastr.error(error);
        this.isLoading = false;
      },
    });
  }

  loginGoogle() {
   this.authService.loginWithGoogle().subscribe({
    next:res=>{
      console.log(res)
    },
    error:err=>{
      console.log(err);
    }
   })
  }
}

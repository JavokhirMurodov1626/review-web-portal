import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userEmail: string = '';
  userPassword: string = '';
  @ViewChild('f') loginForm!:NgForm

  constructor() {}

  onSubmit() {
    const userData={
      email:this.userEmail,
      password:this.userPassword
    }
    console.log(userData)
  }
}

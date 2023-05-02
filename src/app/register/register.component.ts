import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  @ViewChild('f') registerForm!:NgForm
  userFullname: string = '';
  userEmail: string = '';
  userPassword: string = '';

  constructor() {}

  onSubmit() {
    const userData={
      fullname:this.userFullname,
      email:this.userEmail,
      password:this.userPassword
    }

    console.log(userData)
  }
}

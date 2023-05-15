import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.scss'],
})
export class AuthSuccessComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const user = JSON.parse(urlParams.get('user') as string);

    this.authService.user.next(user);

    this.router.navigate(['/']);
  }
}

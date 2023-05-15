import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user.model';

@Component({
  selector: 'app-auth-success',
  templateUrl: './auth-success.component.html',
  styleUrls: ['./auth-success.component.scss'],
})
export class AuthSuccessComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);

    const fetcheduser = JSON.parse(urlParams.get('user') as string);

    const expirationDate = new Date(new Date().getTime() + fetcheduser.expiresIn * 1000);

    let user = new User(fetcheduser.userId, fetcheduser.name, fetcheduser.image, fetcheduser.token, expirationDate);

    this.authService.user.next(user);

    this.authService.autoLogOut(fetcheduser.expiresIn * 1000);

    localStorage.setItem('userData', JSON.stringify(user));
 
    this.router.navigate(['/']);
  }
}

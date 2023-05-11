import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  userImage!: string | undefined | null;
  userId!: number | undefined;
  userSub: Subscription = new Subscription();
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userImage = user?.image;
      this.userId = user?.id;
    });
  }

  getUserProfile(){
    this.router.navigate([`/users/${this.userId}/account`])
  }

  logout() {
    this.authService.logout();
    this.toastr.info('You have logged out!');
  }
}

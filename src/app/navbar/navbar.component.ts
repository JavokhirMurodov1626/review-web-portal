import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ReviewService } from '../services/review.service';
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
  searchQuery: string = '';
  searchedReviews!:{id:number,title:string}[]

  @ViewChild('f') searchForm!: NgForm;

  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.userImage = user?.image;
      this.userId = user?.id;
    });
  }

  getUserProfile() {
    this.router.navigate([`/users/${this.userId}/account`]);
  }

  logout() {
    this.authService.logout();
    this.toastr.info('You have logged out!');
  }

  onSubmit() {
    this.reviewService.searchReview(this.searchQuery).subscribe({
      next: (res) => {
        this.searchedReviews=res.reviews;
        console.log(this.searchedReviews)
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  directToReview(id:number){
    this.router.navigate([`/reviews/${id}`])
  }
}

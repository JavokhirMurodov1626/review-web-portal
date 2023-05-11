import { Component, OnInit } from '@angular/core';
import { AccountService, UserReview } from '../services/account.service';
import { Router } from '@angular/router';
import {  ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  isLoading = false;

  userReviews!: UserReview[];

  constructor(private accountService: AccountService, private router: Router,private toastr:ToastrService) {}

  ngOnInit() {
    this.isLoading = true;

    this.accountService.getUserReviews().subscribe({
      next: (res) => {
        this.userReviews = this.calculateAvg(res.reviews);

        this.isLoading = false;
      },

      error: (error) => {
        console.log(error);
        this.isLoading = false;
      },
    });
  }

  calculateAvg(reviews: UserReview[]) {
    return reviews.map((review) => {
      const sumRateValues = review.rating.reduce((sum, rate) => {
        return (sum += rate.value);
      }, 0);

      const avgRate = Math.round(sumRateValues / review._count.rating);

      review.avgRating = avgRate;

      return review;
    });
  }

  showReview(id: number) {
    this.router.navigate([`/reviews/${id}`]);
  }

  deleteReview(index: number, reviewId: number) {
    //delete from UI first
    const deletedReview:UserReview[] = this.userReviews.splice(index, 1);

    //delete from database second
    this.accountService.deleteReview(reviewId).subscribe({

      next: (res) => {
        console.log(res);
        this.toastr.warning('You have deleted one of your reviews!')
      },

      error: (error) => {
        console.log(error);
        this.toastr.error(error);
        this.userReviews.splice(index,0,deletedReview[0])
      },

    });
  }
  
}


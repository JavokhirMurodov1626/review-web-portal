import { Component, OnInit } from '@angular/core';
import { ReviewCard } from './reviewCard.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReviewService } from '../services/review.service';
@Component({ 
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  lastReviews: ReviewCard[] = [];
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.reviewService.getLastReviews().subscribe({
      next: (res) => {
        this.lastReviews = res.reviews;
        this.isLoading = false;
        console.log(res);
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }

  onCreateReview() {
    this.router.navigate(['/create-review']);
  }

  showToast() {
    this.toastr.success('this is my first working toast');
  }
}

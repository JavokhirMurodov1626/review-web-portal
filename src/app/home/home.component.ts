import { ReviewCard } from './reviewCard.model';
import { Component, OnInit } from '@angular/core';
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
  higherGradeReviews!: ReviewCard[];
  tags!: string[];

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.reviewService.getLastReviews().subscribe({
      next: (res) => {
        this.lastReviews = res.lastReviews;
        
        this.higherGradeReviews = res.higherGradeReviews;

        //getting tags of higherGrade Reviews (I have no choice :( )
        let tags = this.higherGradeReviews.map((review) => {
          const tagString = review.tags.map((tag) => tag.name);
          return tagString;
        });

        this.tags = tags.flat();

        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
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

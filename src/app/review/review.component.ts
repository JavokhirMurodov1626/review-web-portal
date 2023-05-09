import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../services/review.service';
import { Review } from '../services/review.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  stars: number[] = [1, 2, 3, 4, 5];
  selectedStarValue: number = 0;
  isLiked: boolean = false;
  reviewId!: number;
  review!: Review;
  formattedDate!: string;
  isLoading = false;
  reviewRichTextContent!:SafeHtml

  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private domsanitizer:DomSanitizer
  ) {}

  ngOnInit() {

    this.route.paramMap.subscribe((params) => {
      if (params) {
        let paramId = params.get('id');
        this.reviewId = paramId ? +paramId : 0;
      }
    });

    this.isLoading = true;

    this.reviewService.getSelectedReview(this.reviewId).subscribe({
      next: (res) => {
        if (res.review) {
          this.formattedDate = new Date(
            res.review.createdAt
          ).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year:
              new Date(res.review.createdAt).getFullYear() !==
              new Date().getFullYear()
                ? 'numeric'
                : undefined,
          });

          this.review = res.review;
          
          this.reviewRichTextContent=this.domsanitizer.bypassSecurityTrustHtml(res.review.content)
        }
        this.isLoading = false;
        console.log(res);
      },
      error: (error) => {
        this.toastr.error(error);
        this.isLoading = false;
      },
    });
  }

  countStar(star: number) {
    this.selectedStarValue = star;
  }

  addStarClass(star: number) {
    let ab = '';
    for (let i = 0; i < star; i++) {
      ab = 'starId' + i;
      let element = document.getElementById(ab) as HTMLElement;
      element.classList.add('selected');
    }
  }

  removeStarClass(star: number) {
    let ab = '';
    for (let i = star - 1; i >= this.selectedStarValue; i--) {
      ab = 'starId' + i;
      let element = document.getElementById(ab) as HTMLElement;
      element.classList.remove('selected');
    }
  }

  likeReview() {
    this.isLiked = this.isLiked ? false : true;
    console.log(this.isLiked);
  }
}
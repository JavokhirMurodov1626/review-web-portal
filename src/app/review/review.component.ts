import { AuthService } from './../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommentData, ReviewService } from '../services/review.service';
import { Review } from '../services/review.model';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  stars: number[] = [1, 2, 3, 4, 5];
  selectedStarValue: number = 0;
  isLiked: boolean = false;
  reviewId!: number;
  review!: Review;
  formattedDate!: string;
  isLoading = false;
  reviewRichTextContent!: SafeHtml;
  reviewComment!: string;
  commentList: CommentData[] = [];
  currentUser!: {
    authorId?: number;
    name: string;
    image: string | null;
    reviewId?: number;
  };
  currentUserSubscription!: Subscription;

  constructor(
    private reviewService: ReviewService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private domsanitizer: DomSanitizer,
    private authService: AuthService
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

          this.reviewRichTextContent =
            this.domsanitizer.bypassSecurityTrustHtml(res.review.content);
        }
        this.isLoading = false;
        console.log(res);
      },
      error: (error) => {
        this.toastr.error(error);
        this.isLoading = false;
      },
    });

    this.currentUserSubscription = this.authService.user.subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = {
            authorId: user.id,
            name: user.name,
            image: user.image || 'assets/images/default-profile-img.jpg',
          };
        }
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

  getTimeAgo(timestamp: number): string {
    const now = new Date().getTime();

    const seconds = Math.floor((now - timestamp) / 1000);
    if (seconds === 0) return `just now`;

    if (seconds < 60) {
      return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }

    const days = Math.floor(hours / 24);
    return days === 1 ? '1 day ago' : `${days} days ago`;
  }

  sendComment() {
    const timeAgo = this.getTimeAgo(new Date().getTime());

    let commentData = {
      text: this.reviewComment,
      rate: this.selectedStarValue,
      createdTimeAgo: timeAgo,
      authorId: this.currentUser.authorId,
      reviewId: this.reviewId,
    };

    if (this.currentUser && this.reviewComment) {
      this.commentList.push(commentData);
      this.selectedStarValue = 0;
      this.reviewComment = '';

      console.log(commentData);

      //sending commentDate
      this.reviewService.sendComment(commentData).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (error) => {
          console.log(error);
        },
      });

    } else {
      if (!this.currentUser) this.toastr.warning('Please login first!');
      else if (!this.reviewComment)
        this.toastr.warning('Please write something in comment!');
    }
  }

  ngOnDestroy(): void {
    this.currentUserSubscription.unsubscribe();
  }
}

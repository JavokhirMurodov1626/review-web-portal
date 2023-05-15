import { AuthService } from './../services/auth.service';
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
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
export class ReviewComponent implements OnInit, OnDestroy, AfterViewChecked {
  stars: number[] = [1, 2, 3, 4, 5];
  reviewRate!: number;
  isLiked: boolean = false;
  likes!: number;
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

    // feting selected Review and assigning variables
    this.reviewService.getSelectedReview(this.reviewId).subscribe({
      next: (res) => {
        this.formattedDate = new Date(res.review.createdAt).toLocaleDateString(
          'en-US',
          {
            month: 'short',
            day: 'numeric',
            year:
              new Date(res.review.createdAt).getFullYear() !==
              new Date().getFullYear()
                ? 'numeric'
                : undefined,
          }
        );

        this.review = res.review;

        this.reviewRichTextContent = this.domsanitizer.bypassSecurityTrustHtml(
          res.review.content
        );

        this.commentList = res.review.comments;

        //checking if the review is likes by current user
        if (this.currentUser) {
          const like = this.review.likes.find((like) => {
            return (
              like.authorId == this.currentUser.authorId &&
              like.reviewId == this.review.id
            );
          });

          if (like) this.isLiked = true;

          //getting current user's rate to the review
          const rate = this.review.rating.find((rating) => {
            return (
              rating.authorId == this.currentUser.authorId &&
              rating.reviewId == this.review.id
            );
          });

          if (rate) this.reviewRate = rate.value;
        }

        //assigning the number of likes
        this.likes = res.review.likes.length;

        this.isLoading = false;
      },
      error: (error) => {
        this.toastr.error(error);
        this.isLoading = false;
      },
    });

    //getting current user
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

  ngAfterViewChecked() {
    this.addStarClass(this.reviewRate - 1);
  }

  addStarClass(star: number) {
    let starId = '';

    if(this.currentUser){
      for (let i = 0; i < star + 1; i++) {
        starId = 'starId' + i;
        let element = document.getElementById(starId) as HTMLElement;
        element.classList.add('selected');
      }
  
      for (let i = star + 1; i <= 4; i++) {
        starId = 'starId' + i;
        let element = document.getElementById(starId) as HTMLElement;
        element.classList.remove('selected');
      }
      // assigning user rate
      this.reviewRate = star + 1;
    }
   
  }
  // making rating star
  rateReview(star: number) {
    this.addStarClass(star);

    //assigning rating data
    if (this.currentUser) {
      const ratingData = {
        value: this.reviewRate,
        authorId: this.currentUser.authorId,
        reviewId: this.review.id,
      };

      // //sending rating data
      this.reviewService.sendRating(ratingData).subscribe({
        next: (res) => {
          this.toastr.info('Thank you for rating the review :)');
        },
        error: (error) => {
          this.toastr.error(error);
        },
      });
    } else {
      this.toastr.warning('Please login first');
    }
  }

  likeReview() {
    if (this.currentUser) {
      const data = {
        authorId: this.currentUser.authorId,
        reviewId: this.review.id,
      };

      this.isLiked = this.isLiked ? false : true;

      if (this.isLiked) {
        this.likes++;
        this.reviewService.likeReview(data).subscribe({
          next: (res) => this.toastr.info(res.message),
          error: (error) => {
            this.likes--;
            this.toastr.error(error);
          },
        });
      } else {
        this.likes--;
        this.reviewService.unlikeReview(data).subscribe({
          next: (res) => this.toastr.info(res.message),
          error: (error) => {
            this.likes++;
            this.toastr.error(error);
          },
        });
      }
    } else {
      this.toastr.warning('Please login first!');
    }
  }

  getTimeAgo(time: string): string {
    const now = new Date().getTime();

    const timestamp = new Date(time).getTime();

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
    // const timeAgo = this.getTimeAgo(new Date().getTime().toString());

    if (this.currentUser && this.reviewComment) {
      let commentData = {
        content: this.reviewComment,
        createdAt: new Date().toString(),
        authorId: this.currentUser.authorId,
        reviewId: this.reviewId,
        author: {
          name: this.currentUser.name,
          image: this.currentUser.image,
        },
      };

      this.commentList.push(commentData);

      //sending commentDate
      this.reviewService.sendComment(commentData).subscribe({
        next: (res) => {
          this.reviewComment = '';
        },
        error: (error) => {
          this.toastr.error(error);
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

import { Component, OnInit } from '@angular/core';
import { AccountService, UserReview } from '../services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../services/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  isLoading = false;
  userReviews!: UserReview[];
  filteredReviews: UserReview[] = [];

  options = [
    { name: 'book', selected: false },
    { name: 'movie', selected: false },
    { name: 'game', selected: false },
  ];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.accountService.getUserReviews().subscribe({
      next: (res) => {
        this.userReviews = this.calculateAvg(res.reviews);

        this.filteredReviews = this.userReviews.sort(this.sortByTitle);

        this.isLoading = false;
      },

      error: (error) => {
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

      review.avgRating = avgRate || 0;

      return review;
    });
  }

  showReview(id: number) {
    this.router.navigate([`/reviews/${id}`]);
  }

  deleteReview(index: number, reviewId: number) {
    //delete from UI first
    const deletedReview: UserReview[] = this.userReviews.splice(index, 1);

    //delete from database second
    this.accountService.deleteReview(reviewId).subscribe({
      next: (res) => {
        this.toastr.warning('You have deleted one of your reviews!');
      },

      error: (error) => {
        this.toastr.error(error);
        this.userReviews.splice(index, 0, deletedReview[0]);
      },
    });
  }

  editReview(reviewId: number) {
    this.router.navigate([`reviews/${reviewId}/edit`], {
      relativeTo: this.route,
    });
  }

  sortByTitle = (a: UserReview, b: UserReview) => {
    const nameA = a.title.toLowerCase();
    const nameB = b.title.toLowerCase();

    // Remove quotes from the product names for comparison
    const nameAWithoutQuotes = nameA.replace(/['"]+/g, '');
    const nameBWithoutQuotes = nameB.replace(/['"]+/g, '');

    if (nameAWithoutQuotes < nameBWithoutQuotes) {
      return -1;
    }
    if (nameAWithoutQuotes > nameBWithoutQuotes) {
      return 1;
    }
    return 0;
  };

  sortByLikesDescending = (a: UserReview, b: UserReview) => {
    return b._count.likes - a._count.likes;
  };

  sortByAvgRatingDescending = (a: UserReview, b: UserReview) => {
    if (a.avgRating && b.avgRating) {
      return b.avgRating - a.avgRating;
    }

    return 0;
  };

  applyFilter() {
    const filteredItems = this.userReviews.filter((item) => {
      return this.options.some(
        (option) => option.selected && option.name === item.group
      );
    });

    //if any of options is not checked return default filtered reviews
    if ((filteredItems.length == 0)) {
      this.filteredReviews = this.userReviews.sort(this.sortByTitle);
    } else {
      this.filteredReviews = filteredItems;
    }
  }

  handleSortReviews(event: Event) {
    const target = event.target as HTMLSelectElement;

    if (target.value == 'byLikes') {
      this.filteredReviews = this.filteredReviews.sort(
        this.sortByLikesDescending
      );
    } else if (target.value == 'byRating') {
      this.filteredReviews = this.filteredReviews.sort(
        this.sortByAvgRatingDescending
      );
    } else if (target.value == 'byTitle') {
      this.filteredReviews = this.filteredReviews.sort(this.sortByTitle);
    }
  }
}

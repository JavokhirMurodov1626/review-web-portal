import { Component, Input, OnInit } from '@angular/core';
import { ReviewCard } from '../reviewCard.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent implements OnInit {
  @Input() bindedReview!: ReviewCard;

  review: any;
  formattedDate: any;
  rating!: number;
  ratings!: number;

  ngOnInit(): void {
    this.formattedDate = new Date(
      this.bindedReview.createdAt
    ).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        new Date(this.bindedReview.createdAt).getFullYear() !==
        new Date().getFullYear()
          ? 'numeric'
          : undefined,
    });

    const ratings = this.bindedReview.rating.filter(
      (rating) => rating.value != 0
    ).length;

    const sumRating = this.bindedReview.rating.reduce((sum, rating) => {
      return (sum += rating.value);
    }, 0);

    this.rating = sumRating / ratings;

    this.ratings = ratings;

    this.review = {
      id: this.bindedReview.id,
      title: this.bindedReview.title,
      description: this.bindedReview.description,
      author: {
        name: this.bindedReview.author.name,
        image:
          this.bindedReview.author.image ||
          'assets/images/default-profile-img.jpg',
      },
      group: this.bindedReview.group,
      product: this.bindedReview.product.name,
      tags: this.bindedReview.tags.map((tag) => tag.name),
      image: this.bindedReview.images[0]?.imageUrl,
      createdAt: this.formattedDate,
    };
  }
}

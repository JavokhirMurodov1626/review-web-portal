import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { ReviewCard } from '../reviewCard.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent implements OnInit{
  @Input() bindedReview!: ReviewCard;
  
  
  review:any
  formattedDate:any

  ngOnInit(): void {
    this.formattedDate = new Date(this.bindedReview.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: new Date(this.bindedReview.createdAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  
    this.review={
      id:this.bindedReview.id,
      title:this.bindedReview.title,
      description:this.bindedReview.description,
      author:{
        name:this.bindedReview.author.name,
        image:this.bindedReview.author.image || 'assets/images/default-profile-img.jpg'
      },
      group:this.bindedReview.group,
      product:this.bindedReview.product.name,
      tags:this.bindedReview.tags.map(tag=>tag.name),
      image:this.bindedReview.images[0],
      createdAt:this.formattedDate
    }
  }
}

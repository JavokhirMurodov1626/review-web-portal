import { Component, Input, OnInit } from '@angular/core';
import { ReviewCard } from '../reviewCard.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent implements OnInit{
  @Input() review!: ReviewCard;
  
  ngOnInit(): void {
      
  }
}

import { Component, OnInit } from '@angular/core';
import { ReviewCard } from './reviewCard.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router,private toastr: ToastrService) {}
  ngOnInit(): void {
    
  }
  reviews: ReviewCard[] = [
    {
      id: 1,
      productGroup: 'Book',
      reviewTitle: 'Angular Interview Questions',
      productName: 'Deep Work',
      reviewContent: `First of all best of luck with your interview. hope this article will be helpful. What is the design pattern of the
       angular framework? The angular framework used Single Page Application design pattern. What...`,
      tags: ['Angular', 'Javascript', 'Rxjs'],
      image: 'assets/images/review-pic.webp',
      createdAt: 'Feb 9',
    },
    {
      id: 2,
      productGroup: 'Book',
      reviewTitle: 'Angular Interview Questions',
      productName: 'Deep Work',
      reviewContent: `First of all best of luck with your interview. hope this article will be helpful. What is the design pattern of the
       angular framework? The angular framework used Single Page Application design pattern. What...`,
      tags: ['Angular', 'Javascript', 'Rxjs'],
      image: 'assets/images/review-pic.webp',
      createdAt: 'Feb 9',
    },
    {
      id: 3,
      productGroup: 'Book',
      reviewTitle: 'Angular Interview Questions',
      productName: 'Deep Work',
      reviewContent: `First of all best of luck with your interview. hope this article will be helpful. What is the design pattern of the
       angular framework? The angular framework used Single Page Application design pattern. What...`,
      tags: ['Angular', 'Javascript', 'Rxjs'],
      image: 'assets/images/review-pic.webp',
      createdAt: 'Feb 9',
    },
  ];

  onCreateReview() {
    this.router.navigate(['/create-review']);
  }

  showToast(){
    this.toastr.success('this is my first working toast')
  }
} 

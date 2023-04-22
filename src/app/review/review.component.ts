import { Component } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent {
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;
  isLiked:boolean=false;
  countStar(star: number) {
    this.selectedValue = star;
  }

  addClass(star: number) {
    let ab = '';
    for (let i = 0; i < star; i++) {
      ab = 'starId' + i;
      let element = document.getElementById(ab) as HTMLElement;
      element.classList.add('selected');
    }
  }
  removeClass(star: number) {
    let ab = '';
    for (let i = star - 1; i >= this.selectedValue; i--) {
      ab = 'starId' + i;
      let element = document.getElementById(ab) as HTMLElement;
      element.classList.remove('selected');
    }
  }
  likeReview(){
    this.isLiked=this.isLiked?false:true;
    console.log(this.isLiked);
  }
}

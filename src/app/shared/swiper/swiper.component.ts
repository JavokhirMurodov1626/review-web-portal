import { Component } from '@angular/core';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper } from 'swiper';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
})
export class SwiperComponent {
  
  onSwiper([swiper]: [Swiper]) {
    console.log(swiper);
  }

  onSlideChange() {
    console.log('slide change');
  }
  
}

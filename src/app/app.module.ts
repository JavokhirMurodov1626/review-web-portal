import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { ReviewComponent } from './review/review.component';
import { SwiperModule } from 'swiper/angular';
import { SwiperComponent } from './shared/swiper/swiper.component';
import { AccountComponent } from './account/account.component';
import { CreateReviewComponent } from './create-review/create-review.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    ReviewComponent,
    SwiperComponent,
    AccountComponent,
    CreateReviewComponent
  ],
  imports: [BrowserModule, AppRoutingModule,SwiperModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './login/login.component';
import { ReviewComponent } from './review/review.component';
import { SwiperModule } from 'swiper/angular';
import { SwiperComponent } from './shared/swiper/swiper.component';
import { AccountComponent } from './account/account.component';
import { CreateReviewComponent } from './create-review/create-review.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDirective } from './create-review/drag.directive';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ReviewCardComponent } from './home/review-card/review-card.component';
import { LoaderComponent } from './loader/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './register/register.component';
import { RatingStarComponent } from './shared/rating-star/rating-star.component';
import { EditReviewComponent } from './edit-review/edit-review.component';
import { TagCloud } from './tag-cloud/tag-cloud.component';
import { TagCloudComponent } from 'angular-tag-cloud-module';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    ReviewComponent,
    SwiperComponent,
    AccountComponent,
    CreateReviewComponent,
    DragDirective,
    ReviewCardComponent,
    LoaderComponent,
    RegisterComponent,
    RatingStarComponent,
    EditReviewComponent,
    TagCloud
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SwiperModule,
    BrowserAnimationsModule,
    FormsModule,
    CKEditorModule,
    ToastrModule.forRoot({
      progressBar:true,
      progressAnimation:'increasing'
    }),
    TagCloudComponent
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

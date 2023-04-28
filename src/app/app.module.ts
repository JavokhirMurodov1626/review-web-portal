import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    BrowserAnimationsModule,
    FormsModule,
    CKEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

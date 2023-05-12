import { Author } from './../home/reviewCard.model';
import { API_URL } from './../../environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { take, exhaustMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Review } from './review.model';
import { ReviewCardResponse } from '../home/reviewCard.model';

export interface generatedReview {
  reviewId?:number,
  authorId: number;
  title: string;
  productName: string;
  productGroup: string;
  productGrade: number;
  description: string;
  images?: string[];
  content: string;
  tags: string[];
  previousImages?:{filename:string,imageUrl:string,generation:string}[]
}

export interface ReviewResponse {
  message: string;
  review: Review;
}

export interface CommentData {
  id?: number;
  content: string;
  authorId?: number;
  reviewId?: number;
  createdAt:string,
  author?:{
    name:string,
    image:string | null
  }
}

interface RatingData {
  id?: number;
  value: number;
  authorId: number | undefined;
  reviewId: number;
}
@Injectable({
  providedIn: 'root',
})

export class ReviewService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createReview(reviewData: generatedReview) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${user?.token}`
        );
        return this.http.post<ReviewResponse>(
          `${API_URL}/review/create`,
          reviewData,
          { headers }
        );
      }),
      catchError(this.handleError)
    );
  }

  getLastReviews() {
    return this.http
      .get<ReviewCardResponse>(`http://localhost:3000/review`)
      .pipe(catchError(this.handleError));
  }

  getSelectedReview(id: number) {
    return this.http
      .post<ReviewResponse>(`${API_URL}/review/:id`, {
        id,
      })
      .pipe(catchError(this.handleError));
  }

  sendComment(commentData: CommentData) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${user?.token}`
        );
        return this.http.post<CommentData>(
          `${API_URL}/review/:id/comment`,
          commentData,
          { headers }
        );
      }),
      catchError(this.handleError)
    );
  }

  sendRating(rating: RatingData) {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${user?.token}`
        );
        return this.http.post<RatingData>(`${API_URL}/review/:id/rating`, rating,
        {
          headers
        });
      }),
      catchError(this.handleError)
    );
  }

  likeReview(data:{authorId:number | undefined,reviewId:number}){
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${user?.token}`
        );
        return this.http.post<{message:string}>(`${API_URL}/review/:id/like`, data,
        {
          headers
        });
      }),
      catchError(this.handleError)
    );
  }

  unlikeReview(data:{authorId:number | undefined,reviewId:number}){
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${user?.token}`
        );
        return this.http.post<{message:string}>(`${API_URL}/review/:id/unlike`, data,
        {
          headers
        });
      }),
      catchError(this.handleError)
    );
  }

  editReview(reviewData:generatedReview){
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${user?.token}`
        );
        return this.http.post<any>(`${API_URL}/users/:id/account/reviews/:id/edit`, reviewData,
        {
          headers
        });
      }),
      catchError(this.handleError)
    );
  }

  
  private handleError(errRes: HttpErrorResponse) {
    let errorMessage = `Unknown Error occured!`;
    if (!errRes.error || !errRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = errRes.error.error;
    return throwError(errorMessage);
  }
}

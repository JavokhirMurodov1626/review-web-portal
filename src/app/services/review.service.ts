
import { API_URL } from './../../environments/environment';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageFile } from '../create-review/create-review.component';
import { AuthService } from './auth.service';
import { take, exhaustMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Review } from './review.model';
import { ReviewCardResponse } from '../home/reviewCard.model';


export interface generatedReview {
  authorId: number;
  title: string;
  productName: string;
  productGroup: string;
  productGrade: number;
  description: string;
  images?: string[];
  content: string;
  tags: string[];
}

export interface ReviewResponse{
    message:string,
    review:Review
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
        return this.http.post<ReviewResponse>(`${API_URL}/review/create`, reviewData, {headers});
      }),
      catchError(this.handleError)
    );
  }

  getLastReviews(){
    return this.http.get<ReviewCardResponse>(`${API_URL}/review`).pipe(
        catchError(this.handleError)
    )
  }

  getSelectedReview(id:number){
    return this.http.post<ReviewResponse>(`${API_URL}/review/:id`,{
        id
    }).pipe(catchError(this.handleError))
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

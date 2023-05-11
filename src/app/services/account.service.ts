import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take, exhaustMap, catchError, throwError } from 'rxjs';
import { API_URL } from 'src/environments/environment';
import { AuthService } from './auth.service';

export interface UserReview{
    id:number,
    title:string,
    product:{id:number,name:string},
    group:string,
    rating:{value:number}[],
    _count:{
        likes:number,
        rating:number
    },
    avgRating?:number
}

interface UserReviewResponse{
    reviews:UserReview[]
}

interface DeletedUserReview{
    id:number
}

@Injectable({
    providedIn:'root'
})

export class AccountService {

    constructor(private http: HttpClient, private authService: AuthService) {}

    getUserReviews(){
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user) => {
              const headers = new HttpHeaders().set(
                'Authorization',
                `Bearer ${user?.token}`
              );
              return this.http.post<UserReviewResponse>(`${API_URL}/users/:id/account`,{id:user?.id},
              {
                headers
              });
            }),
            catchError(this.handleError)
          );
    }

    deleteReview(reviewId:number){
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user) => {
              const headers = new HttpHeaders().set(
                'Authorization',
                `Bearer ${user?.token}`
              );
              return this.http.post<DeletedUserReview>(`${API_URL}/users/:id/account/reviews/:id/delete`,{id:reviewId},
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
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface AuthResponse {
  name: string;
  message: string;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  register(name: string, email: string, password: string) {
    return this.http
      .post<AuthResponse>('http://localhost:3000/register', {
        name,
        email,
        password,
      })
      .pipe(
        catchError((errRes) => {
          let errorMessage = `Unknown Error occured!`;
          console.log(errRes)
          if (!errRes.error || !errRes.error.error) {
            return throwError(errorMessage);
          }
          errorMessage = errRes.error.error;
          return throwError(errorMessage);
        })
      );
  }
}
